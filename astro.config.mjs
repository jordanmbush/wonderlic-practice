// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { GUIDES } from "./src/data/guides.mjs";

/**
 * Static output, because search is the whole point of this site.
 *
 * Every guide is HTML on disk before a request arrives. The practice engine
 * itself is still the same plain-JavaScript app it always was — it just lives
 * on one page (`/practice/`) instead of being the entire site. That page is
 * `noindex`: its body is an empty <main> until JavaScript fills it, so there
 * is nothing for a crawler to rank there, and the crawlable surface is the
 * guides around it.
 *
 * `site` is load-bearing: @astrojs/sitemap and every canonical URL are built
 * from it, so a wrong value here silently poisons both.
 */
export default defineConfig({
  site: "https://freewonderlicpractice.com",
  output: "static",
  integrations: [
    sitemap({
      /*
       * `/practice/` carries `noindex` (see Base.astro), so it must not appear
       * in the sitemap: submitting a URL while telling Google to ignore it is
       * a contradiction Search Console reports back at you.
       *
       * Everything else ships. The guide list is derived from GUIDES rather
       * than written out here, so a new guide cannot be added to the site and
       * quietly left out of the sitemap.
       */
      filter: (page) => !page.includes("/practice"),
      serialize: (item) => {
        // The home page is the one worth crawling most often; the guides are
        // written once and rarely touched. These are hints, not instructions
        // — Google treats priority as advisory — but a flat sitemap says
        // nothing at all, and saying something costs nothing.
        const path = new URL(item.url).pathname;
        if (path === "/")
          return { ...item, priority: 1.0, changefreq: "weekly" };
        if (GUIDES.some((g) => path === `/guides/${g.slug}/`))
          return { ...item, priority: 0.8, changefreq: "monthly" };
        return { ...item, priority: 0.3, changefreq: "yearly" };
      },
    }),
  ],
  // Emit `/guides/vocabulary/index.html` rather than `/guides/vocabulary.html`
  // so CloudFront can serve clean URLs straight from S3 with no rewrite
  // function in front of it.
  build: { format: "directory" },
  trailingSlash: "ignore",
});
