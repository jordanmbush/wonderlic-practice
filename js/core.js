// Shared helpers, category list, and the question registry.
(function () {
  const U = {
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    chance: (p) => Math.random() < p,
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    sample(arr, n) {
      return U.shuffle(arr).slice(0, n);
    },
    gcd: (a, b) => (b ? U.gcd(b, a % b) : Math.abs(a)),
    lcm: (a, b) => (a * b) / U.gcd(a, b),
    round: (v, p = 4) => Math.round(v * 10 ** p) / 10 ** p,
    num(v) {
      v = U.round(v, 4);
      return Number.isInteger(v) ? v.toLocaleString('en-US') : String(v);
    },
    money(v) {
      return '$' + U.round(v, 2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    hash(s) {
      let h = 5381;
      for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      return (h >>> 0).toString(36);
    },
    esc: (s) =>
      String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]),
  };

  const CATS = [
    { id: 'vocab', name: 'Vocabulary', group: 'Verbal', blurb: 'Same, opposite, and look-alike words', icon: '📖', w: { sle: 6, job: 5 } },
    { id: 'analogy', name: 'Analogies', group: 'Verbal', blurb: 'A is to B as C is to ?', icon: '🔗', w: { sle: 4, job: 4 } },
    { id: 'meaning', name: 'Sayings & Meaning', group: 'Verbal', blurb: 'Similar, contradictory, or neither', icon: '💬', w: { sle: 3, job: 3 } },
    { id: 'oddone', name: 'Odd One Out', group: 'Verbal', blurb: 'Which one doesn’t belong?', icon: '🧩', w: { sle: 2, job: 2 } },
    { id: 'scramble', name: 'Scrambled Sentences', group: 'Verbal', blurb: 'Unscramble it, then true or false', icon: '🔀', w: { sle: 1, job: 1 } },
    { id: 'grammar', name: 'Grammar & Word Choice', group: 'Verbal', blurb: 'Its or it’s, fewer or less', icon: '✍️', w: { sle: 2, job: 1 } },
    { id: 'logic', name: 'Logic', group: 'Reasoning', blurb: 'True, false, or not certain', icon: '🧠', w: { sle: 5, job: 5 } },
    { id: 'series', name: 'Number Series', group: 'Reasoning', blurb: 'What number comes next?', icon: '🔢', w: { sle: 4, job: 4 } },
    { id: 'letters', name: 'Letters & Alphabet', group: 'Reasoning', blurb: 'Letter patterns, codes, ABC order', icon: '🔤', w: { sle: 2, job: 2 } },
    { id: 'compare', name: 'Detail Checking', group: 'Reasoning', blurb: 'Spot exact matches fast', icon: '🔍', w: { sle: 2, job: 3 } },
    { id: 'spatial', name: 'Shapes & Patterns', group: 'Reasoning', blurb: 'Turned, flipped, what comes next', icon: '🔷', w: { sle: 2, job: 6 } },
    { id: 'arith', name: 'Arithmetic', group: 'Math', blurb: 'Fractions, decimals, percents', icon: '➗', w: { sle: 5, job: 5 } },
    { id: 'wordprob', name: 'Word Problems', group: 'Math', blurb: 'Money, rates, work, averages', icon: '💵', w: { sle: 7, job: 6 } },
    { id: 'geometry', name: 'Shapes & Measuring', group: 'Math', blurb: 'Area, perimeter, conversions', icon: '📐', w: { sle: 3, job: 2 } },
    { id: 'dates', name: 'Dates & Time', group: 'Math', blurb: 'Days of the week, clocks', icon: '📅', w: { sle: 2, job: 1 } },
  ];
  const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));

  // The two versions of the test. Same length and timing — they differ in
  // which topics come up.
  const MODES = [
    { id: 'sle', name: 'SLE', who: 'school admissions', note: 'More vocabulary, grammar and logic. Only a couple of shape questions.' },
    { id: 'job', name: 'Wonderlic', who: 'job applications', note: 'More shapes, patterns and detail checking. Less grammar.' },
  ];
  const catWeight = (id, mode) => (CAT[id] ? CAT[id].w[mode] || 0 : 0);

  // Question registry. Static banks call QB.add(); generators register via QB.def().
  const QB = {
    static: {},
    gens: {},
    add(cat, items) {
      const list = (this.static[cat] = this.static[cat] || []);
      for (const it of items) list.push(Object.assign({}, it, { cat, id: cat + ':' + U.hash(it.q) }));
    },
    def(cat, d, f) {
      (this.gens[cat] = this.gens[cat] || []).push({ d, f });
    },
    has(cat) {
      return !!((this.static[cat] && this.static[cat].length) || (this.gens[cat] && this.gens[cat].length));
    },
    count(cat) {
      return (this.static[cat] || []).length;
    },
  };

  window.U = U;
  window.CATS = CATS;
  window.CAT = CAT;
  window.MODES = MODES;
  window.catWeight = catWeight;
  window.QB = QB;
})();
