# Free Wonderlic Practice

[freewonderlicpractice.com](https://freewonderlicpractice.com)

A free study site for the Wonderlic test: 50 questions in 12 minutes, scored as the number you get right. It also covers the school-admissions version (the SLE) and its shorter form (the SLE-Q). Static site, no accounts, no tracking — progress stays in the visitor's own browser.

## Run it

```
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

Deployment is S3 + CloudFront via SST. **[docs/deploying.md](docs/deploying.md) is the runbook** — start there, it assumes nothing exists yet.

## How it's laid out

The site is two halves, and the split is the whole architecture:

**The guides are what search finds.** They're prerendered HTML at real URLs (`/guides/number-series/`), built by Astro from the lesson content. Anything a person might search for lives here.

**The practice app is what they use.** It's still plain browser JavaScript — ordered `<script>` tags, no bundler, no framework — living on one page at `/practice/`. It paints itself with JavaScript, so it carries `noindex` and is left out of the sitemap; there's nothing there for a crawler to read.

```
src/pages/          the public pages (landing, guides, terms, privacy, the app's shell)
src/layouts/        Base.astro — every page's <head>, header and footer
src/data/guides.mjs the search titles and descriptions, and the guide order
src/data/lessons.js lesson content; read at BUILD time only, never shipped
src/data/content.mjs reads the app's own data so the two halves can't disagree
public/js/          the practice app, served as-is
public/css/         styles.css (the app) and site.css (the public pages)
sst.config.ts       the infrastructure
```

## What's inside

- **Guides**: a plain-English page per question type with worked examples, plus test-day strategy.
- **Practice**: untimed, with an explanation after every question and your time against the 14-second pace.
- **Fast way**: miss a question, or take longer than 14 seconds, and you get a one-line shortcut for doing that kind of question in your head.
- **Speed Drill**: beat the clock (14 seconds a question), a 3-minute sprint, or a 25-question mini test.
- **Full Test**: 50 questions in 12 minutes, or the short version some schools use (30 in 8). Questions get harder as you go, then you get a score, a topic breakdown, and a review of every question.
- **Test type**: SLE (school admissions) or Wonderlic (job applications), set in Progress → Settings. It changes which topics come up — SLE leans on vocabulary, grammar and logic; the job mix has more shapes, patterns and detail checking.
- **Review Mistakes**: every question you miss is saved until you get it right.
- **Progress**: score history against your target, plus accuracy and speed per topic.

Keyboard: `A`–`E` or `1`–`5` to answer, `Enter` for next, `←`/`→` to move around during a test.

## Adding questions

- `public/js/bank/*.js`: hand-written questions (vocabulary, analogies, sayings, odd one out, grammar). Add objects to these lists.
- `public/js/generators.js`: templates that build a fresh question every time (math, series, letters, logic, dates, detail checking, scrambled sentences), so these never run out.
- `public/js/spatial.js`: shape and pattern questions, drawn as inline SVG.
- `public/js/tips.js`: the fallback "fast way" line per written topic. Generated questions carry their own.

These files are in `.prettierignore` on purpose — a bank is data written to be scanned, and reflowing it to 80 columns makes the one thing anyone does here harder.

**Adding a question type** means four things, and the build fails loudly if you miss one: a `CATS` entry with a `slug` in `public/js/core.js`, questions, a lesson in `src/data/lessons.js`, and an entry in `META` + `ORDER` in `src/data/guides.mjs`.

## Things that must stay true

"Wonderlic" is a registered trademark of Wonderlic, Inc. This site names the test only to say what it helps you prepare for, which is what makes that use legitimate. Several things hold that up, and none are decoration:

- **The footer disclaimer in `Base.astro`** appears on every page. Leave it there — someone landing on one guide from search should see it without clicking.
- **The site's own name stays distinct from the mark's owner.** `SITE` in `public/js/core.js` is the single source; the `<title>` in each page's front matter is the only other place a name appears.
- **Never add real test questions**, and don't copy from other prep sites. Everything here being original is the main protection.
- **`/privacy` promises no analytics, no ads and no tracking cookies.** That's currently true, and it's why search traffic is measured with Google Search Console (a DNS TXT record, nothing on the page). Adding analytics, ads or a signup form means rewriting that page in the same change — and probably adding cookie consent for UK/EU visitors.
- **`contact@freewonderlicpractice.com` has to actually work.** `/terms` tells people to use it for corrections and takedown requests.

Still open: a lawyer has not read `/terms` or `/privacy`.
