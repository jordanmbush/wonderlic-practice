# Deploying freewonderlicpractice.com

This is the whole path from "nothing exists yet" to "the site is live and
deploys itself". Follow it in order the first time; after that you will only
ever need steps 6 and 7.

**What you are building.** The site is static HTML. `npm run build` produces a
folder called `dist/`, those files are copied into an S3 bucket, and CloudFront
(Amazon's CDN) serves them worldwide. There is no server, no database and
nothing running between deploys. That is why it should cost about $0/month, and
why there is nothing that can crash at 2am.

**Two words worth knowing.**

- **SST** is the tool that creates the AWS pieces for you. It reads
  `sst.config.ts` and makes reality match it. You never click any of this
  together by hand.
- **A stage** is one complete copy of the site. `production` is the real one
  with the real domain. `dev` is a throwaway copy on an ugly CloudFront URL,
  used to prove the pipeline works before pointing the real domain at anything.

**Steps that must be done by hand in a web browser are marked 🖐 IN THE
BROWSER.** Everything else is a command you can copy.

---

## 1. Create the AWS account

🖐 **IN THE BROWSER.** There is no way to create an AWS account from the command
line.

1. Go to <https://aws.amazon.com/> and choose **Create an AWS Account**.
2. Use an email address you control and can keep forever. An alias like
   `you+aws-wonderlic@gmail.com` works and makes the account's mail easy to
   find later. **Do not reuse an email address already attached to another AWS
   account** — AWS will refuse it.
3. You will need a credit card (AWS verifies it with a small temporary charge)
   and a phone number for a verification code.
4. When asked to choose a support plan, pick **Basic — Free**.

The email and password you just created are the **root user**. Treat it like the
key to a safe: it can close the account, change the billing details and undo
anything else. You will use it four times in this document and then almost
never again.

### 1a. Turn on MFA for the root user — do this now, not later

🖐 **IN THE BROWSER.**

1. Sign in at <https://console.aws.amazon.com/> as the root user.
2. Top right, click your account name → **Security credentials**.
3. Under **Multi-factor authentication (MFA)**, click **Assign MFA device**.
4. Choose **Authenticator app**, scan the QR code with your phone's
   authenticator, and enter two consecutive codes.

An AWS account with a password-only root user and a credit card attached is a
genuinely attractive target — the usual outcome is someone running crypto
mining in every region and a five-figure bill. Five minutes now removes that
entire category of problem.

### 1b. Set a billing alarm — this is the real cost protection

🖐 **IN THE BROWSER.** Still signed in as root:

1. Account name → **Account**. Scroll to **IAM user and role access to Billing
   Information**, click **Edit**, tick **Activate IAM Access**, save. Without
   this, only the root user can ever see the bill.
2. Go to **Billing and Cost Management** → **Budgets** → **Create budget**.
3. Choose **Customize (advanced)** → **Cost budget**.
4. Period **Monthly**, budget amount **$5.00**.
5. Add two alerts, both emailing you:
   - **Actual** cost greater than **$1.00**
   - **Forecasted** cost greater than **$5.00**

**Why those numbers.** This site is expected to cost approximately nothing:
CloudFront's free tier covers 1 TB of traffic and 10 million requests a month
forever, and the site itself is a few megabytes in S3. So $1 of *actual* spend
is not "a bit over budget" — it means something is running that you did not
intend, and you want to hear about it on day two rather than on the statement.
$5 is a ceiling low enough to be meaningful and high enough not to cry wolf
over a stray cent of tax.

**Understand what a budget does and does not do.** It sends an email. It does
**not** stop spending, and AWS has no switch that does. The alert is the whole
protection, which is why it is worth setting before anything is deployed rather
than after.

---

## 2. Set up sign-in and the `wonderlic` command-line profile

You need two things: a way to sign in to the console that is not the root user,
and a way for the `aws` and `sst` commands on your laptop to prove who you are.
**IAM Identity Center** gives you both, and it is free.

### 2a. Turn on IAM Identity Center

🖐 **IN THE BROWSER**, signed in as root:

1. Search for **IAM Identity Center** and open it. Click **Enable**.
2. It will ask for a region to host itself in — choose **us-west-1 (N.
   California)** so everything lives in one place.
3. Note the **AWS access portal URL** it shows you. It looks like
   `https://d-xxxxxxxxxx.awsapps.com/start`. You need it in a moment; bookmark
   it.
4. **Users** → **Add user**. Use your normal email. You will get an invitation
   email — accept it and set a password and MFA.
5. **Permission sets** → **Create permission set** → **Predefined** →
   **AdministratorAccess**. Accept the defaults.
6. **AWS accounts** → tick your account → **Assign users or groups** → pick
   your user → pick the **AdministratorAccess** permission set → submit.

From now on, sign in through the access portal URL, not as root.

### 2b. Create the `wonderlic` CLI profile

Back in a terminal. If you do not have the AWS CLI, install it first
(`brew install awscli` on a Mac).

```bash
aws configure sso
```

Answer the prompts:

| Prompt                  | Answer                             |
| ----------------------- | ---------------------------------- |
| SSO session name        | `wonderlic`                        |
| SSO start URL           | the access portal URL from step 2a |
| SSO region              | `us-west-1`                        |
| SSO registration scopes | press Enter for the default        |

A browser window opens for you to approve. Then it asks which account and role
(pick your account and `AdministratorAccess`), and finally:

| Prompt                    | Answer          |
| ------------------------- | --------------- |
| CLI default client Region | `us-west-1`     |
| CLI default output format | `json`          |
| CLI profile name          | **`wonderlic`** |

The profile name matters: `sst.config.ts` and the deploy scripts both look for
a profile called exactly `wonderlic`.

Check it works:

```bash
aws sso login --profile wonderlic
aws sts get-caller-identity --profile wonderlic
```

That prints your account id. **Write it down** — and while you are at it, paste
it into the placeholder near the top of `sst.config.ts`, which currently reads
`<ACCOUNT_ID — fill this in once the account exists>`.

These sign-ins expire (typically after 8–12 hours). When a command suddenly
says your credentials are expired, run `aws sso login --profile wonderlic`
again. That is normal, not a fault.

---

## 3. Create the private GitHub repository and push

The repo is **private**. The question bank is the only thing this site really
owns, and a public repo is an invitation to copy it wholesale.

If you have not used the GitHub CLI before, run `gh auth login` first and
follow the prompts.

From the project folder:

```bash
gh repo create jordanmbush/wonderlic-practice --private --source=. --remote=origin --push
```

That creates the repository, adds it as `origin`, and pushes your current
branch. Confirm the default branch is `main`:

```bash
gh repo view --json defaultBranchRef --jq .defaultBranchRef.name
```

If it says anything other than `main`, note it — step 8 explains why the deploy
role cares.

> **A note on cost.** Actions minutes are free on public repos and metered on
> private ones (2,000 minutes a month on the free plan). This project's CI is
> one install and one build, a minute or two per run, and it only runs on `main`
> and `develop`. You will not come close to the limit.

---

## 4. Give GitHub permission to deploy

```bash
aws sso login --profile wonderlic
bash scripts/setup-github-oidc.sh
```

This is a one-time setup and is safe to run again any time.

**What it creates in your AWS account:**

1. A trust relationship between AWS and GitHub Actions ("OIDC"), so a workflow
   run can prove which repository and branch it is, and get temporary AWS
   credentials for the length of that run.
2. A role called `github-actions-wonderlic-practice-deploy` that only workflow
   runs from **this** repository's `main` or `develop` branch may use.
3. A permission policy on that role, limited to the services this site
   actually uses — S3, CloudFront, ACM (certificates), and the small
   supporting pieces SST creates. It is not an administrator.
4. A GitHub repository **variable** called `AWS_DEPLOY_ROLE_ARN`, holding the
   role's identifier, which `.github/workflows/deploy.yml` reads.

**Why this rather than an access key.** There is no long-lived AWS password
anywhere — not on your laptop, not in GitHub's secrets, not in a file you might
paste into a chat. Each workflow run gets credentials that expire an hour
later. There is nothing to rotate and nothing to leak.

The script refuses to run if it finds AWS access keys already stored as GitHub
secrets, because having both means the weaker one eventually wins.

---

## 5. Get the Cloudflare credentials

The domain is registered at Cloudflare, and Cloudflare answers DNS for it. The
deploy needs to write two kinds of record: the one pointing the domain at
CloudFront, and the temporary ones that prove to Amazon you own the domain so
it will issue an HTTPS certificate.

### 5a. The zone ID

🖐 **IN THE BROWSER.**

1. Sign in at <https://dash.cloudflare.com/>.
2. Click **freewonderlicpractice.com**.
3. On the **Overview** page, look down the right-hand side for **Zone ID**.
   Copy it.

A "zone" is Cloudflare's word for one domain. The zone ID is not secret — it
just names which domain to edit.

### 5b. The API token

🖐 **IN THE BROWSER.**

1. Top-right profile icon → **Profile** → **API Tokens**.
2. **Create Token**.
3. Find the template called **Edit zone DNS** and click **Use template**.
4. Under **Zone Resources**, set it to **Include → Specific zone →
   freewonderlicpractice.com**. This is the important part: it limits the token
   to this one domain, so it cannot touch anything else in your Cloudflare
   account.
5. Leave the permissions as the template set them. It grants **two** things:
   **Zone:DNS:Edit** and **Zone:Zone:Read**. ⚠️ **Do not remove the Read
   line.** It looks redundant and it is not — the deploy reads the zone to
   discover your Cloudflare account ID, and without Read the deploy fails with
   a message about an account ID that sounds like a broken token.
6. Optionally set an expiry date. If you do, put a reminder in your calendar;
   an expired token fails the deploy, not the site.
7. **Continue to summary** → **Create Token**.
8. **Copy the token now.** Cloudflare shows it exactly once.

### 5c. Put them into GitHub

```bash
gh secret set CLOUDFLARE_API_TOKEN     # paste the token when prompted
gh secret set CLOUDFLARE_ZONE_ID       # paste the zone ID when prompted
```

Optional, and it makes the deploy slightly simpler and more robust — your
Cloudflare account ID, visible in the dashboard URL and on the Overview page:

```bash
gh variable set CLOUDFLARE_ACCOUNT_ID --body "<your cloudflare account id>"
```

**Secrets versus variables.** Secrets are hidden from logs and can never be
read back. Variables are plain text. The token is a secret; the zone ID is kept
as a secret only so the pair stays together; the role ARN and account ID are
variables because they are not sensitive.

To check what is set:

```bash
gh secret list
gh variable list
```

You should see `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` as secrets, and
`AWS_DEPLOY_ROLE_ARN` (from step 4) as a variable.

### 5d. Clear any conflicting DNS records

🖐 **IN THE BROWSER.** In Cloudflare → **DNS** → **Records**, delete any
existing `A`, `AAAA` or `CNAME` record for the bare domain (`@`) or for `www`.
A freshly-registered domain often has a parked placeholder record, and it will
fight with what the deploy is about to write.

Leave `MX` and `TXT` records alone — they are mail and verification, and are
unrelated.

The records the deploy creates are written **DNS-only** (grey cloud, not
orange). That is deliberate: CloudFront is already the CDN, and routing through
Cloudflare's proxy as well would terminate HTTPS twice for no benefit. If you
ever see an orange cloud on these records, turn it off.

---

## 6. The first deploy

### 6a. Deploy `dev` first — always

```bash
npm ci
aws sso login --profile wonderlic
npx sst deploy --stage dev
```

The first run takes roughly 5–10 minutes; it is creating a CloudFront
distribution from scratch. It finishes by printing a URL like
`https://d111111abcdef8.cloudfront.net`.

This stage uses **no custom domain and no Cloudflare credentials at all**. That
is the entire point of doing it first: if this works, then your AWS account,
your profile, the build and the upload are all proven, and anything that goes
wrong next is a domain problem and nothing else. Debugging one thing at a time
is much faster than debugging five.

Open the URL. Then run the smoke checks against it:

```bash
bash scripts/post-deploy-smoke.sh https://d111111abcdef8.cloudfront.net
```

### 6b. Deploy `production`

You can do this from your laptop, or let GitHub do it. **Letting GitHub do it
is the normal path** — the laptop route mainly exists for the very first run
and for emergencies.

**From GitHub (normal):** merge to `main` and push. `CI` runs; if it passes,
`Deploy` runs automatically, deploys production, and runs the smoke checks. If
anything fails it opens an issue on the repository.

**From your laptop (first run or emergency):**

```bash
aws sso login --profile wonderlic

export CLOUDFLARE_API_TOKEN="<the token from step 5b>"
export CLOUDFLARE_ZONE_ID="<the zone id from step 5a>"
export CLOUDFLARE_DEFAULT_ACCOUNT_ID="<your cloudflare account id>"

npx sst deploy --stage production
```

All three are needed locally. In GitHub, the third one is worked out for you by
a step in `deploy.yml`.

**The first production deploy is the slow one.** It pauses — sometimes for ten
minutes or more — while Amazon issues the HTTPS certificate and waits for the
DNS records proving you own the domain to become visible. This looks like it
has hung. It has not. Let it run.

If you are in a fresh terminal and forget the environment variables, the deploy
stops immediately with a message naming `CLOUDFLARE_ZONE_ID`. That refusal is
deliberate: a "successful" deploy that quietly left the real domain pointing
nowhere would be much worse than a failure.

### 6c. Tell Google the site exists

🖐 **IN THE BROWSER.** Once the domain serves:

1. Go to <https://search.google.com/search-console> and add a **Domain**
   property for `freewonderlicpractice.com`.
2. It gives you a **TXT** record to add. Add it in Cloudflare → **DNS** →
   **Records** by hand.
3. Once verified, submit `https://freewonderlicpractice.com/sitemap-index.xml`
   under **Sitemaps**.

Search Console is how this site is measured. It is free, it adds nothing to the
page, and it sets no cookies — which matters, because the site's own `/privacy`
page promises visitors there is no analytics and no tracking. Anything added
later has to keep that promise or change that page in the same commit.

---

## 7. Afterwards, and how to undo a deploy

### What to check

```bash
bash scripts/post-deploy-smoke.sh https://freewonderlicpractice.com
```

This checks the things that can only break on the live site: that pages serve,
that the certificate is valid, that `robots.txt` and the sitemap are there,
that a wrong URL returns a proper "not found", and that the caching headers
will let your next deploy actually be seen. It builds its page list from the
deployed sitemap, so a page that silently failed to upload is caught.

It retries with growing pauses, because CloudFront takes a few seconds to stop
serving its old cached answers. A check that passes "after 3 attempts" is
normal.

Then, by eye:

```bash
curl -sSI https://www.freewonderlicpractice.com | head -n 1   # expect 301
```

`www` exists only to redirect to the bare domain. Two addresses serving
identical pages is a problem for search rankings.

And a day or two later, check **Billing and Cost Management → Cost Explorer**
in the AWS console once. You are looking for a number near zero. After that the
budget alarm from step 1b watches it for you.

### Rolling back

There is no "previous version" button, and there deliberately isn't one — the
site is rebuilt from source every time, so the source **is** the history.

**The normal rollback** is to undo the change and let the pipeline run:

```bash
git revert <the bad commit>
git push origin main
```

CI builds it, Deploy ships it, and you are back where you were in a few
minutes. This is preferred because the repository and the live site stay in
agreement.

**The fast rollback**, when you need the old site back right now:

```bash
git checkout <a known-good commit>
aws sso login --profile wonderlic
export CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... CLOUDFLARE_DEFAULT_ACCOUNT_ID=...
npx sst deploy --stage production
```

Then still do the `git revert` afterwards, or the next merge to `main` will put
the broken version straight back.

**A failed deploy is not an outage.** CloudFront keeps serving the previous
files until new ones have uploaded successfully. If a deploy dies halfway, the
site visitors see is the one from before.

### Tearing down `dev`

```bash
npx sst remove --stage dev
```

Production is marked `protect` and `retain` in `sst.config.ts`, so the same
command aimed at production is refused, and even a forced removal leaves the
bucket holding the live site alone.

---

## 8. When something goes wrong

### "The Cloudflare Account ID was not able to be determined from this token"

The Cloudflare tool insists on knowing your account ID even though this deploy
only edits one known domain. It tries to find it by listing all your accounts,
which a token scoped to one zone is not allowed to do.

- **In GitHub:** set the `CLOUDFLARE_ACCOUNT_ID` repository variable
  (step 5c). That skips the lookup entirely.
- **Locally:** `export CLOUDFLARE_DEFAULT_ACCOUNT_ID=<your account id>`.
- **Either way**, check your token still carries **Zone:Zone:Read** as well as
  **Zone:DNS:Edit**. The "Edit zone DNS" template grants both; a hand-built
  token often has only the edit half, and this is where that shows up.

Broadening the token to let it list accounts would also "fix" it, and is the
wrong trade — it gives a deploy credential the run of your whole Cloudflare
account to learn one ID that is not even secret.

### "Not authorized to perform sts:AssumeRoleWithWebIdentity"

GitHub could not use the AWS role. The role's trust policy names specific
branches, and something about the branch does not match.

The awkward part is that the error never says _which_ part failed, and the
credentials are not printed in the log. AWS does record it, though:

```bash
aws cloudtrail lookup-events --profile wonderlic --region us-west-1 \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithWebIdentity \
  --max-results 1 --query 'Events[].CloudTrailEvent' --output text | jq .userIdentity
```

That prints the exact identity GitHub presented, which you can compare against
the trust policy.

The usual cause: **a deploy triggered by a finished CI run identifies itself
with the repository's _default_ branch, not the branch that was merged.** So
even though deploys only happen from `main`, the role must trust whatever your
default branch is. `scripts/setup-github-oidc.sh` trusts `main` and `develop`
for exactly this reason. If you have renamed the default branch to something
else, add it to that script's trust list and run the script again.

Re-running the script is also the fix if you renamed or transferred the
repository — the trust policy pins GitHub's internal numeric IDs.

### "failed to get shared config profile, wonderlic" during a GitHub deploy

`sst.config.ts` uses the named profile `wonderlic` on your laptop and no
profile at all in CI, where credentials arrive from the OIDC role instead.
GitHub runners have no AWS config file, so naming a profile there fails
outright — confusingly, _after_ the credentials step has already gone green.

The switch is `process.env.CI`, which GitHub Actions always sets. If you see
this, something is running the deploy in a way that does not set `CI=true`. Set
it, or run the deploy through the workflow.

The mirror image of this is local: "Unable to locate credentials" or "token has
expired" on your own machine just means `aws sso login --profile wonderlic`.

### A `dev` deploy fails with "Invalid access token"

That is a Cloudflare error appearing on a stage that should never touch
Cloudflare. `sst.config.ts` only declares the Cloudflare provider for
`production` precisely so this cannot happen — if it has started happening,
that condition has been changed or removed.

### An unknown URL returns "502 Error from cloudfront" instead of 404

Two settings in `sst.config.ts` work together to produce a proper 404: the
distribution's custom error responses are deliberately emptied, and CloudFront
is granted `s3:ListBucket` on the bucket. Remove either and you get a 502. The
long explanation is in the comments there; the smoke checks assert it on every
deploy.

### Some files are missing from the live site, but every page works

Almost certainly the `fileOptions` list in `sst.config.ts`. That list
**replaces** the default one, and SST only uploads files matching an entry in
it — so a pattern that was removed doesn't just lose its caching header, those
files never get uploaded. The `**` catch-all must stay first in the list. This
has bitten the sibling site, silently, with every page still serving perfectly.

### The smoke checks fail on the sitemap

The script builds its page list from the deployed `sitemap-index.xml`, so it
needs `@astrojs/sitemap` to be configured in `astro.config.mjs`. If the sitemap
integration has been removed, the smoke checks go red even though the site is
fine. The site needs a sitemap for search anyway, so the fix is to put it back
rather than to weaken the check.

### The certificate never finishes validating

Amazon waits for a DNS record proving you own the domain. Check in Cloudflare
that the validation `CNAME` record exists and is **DNS-only (grey cloud)** — a
proxied record will not validate. Also check there is no `CAA` record on the
domain that excludes `amazon.com`.

### A deploy was cancelled and now every deploy says the state is locked

SST holds a lock while it works, and killing it mid-run leaves that lock
behind:

```bash
npx sst unlock --stage production
```

Only do this when you are certain nothing else is deploying — the deploy
workflow queues runs rather than cancelling them, for this reason.
