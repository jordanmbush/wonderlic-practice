# Wonderlic SLE Practice

A study app for the Wonderlic SLE, the school-admissions version of the Wonderlic: 50 questions in 12 minutes, scored as the number you get right. No install, no build step.

## Run it

Double-click `index.html` to open it in your browser. Progress is saved in that browser.

To use it on a phone on the same Wi-Fi, run `python3 -m http.server 8000` in this folder and open `http://<your-computer-ip>:8000`.

## What's inside

- **Learn**: a plain-English lesson with worked examples for each of the 15 question types, plus test-day strategy.
- **Practice**: untimed, with an explanation after every question and your time compared to the 14-second pace.
- **Fast way**: miss a question, or take longer than 14 seconds, and you also get a one-line shortcut for doing that kind of question in your head.
- **Speed Drill**: "beat the clock" (14 seconds per question), a 3-minute sprint, or a 25-question mini test.
- **Full Test**: the SLE (50 questions, 12 minutes) or the shorter SLE-Q some schools use (30 questions, 8 minutes). Questions get harder as you go, then you get a score, a breakdown by topic, and a review of every question.
- **Review Mistakes**: every question you miss is saved. Answer it correctly and it leaves the list.
- **Progress**: your score history against your target score, plus accuracy and speed for each topic.

Keyboard: `A`–`E` or `1`–`5` to answer, `Enter` for next, `←`/`→` to move around during a test.

## Questions

- `js/bank/*.js`: hand-written questions (vocabulary, analogies, sayings, odd one out, grammar). Add more by adding objects to these lists.
- `js/generators.js`: templates that build a fresh question every time (math, number series, letters, logic, dates, detail checking, scrambled sentences), so these never run out.
- `js/spatial.js`: shape and pattern questions, drawn as inline SVG.
- `js/lessons.js`: lesson content.
- `js/tips.js`: the fallback "fast way" line for each written topic. Generated questions carry their own tip in `js/generators.js`.
