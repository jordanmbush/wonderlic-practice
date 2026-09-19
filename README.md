# Wonderlic Practice

A study app for the Wonderlic test (50 questions, 12 minutes). No install, no build step.

## Run it

Double-click `index.html` to open it in your browser. Progress is saved in that browser.

To use it on a phone on the same Wi-Fi, run `python3 -m http.server 8000` in this folder and open `http://<your-computer-ip>:8000`.

## What's inside

- **Learn**: a plain-English lesson with worked examples for each of the 13 question types, plus test-day strategy.
- **Practice**: untimed, with an explanation after every question and your time compared to the 14-second pace.
- **Speed Drill**: "beat the clock" (14 seconds per question), a 3-minute sprint, or a 25-question mini test.
- **Full Test**: 50 questions in 12 minutes that get harder as you go, then a score, a breakdown by topic, and a review of every question.
- **Review Mistakes**: every question you miss is saved. Answer it correctly and it leaves the list.
- **Progress**: your score history against your target score, plus accuracy and speed for each topic.

Keyboard: `A`–`E` or `1`–`5` to answer, `Enter` for next, `←`/`→` to move around during a test.

## Questions

- `js/bank/*.js`: hand-written questions (vocabulary, analogies, sayings, odd one out). Add more by adding objects to these lists.
- `js/generators.js`: templates that build a fresh question every time (math, number series, letters, logic, dates, detail checking, scrambled sentences), so these never run out.
- `js/lessons.js`: lesson content.
