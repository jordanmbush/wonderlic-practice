/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST v4 — the whole infrastructure for freewonderlicpractice.com.
 *
 * It is deliberately small, and small here is the point. The site is STATIC:
 * `astro build` writes HTML to `dist/`, SST uploads it to S3 and puts
 * CloudFront in front. There is no VPC, no NAT, no database, no Lambda holding
 * a session — so there is no origin that can be down, and nothing that bills
 * by the hour. A few megabytes in S3 plus CloudFront's free tier is the entire
 * running cost; see the note above `site` for what was deliberately NOT built
 * to keep it that way.
 *
 * AWS account <ACCOUNT_ID — fill this in once the account exists; see
 * docs/deploying.md step 1>. Brand-new and dedicated to this site, so the bill
 * is unambiguous: any dollar in Cost Explorer belongs to this site and nothing
 * else. SSO profile `wonderlic`, region us-west-1.
 *
 * Note that the CloudFront certificate is issued in us-east-1 regardless —
 * CloudFront only reads ACM certs from there — but SST handles that
 * cross-region provisioning itself. Nothing below has to care.
 *
 * Stages:
 *   production  freewonderlicpractice.com + www redirect, DNS on Cloudflare.
 *   dev         CloudFront URL only, no custom domain. This is what makes the
 *               pipeline verifiable without holding the Cloudflare token —
 *               deploy dev first, always, when something about the pipeline
 *               itself is in question.
 *   anything else → also domain-less, so a throwaway stage can never take over
 *               the live hostname by accident.
 *
 * DNS: the domain is Cloudflare-registered and Cloudflare-authoritative. SST's
 * Cloudflare adapter writes the app's CNAME and the ACM validation records;
 * there is no Route53 zone at all, which also means no $0.50/month hosted-zone
 * charge. Records are written DNS-only (gray cloud) — CloudFront is already
 * the CDN, and proxying through Cloudflare on top would double up TLS
 * termination for nothing.
 *
 * Env vars that gate production, read at deploy time and never committed:
 *   CLOUDFLARE_API_TOKEN   scoped to this zone only. Needs Zone:Read as well
 *                          as DNS:Edit — the "Edit zone DNS" template grants
 *                          both, and the account lookup in deploy.yml needs
 *                          the read half.
 *   CLOUDFLARE_ZONE_ID     not secret, but kept alongside for symmetry
 *   CLOUDFLARE_DEFAULT_ACCOUNT_ID
 *                          SST demands an account id even for a DNS-only
 *                          deploy, and a zone-scoped token can't list accounts
 *                          to find one. deploy.yml reads it off the zone; set
 *                          it by hand for a local `--stage production` run.
 */

const DOMAIN = "freewonderlicpractice.com";

export default $config({
  app(input) {
    const production = input?.stage === "production";
    return {
      name: "wonderlic-practice",
      // `retain` on production so a stray `sst remove` can't delete the bucket
      // holding the live site; dev is disposable.
      removal: production ? "retain" : "remove",
      protect: production,
      home: "aws",
      providers: {
        aws: {
          region: "us-west-1",
          // A named profile locally, nothing in CI.
          //
          // On a developer machine credentials come from `aws sso login
          // --profile wonderlic`. On a GitHub runner they arrive as
          // AWS_ACCESS_KEY_ID/SECRET/SESSION_TOKEN from the OIDC role
          // assumption, and there is no shared config file at all — naming a
          // profile there fails the deploy outright with "failed to get shared
          // config profile, wonderlic", after OIDC has already succeeded and
          // therefore well after the point where it looks like a credentials
          // problem.
          profile: process.env.CI ? undefined : "wonderlic",
        },
        // Only production declares the Cloudflare provider. Declaring it
        // unconditionally makes Pulumi initialize and AUTHENTICATE it on every
        // stage, so a domain-less dev deploy fails with "Invalid access token"
        // despite never touching DNS — which would defeat the whole reason dev
        // exists. Pinned rather than floating: a provider major can change
        // record resource shapes and silently recreate DNS.
        ...(production ? { cloudflare: "6.16.0" as const } : {}),
      },
    };
  },

  async run() {
    const production = $app.stage === "production";

    // Only production claims the hostname. A dev or throwaway stage gets the
    // CloudFront URL, so it can deploy with no Cloudflare credentials at all.
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    if (production && !zoneId) {
      throw new Error(
        "CLOUDFLARE_ZONE_ID is required for the production stage — it's what points freewonderlicpractice.com at this distribution. Export it (and CLOUDFLARE_API_TOKEN, from the 'Edit zone DNS' template scoped to this zone) before deploying.",
      );
    }

    /**
     * What is deliberately NOT here: the access-log bucket, its lifecycle
     * rules, and a CloudWatch traffic dashboard.
     *
     * All three are cheap rather than free, and this site may never earn a
     * dollar — so the target is a bill that rounds to zero, not a bill that is
     * merely small. As built, CloudFront's perpetual free tier (1 TB egress
     * and 10M requests a month) plus a few megabytes of S3 should mean roughly
     * $0/month. Access logging would add per-request delivery charges, S3
     * storage that grows forever without the lifecycle rules, and the requests
     * to write it; a dashboard is $3/month past the first three. Turning any
     * of that on is a real decision with a real number attached, not a
     * default.
     *
     * Traffic is measured with Google Search Console instead: free, no script
     * on the page, no cookie, and verified with a DNS TXT record in the same
     * Cloudflare zone this config already writes to. It answers the questions
     * that actually matter for a study site — which queries find it, which
     * pages rank, whether Google can crawl it — better than a request count
     * ever would.
     *
     * ⚠️ Whatever gets added later has to respect the site's own /privacy
     * page, which promises no analytics and no tracking cookies. That page is
     * a statement to visitors, not a preference: it may not be quietly
     * outgrown. Anything that changes what is collected changes that page in
     * the same pull request, or it does not ship.
     */
    const site = new sst.aws.StaticSite("Site", {
      build: {
        command: "npm run build",
        output: "dist",
      },
      domain: production
        ? {
            name: DOMAIN,
            // The www alias exists to redirect, not to serve: two hostnames
            // serving identical HTML is a duplicate-content problem, and the
            // canonical tags name the apex.
            redirects: [`www.${DOMAIN}`],
            dns: sst.cloudflare.dns({ zone: zoneId! }),
          }
        : undefined,
      /**
       * ⚠️ `fileOptions` REPLACES SST's default list, and SST only uploads
       * files that MATCH some entry. The default starts with a `**`
       * catch-all, so omitting one doesn't just lose a cache header — those
       * files are never uploaded at all. On schoolskills, the sibling repo
       * this config is modelled on, a list without the catch-all silently left
       * the icons and the Open Graph image off the live site while every page
       * still served perfectly, which is the hardest kind of outage to notice.
       * Keep the catch-all first.
       *
       * Precedence is LAST-MATCH-WINS: SST reverses this array and skips files
       * it has already processed, so the most specific rule goes at the bottom.
       */
      assets: {
        fileOptions: [
          // Catch-all. Unhashed and therefore not immutable — icons and the OG
          // card do change, just rarely.
          {
            files: "**",
            cacheControl: "public,max-age=3600,s-maxage=86400,must-revalidate",
          },
          // Astro content-hashes everything it bundles into `_astro/`: the
          // bytes at a given URL can never change, so these are immutable
          // forever. This is also most of what a visitor downloads, which is
          // why the CloudFront bill stays near zero — repeat visits fetch
          // almost nothing.
          {
            files: "_astro/**",
            cacheControl: "public,max-age=31536000,immutable",
          },
          // Documents must revalidate or a deploy takes a day to become
          // visible. Listing an extension the site doesn't have yet costs
          // nothing; omitting one it does have costs a stale page nobody can
          // flush from a visitor's browser.
          {
            files: ["**/*.{html,xml,txt,json,webmanifest}"],
            cacheControl: "public,max-age=0,s-maxage=86400,must-revalidate",
          },
          // ⚠️ If a service worker is ever added it needs its own entry here
          // with `max-age=0`. A cached service worker keeps controlling the
          // page and keeps applying its own old cache rules, so it survives
          // the deploy meant to replace it — the one bad cache header that
          // cannot be fixed remotely.
        ],
      },
      // Astro writes this from src/pages/404.astro.
      //
      // Today this is a statement of intent more than a live setting: the
      // `cdn` transform below empties the custom error responses it produces,
      // for the reason written there. Deleting that transform is what turns
      // the branded 404 page back on — and brings the 502 back with it.
      // /404.html is built either way and is reachable directly.
      errorPage: "404.html",
      transform: {
        /**
         * Return a real 404 instead of a 502 on unknown paths.
         *
         * SST's StaticSite doesn't give the distribution a real origin: it
         * leaves `placeholder.sst.dev` configured and has its CloudFront
         * Function call `updateRequestOrigin()` to point at the S3 bucket per
         * request. That works for every normal request.
         *
         * It does NOT work for a CloudFront custom error response. When S3
         * answers 403/404, CloudFront fetches `responsePagePath` itself — and
         * that internal fetch does not run viewer-request functions, so no
         * origin is ever set and it goes to the placeholder host. The visitor
         * gets `502 Error from cloudfront` for what is simply a wrong URL.
         * That reads as a broken site to a person, and to Google it reads as a
         * server fault rather than a missing page — which for a site whose
         * entire traffic plan is organic search is the expensive half.
         *
         * So: drop the custom error responses entirely and let S3's own status
         * pass straight through. CloudFront won't accept `responseCode`
         * without `responsePagePath` ("must specify both together"), so
         * rewriting the status without a page isn't an option either.
         *
         * On its own that would surface 403, not 404 — with only `s3:GetObject`
         * granted, S3 hides the difference between "missing" and "forbidden"
         * to avoid leaking which keys exist. The `assets` transform below adds
         * `s3:ListBucket`, which is exactly the permission that lets S3 answer
         * NoSuchKey. The bucket stays private; listing is granted to the
         * CloudFront service principal, not to the public.
         *
         * Result: a wrong URL gets a correct 404. The body is S3's plain XML
         * rather than the branded page — status right, styling lost. Serving
         * the real page needs the distribution to own a genuine S3 origin so
         * the error re-fetch has somewhere to go; that is its own piece of
         * work, and the status code is the part search engines read.
         *
         * post-deploy-smoke.sh asserts 404-and-not-502 on every deploy, which
         * is how a regression here gets caught.
         *
         * ⚠️ `args` here is the Cdn component's own `CdnArgs`, a CURATED
         * SUBSET of the CloudFront distribution — `domain`, `origins`,
         * `customErrorResponses` and a few friends. Assigning anything else
         * (`loggingConfig`, say) does not error: Pulumi drops it on the floor
         * and the distribution simply never gets the setting. Real
         * distribution fields go through a nested
         * `args.transform.distribution` callback instead. TypeScript would
         * catch it, but nothing type-checks this file — SST bundles it with
         * esbuild, which strips types without checking them. So if a setting
         * added here appears to do nothing, this is why.
         */
        cdn: (args) => {
          args.customErrorResponses = [];
        },
        assets: (args) => {
          args.transform = {
            ...args.transform,
            policy: (policyArgs) => {
              policyArgs.policy = $resolve([
                policyArgs.policy,
                policyArgs.bucket,
              ]).apply(([policy, bucket]) => {
                const doc =
                  typeof policy === "string"
                    ? JSON.parse(policy)
                    : JSON.parse(JSON.stringify(policy));
                doc.Statement.push({
                  Effect: "Allow",
                  Principal: { Service: "cloudfront.amazonaws.com" },
                  Action: "s3:ListBucket",
                  Resource: `arn:aws:s3:::${bucket}`,
                });
                return JSON.stringify(doc);
              });
            },
          };
        },
      },
    });

    return {
      url: site.url,
      stage: $app.stage,
    };
  },
});
