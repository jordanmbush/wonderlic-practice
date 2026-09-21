# Prep Sprint

A study app for the Wonderlic test: 50 questions in 12 minutes, scored as the number you get right. It also covers the school-admissions version (the SLE) and its shorter form (the SLE-Q) — both are options on the Test page. No install, no build step.

## Run it

Double-click `index.html` to open it in your browser. Progress is saved in that browser.

To use it on a phone on the same Wi-Fi, run `python3 -m http.server 8000` in this folder and open `http://<your-computer-ip>:8000`.

## What's inside

- **Learn**: a plain-English lesson with worked examples for each of the 15 question types, plus test-day strategy.
- **Practice**: untimed, with an explanation after every question and your time compared to the 14-second pace.
- **Fast way**: miss a question, or take longer than 14 seconds, and you also get a one-line shortcut for doing that kind of question in your head.
- **Speed Drill**: "beat the clock" (14 seconds per question), a 3-minute sprint, or a 25-question mini test.
- **Full Test**: 50 questions in 12 minutes, or the short version some schools use (30 questions, 8 minutes). Questions get harder as you go, then you get a score, a breakdown by topic, and a review of every question.
- **Test type**: pick SLE (school admissions) or Wonderlic (job applications) on the Test page or in Progress → Settings. It changes which topics come up — the SLE mix leans on vocabulary, grammar and logic with only a couple of shape questions; the job mix has more shapes, patterns and detail checking. The setting is saved, and both are still 50 questions in 12 minutes.
- **Review Mistakes**: every question you miss is saved. Answer it correctly and it leaves the list.
- **Progress**: your score history against your target score, plus accuracy and speed for each topic.

Keyboard: `A`–`E` or `1`–`5` to answer, `Enter` for next, `←`/`→` to move around during a test.

## Questions

- `js/bank/*.js`: hand-written questions (vocabulary, analogies, sayings, odd one out, grammar). Add more by adding objects to these lists.
- `js/generators.js`: templates that build a fresh question every time (math, number series, letters, logic, dates, detail checking, scrambled sentences), so these never run out.
- `js/spatial.js`: shape and pattern questions, drawn as inline SVG.
- `js/lessons.js`: lesson content.
- `js/tips.js`: the fallback "fast way" line for each written topic. Generated questions carry their own tip in `js/generators.js`.

## Before launching it publicly

"Wonderlic" is a registered trademark of Wonderlic, Inc., so the site keeps its own name separate from the test's name. The test is only ever named to say what the site helps you prepare for.

- **Site name** lives in three places: `SITE.name` in `js/core.js`, and the `<title>` and header link in `index.html`. "Prep Sprint" is a placeholder — replace it once a domain is picked.
- **Disclaimer** sits in the footer of `index.html` and appears on every page. Leave it there.
- **Terms & Privacy** is `js/legal.js`, shown at `#/legal`. Two things still to do before launch: add a real contact email, and have a lawyer read it.
- **The privacy text says the site collects nothing.** That is true only while there is no analytics, no ads and no sign-up form. Adding any of those means rewriting that section first, and probably adding cookie consent.
- **Never add real test questions**, and don't copy questions from other prep sites. Everything here being original is the main thing protecting the site.
