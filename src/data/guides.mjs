import { CATS, LESSONS } from "./content.mjs";

/**
 * The guide pages: one per question type, plus the strategy guide.
 *
 * This is the site's whole search surface, so it holds what search needs and
 * nothing else. The URL is NOT decided here — `slug` comes from `CATS` in
 * public/js/core.js, because the practice app needs to link out to these pages
 * too and a URL decided in two places is a dead link waiting to happen.
 *
 * What is decided here:
 *
 * `title` is what shows in a search result. Under ~60 characters or Google
 * truncates it mid-word. Each leads with the words someone actually types —
 * "Wonderlic Number Series" — because the first words carry the most weight
 * and are what a skimmer reads.
 *
 * `description` is the grey line underneath, ~150-160 characters. It doesn't
 * affect ranking directly; it decides whether anyone clicks. So each is a
 * promise about what the page gives, not a summary of what's on it.
 *
 * ORDER is the order guides appear in and the order "Read next" walks, so the
 * most-searched topics sit nearest the top. It is not the app's category
 * order, which is grouped for studying rather than for arriving cold.
 */
const META = {
  strategy: {
    title: "Wonderlic Test Strategy: Pacing, Guessing & Scoring",
    description:
      "How to pace 50 questions in 12 minutes, when to guess, and why nobody finishes. The habits that raise a Wonderlic score the fastest.",
  },
  vocab: {
    title: "Wonderlic Vocabulary Questions: Practice & Tips",
    description:
      "Same, opposite or neither — how Wonderlic vocabulary questions work, the prefixes that give answers away, and worked examples to practice on.",
  },
  wordprob: {
    title: "Wonderlic Word Problems: How to Solve Them Fast",
    description:
      "The most common question type on the test. Shortcuts for percentages, rates and totals you can do in your head in under 15 seconds.",
  },
  series: {
    title: "Wonderlic Number Series: Find the Pattern Fast",
    description:
      "Write the gaps between the numbers and the pattern usually appears at once. Worked examples of every series type the test uses.",
  },
  logic: {
    title: "Wonderlic Logic Questions: True, False or Uncertain",
    description:
      "How to tell a conclusion that must be true from one that merely could be. The single trick that makes these questions quick.",
  },
  arith: {
    title: "Wonderlic Math Questions: Mental Arithmetic Shortcuts",
    description:
      "Build percentages from 10%, halve and double instead of multiplying, and estimate before you calculate. Fast mental math for the Wonderlic.",
  },
  analogy: {
    title: "Wonderlic Analogies: How to Spot the Relationship",
    description:
      "Say the link in a short sentence, then test each choice against it. A simple method for Wonderlic analogy questions, with examples.",
  },
  grammar: {
    title: "Wonderlic Grammar Questions: Its or It's, Fewer or Less",
    description:
      "The confused words and agreement rules the test keeps coming back to, explained plainly, with practice sentences to try.",
  },
  spatial: {
    title: "Wonderlic Shapes & Patterns: Turned, Flipped, What's Next",
    description:
      "How to tell a turned figure from a flipped one, and how to read a pattern series quickly. Visual examples you can work through.",
  },
  geometry: {
    title: "Wonderlic Geometry: Area, Perimeter & Unit Conversions",
    description:
      "The handful of shapes and conversions the test actually uses, and the ones worth memorising before test day.",
  },
  meaning: {
    title: "Wonderlic Proverb Questions: What the Saying Means",
    description:
      "Boil each saying down to a few plain words, then match the meaning rather than the wording. Worked examples of the common ones.",
  },
  oddone: {
    title: "Wonderlic Odd One Out: Find the Group of Four",
    description:
      "Look for the category that covers four of the five. How to sort by what things are rather than how the words look.",
  },
  compare: {
    title: "Wonderlic Detail Comparison: Spotting the Difference",
    description:
      "Read in chunks, check the middle, and know the look-alike pairs. How to compare names and numbers quickly without losing accuracy.",
  },
  letters: {
    title: "Wonderlic Letter Series: Alphabet Puzzles Made Simple",
    description:
      "The EJOTY landmarks that save counting through the alphabet, and how to read letter patterns as numbers instead.",
  },
  dates: {
    title: "Wonderlic Date & Time Questions: Days, Clocks, Calendars",
    description:
      "Counting days of the week, reading elapsed time, and the remainder trick that answers most calendar questions in seconds.",
  },
  scramble: {
    title: "Wonderlic Scrambled Sentences: Unscramble Them Quickly",
    description:
      "Find the verb, find the subject, and the rest of the sentence falls into place. How to judge if the sentence is true or false.",
  },
};

/** Most-searched first. Drives the guide index and the "Read next" trail. */
const ORDER = [
  "strategy",
  "vocab",
  "wordprob",
  "series",
  "logic",
  "arith",
  "analogy",
  "grammar",
  "spatial",
  "geometry",
  "meaning",
  "oddone",
  "compare",
  "letters",
  "dates",
  "scramble",
];

// The strategy guide isn't a question type, so it has no CATS entry. Its slug
// is named in core.js beside the others for the same reason theirs are.
const STRATEGY_SLUG = "test-strategy";

export const GUIDES = ORDER.map((id) => {
  const meta = META[id];
  const slug =
    id === "strategy" ? STRATEGY_SLUG : CATS.find((c) => c.id === id)?.slug;
  if (!meta || !slug || !LESSONS[id]) {
    // Fails the build rather than shipping a broken or empty page. These three
    // lists are edited at different times by different hands; this is the seam
    // where they drift apart.
    throw new Error(
      `guides.mjs: "${id}" is missing something — meta:${!!meta} slug:${slug ?? "none"} lesson:${!!LESSONS[id]}. ` +
        `A question type needs an entry in META here, a slug on its CATS entry in public/js/core.js, and a lesson in src/data/lessons.js.`,
    );
  }
  return { id, slug, ...meta };
});

// Every question type must have a guide. Without this, adding a category to
// the app silently leaves a topic with no page for anyone to find.
const orphans = CATS.filter((c) => !GUIDES.some((g) => g.id === c.id));
if (orphans.length) {
  throw new Error(
    `guides.mjs: these question types have no guide page: ${orphans.map((c) => c.id).join(", ")}. ` +
      `Add each to META and to ORDER.`,
  );
}

/** Look a guide up by the id the app uses. */
export const guideFor = (id) => GUIDES.find((g) => g.id === id);
