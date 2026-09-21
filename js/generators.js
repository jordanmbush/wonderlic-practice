// Question generators: each call builds a fresh question, so math/number/letter
// practice never runs out. QB.def(category, difficulty 1-3, fn) — fn returns { q, c, a, e }.
(function () {
  const { rand, pick, chance, shuffle, sample, gcd, lcm, num, money } = U;
  const def = QB.def.bind(QB);

  // ---------- shared helpers ----------
  function niceStep(v) {
    const a = Math.abs(v) * 0.1;
    if (a <= 1) return Number.isInteger(v) ? 1 : a <= 0.1 ? 0.05 : a <= 0.5 ? 0.25 : 0.5;
    const p = 10 ** Math.floor(Math.log10(a));
    const m = a / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }

  // Multiple choice from the correct value + likely-mistake values.
  // fmt = display text; values that display identically are merged.
  function mc(correct, wrongs, opts = {}) {
    const fmt = opts.fmt || num;
    const key = opts.key || fmt;
    const n = opts.n || 5;
    const valid =
      opts.valid || ((w) => typeof w !== 'number' || (isFinite(w) && (w >= 0 || correct < 0)));
    const list = [correct];
    const seen = new Set([key(correct)]);
    const add = (w) => {
      if (list.length >= n || w === undefined || w === null || !valid(w)) return;
      const k = key(w);
      if (seen.has(k)) return;
      seen.add(k);
      list.push(w);
    };
    wrongs.forEach(add);
    if (typeof correct === 'number') {
      const step = opts.step || niceStep(correct);
      for (let k = 1; list.length < n && k < 40; k++) {
        const a = U.round(correct + step * k, 4);
        const b = U.round(correct - step * k, 4);
        chance(0.5) ? (add(a), add(b)) : (add(b), add(a));
      }
    }
    const out = shuffle(list);
    return { c: out.map(fmt), a: out.findIndex((v) => key(v) === key(correct)) };
  }

  // Fractions as [numerator, denominator]
  const simp = ([n, d]) => {
    const g = gcd(n, d) || 1;
    return [n / g, d / g];
  };
  const fstr = (f) => {
    let [n, d] = simp(f);
    if (d === 1) return String(n);
    if (n > d) return `${Math.floor(n / d)} ${n % d}/${d}`;
    return `${n}/${d}`;
  };
  const fval = ([n, d]) => U.round(n / d, 6);
  const mcFrac = (correct, wrongs) => {
    const [n, d] = simp(correct);
    const extra = [[n + 1, d], [n, d + 1], [n * 2, d], [n + 2, d], [n, d * 2], [n + d, d], [n + 1, d + 1]];
    return mc(correct, wrongs.concat(extra), {
      fmt: fstr,
      key: (f) => String(fval(f)),
      valid: (f) => f && f[1] > 0 && f[0] > 0,
      n: 5,
    });
  };

  const NAMES = ['Maria', 'James', 'Aisha', 'Tom', 'Keiko', 'Luis', 'Emma', 'Raj', 'Sofia', 'Dan', 'Grace', 'Omar', 'Nina', 'Ben', 'Chloe', 'Marcus', 'Priya', 'Sam', 'Lena', 'Carlos'];
  const names = (k) => sample(NAMES, k);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  const nth = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  const big = (s) => `<div class="big">${s}</div>`;

  // ============ NUMBER SERIES ============
  function seriesQ(shown, ans, wrongs, e, t, fmt = num) {
    return { q: `What number comes next in the series?${big(shown.map(fmt).join(', ') + ', ?')}`, ...mc(ans, wrongs, { fmt }), e, t };
  }

  def('series', 1, () => {
    const d = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]);
    const down = chance(0.3);
    const start = down ? rand(d * 6, d * 6 + 60) : rand(1, 40);
    const step = down ? -d : d;
    const t = Array.from({ length: 6 }, (_, i) => start + step * i);
    const ans = t[5];
    return seriesQ(t.slice(0, 5), ans, [ans + 1, ans - 1, ans + step, ans + 2, ans - 2],
      `Each number ${down ? 'goes down' : 'goes up'} by ${d}. ${t[4]} ${down ? '−' : '+'} ${d} = ${ans}.`,
      `Write the gap between the first two numbers, then check it on the next pair. Same gap every time → add it once more.`);
  });

  def('series', 2, () => {
    const start = rand(1, 20), d0 = rand(1, 5), inc = pick([1, 2, 3]);
    const t = [start], diffs = [];
    for (let i = 0; i < 5; i++) {
      diffs.push(d0 + inc * i);
      t.push(t[i] + diffs[i]);
    }
    const ans = t[5];
    return seriesQ(t.slice(0, 5), ans, [t[4] + diffs[3], ans + 1, ans - 1, ans + inc, ans + 2],
      `The gaps between numbers grow by ${inc} each time: +${diffs.slice(0, 4).join(', +')}, so the next gap is +${diffs[4]}. ${t[4]} + ${diffs[4]} = ${ans}.`,
      `Put the gaps under the numbers. When the gaps climb by a steady amount, carry that on.`);
  });

  def('series', 2, () => {
    const r = pick([2, 2, 3]);
    const start = r === 2 ? rand(1, 6) : rand(1, 3);
    const up = chance(0.7);
    let t = Array.from({ length: 6 }, (_, i) => start * r ** i);
    if (!up) t = t.reverse();
    const ans = t[5];
    const wrongs = up
      ? [t[4] + (t[4] - t[3]), ans + r, ans - r, t[4] * (r + 1), ans + 1]
      : [ans + 1, ans - 1, ans * r * r, t[4] - (t[3] - t[4]), ans + 2];
    return seriesQ(t.slice(0, 5), ans, wrongs,
      up ? `Each number is multiplied by ${r}. ${t[4]} × ${r} = ${ans}.` : `Each number is divided by ${r}. ${t[4]} ÷ ${r} = ${ans}.`,
      `Numbers growing or shrinking fast? Test ×2 or ×3 (or ÷) on one pair, then check it on another.`);
  });

  def('series', 2, () => {
    const n = rand(1, 8), off = pick([0, 0, 1, -1, 2]);
    const t = Array.from({ length: 6 }, (_, i) => (n + i) ** 2 + off);
    const ans = t[5];
    const extra = off === 0 ? '' : ` ${off > 0 ? 'plus' : 'minus'} ${Math.abs(off)}`;
    return seriesQ(t.slice(0, 5), ans, [t[4] + (t[4] - t[3]), ans + 1, ans - 1, ans + 2, (n + 6) ** 2 + off],
      `These are square numbers${extra}: ${n}², ${n + 1}², ${n + 2}²… The next is ${n + 5}² = ${(n + 5) ** 2}${off ? `, ${off > 0 ? '+' : '−'} ${Math.abs(off)} = ${ans}` : ''}.`,
      `Gaps of 3, 5, 7, 9 mean square numbers. Knowing 1×1 up to 15×15 makes these instant.`);
  });

  def('series', 2, () => {
    const start = pick([6.4, 3.2, 12.8, 1.6, 4.8, 2.4, 8, 20, 36]);
    const t = Array.from({ length: 6 }, (_, i) => U.round(start / 2 ** i, 5));
    const ans = t[5];
    return seriesQ(t.slice(0, 5), ans, [U.round(ans / 10, 5), U.round(ans * 10, 5), U.round(t[4] - ans * 1.5, 5), U.round(ans * 1.5, 5), U.round(ans / 2, 5)],
      `Each number is half of the one before it. ${num(t[4])} ÷ 2 = ${num(ans)}.`,
      `Each number is about half the one before → just halve the last one.`);
  });

  def('series', 3, () => {
    const n = rand(1, 3);
    const t = Array.from({ length: 5 }, (_, i) => (n + i) ** 3);
    const ans = t[4];
    return seriesQ(t.slice(0, 4), ans, [t[3] + (t[3] - t[2]), ans + 1, ans - 1, (n + 4) ** 2, ans + 10],
      `These are cubes (a number times itself three times): ${n}³, ${n + 1}³, ${n + 2}³, ${n + 3}³. Next is ${n + 4}³ = ${n + 4}×${n + 4}×${n + 4} = ${ans}.`,
      `Jumps this big mean cubes. Keep 1, 8, 27, 64, 125, 216 in mind.`);
  });

  def('series', 3, () => {
    const a = rand(1, 20), da = pick([1, 2, 3, 4, 5]);
    const b = rand(20, 50), db = pick([-1, -2, -3, 2, 3, 4, 5]);
    const len = pick([7, 8]);
    const t = Array.from({ length: len }, (_, i) => (i % 2 === 0 ? a + da * (i / 2) : b + db * ((i - 1) / 2)));
    const ans = t[len - 1];
    const ownStep = (len - 1) % 2 === 0 ? da : db;
    const otherStep = ownStep === da ? db : da;
    const sgn = (s) => (s > 0 ? `+${s}` : `−${-s}`);
    return seriesQ(t.slice(0, len - 1), ans, [t[len - 2] + otherStep, ans + 1, ans - 1, ans + ownStep, t[len - 2] + (t[len - 2] - t[len - 3])],
      `Two series are mixed together. Every other number (1st, 3rd, 5th…) goes ${sgn(da)}: ${t.filter((_, i) => i % 2 === 0).join(', ')}. The others (2nd, 4th…) go ${sgn(db)}: ${t.filter((_, i) => i % 2 === 1).join(', ')}. So the next number is ${ans}.`,
      `A list that zigzags is really two lists. Read only the 1st, 3rd, 5th numbers, then only the 2nd, 4th.`);
  });

  def('series', 3, () => {
    const a = rand(1, 5), b = rand(a, 8);
    const t = [a, b];
    while (t.length < 7) t.push(t[t.length - 1] + t[t.length - 2]);
    const ans = t[6];
    return seriesQ(t.slice(0, 6), ans, [t[5] + (t[5] - t[4]), ans + 1, ans - 1, t[5] * 2, ans + t[3]],
      `Each number is the sum of the two before it. ${t[4]} + ${t[5]} = ${ans}.`,
      `If a number looks like the two before it added together, check that on one more pair, then add the last two.`);
  });

  def('series', 3, () => {
    const m = pick([2, 3]), k = rand(1, 6), start = rand(1, 5);
    const mulFirst = chance(0.5);
    const ops = mulFirst ? [(x) => x * m, (x) => x + k] : [(x) => x + k, (x) => x * m];
    const names = mulFirst ? [`×${m}`, `+${k}`] : [`+${k}`, `×${m}`];
    const t = [start];
    for (let i = 0; i < 6; i++) t.push(ops[i % 2](t[i]));
    const ans = t[6];
    const wrongOp = ops[0](t[5]);
    return seriesQ(t.slice(0, 6), ans, [wrongOp, ans + 1, ans - 1, ans + k, t[5] + (t[5] - t[4])],
      `The steps alternate: ${names[0]}, ${names[1]}, ${names[0]}, ${names[1]}… The next step is ${names[1]}: ${t[5]} ${names[1][0] === '×' ? '×' : '+'} ${names[1].slice(1)} = ${ans}.`,
      `Gaps that jump around usually mean two steps taking turns. Find both steps, then work out whose turn is next.`);
  });

  def('series', 3, () => {
    const start = rand(1, 10), d0 = rand(1, 3), r = 2;
    const t = [start], diffs = [];
    for (let i = 0; i < 6; i++) {
      diffs.push(d0 * r ** i);
      t.push(t[i] + diffs[i]);
    }
    const ans = t[6];
    return seriesQ(t.slice(0, 6), ans, [t[5] + diffs[4], ans + 1, ans - 1, t[5] * 2, ans + d0],
      `The gaps double each time: +${diffs.slice(0, 5).join(', +')}. Next gap is +${diffs[5]}: ${t[5]} + ${diffs[5]} = ${ans}.`,
      `Look at the gaps: each one doubles. Double the last gap and add it on.`);
  });

  // ============ LETTERS & ALPHABET ============
  const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = (i) => AB[((i % 26) + 26) % 26];
  const P = (ch) => AB.indexOf(ch);
  const inAB = (i) => i >= 0 && i <= 25;
  const mcLetter = (ans, wrongs) => mc(ans, wrongs, { fmt: L, key: String, valid: inAB, step: 1 });

  function letterSeries(k, back) {
    const n = 5, span = k * n;
    const start = back ? rand(span, 25) : rand(0, 25 - span);
    const step = back ? -k : k;
    const t = Array.from({ length: n + 1 }, (_, i) => start + step * i);
    const ans = t[n];
    return {
      q: `What letter comes next in the series?${big(t.slice(0, n).map(L).join('  ') + '  ?')}`,
      ...mcLetter(ans, [ans + 1, ans - 1, ans + step, ans - step, ans + 2]),
      e: `Each letter is ${k} place${k > 1 ? 's' : ''} ${back ? 'before' : 'after'} the one before it${k > 1 ? ` (skip ${k - 1})` : ''}. ${L(t[n - 1])} → ${L(ans)}.`,
      t: `Count the letters skipped between the first two, then make the same hop from the last letter.`,
    };
  }
  def('letters', 1, () => letterSeries(rand(1, 2), false));
  def('letters', 2, () => letterSeries(rand(3, 5), chance(0.3)));

  def('letters', 3, () => {
    const start = rand(0, 10);
    const t = [start];
    for (let i = 1; i <= 5; i++) t.push(t[i - 1] + i);
    const ans = t[5];
    return {
      q: `What letter comes next in the series?${big(t.slice(0, 5).map(L).join('  ') + '  ?')}`,
      ...mcLetter(ans, [ans + 1, ans - 1, t[4] + 4, ans + 2, ans - 2]),
      e: `The jumps grow by one each time: +1, +2, +3, +4, so the next jump is +5. ${L(t[4])} + 5 = ${L(ans)}.`,
      t: `Count the skips between letters: 1, 2, 3, 4 — one more each time.`,
    };
  });

  def('letters', 3, () => {
    const m = rand(1, 4);
    const i1 = rand(0, 25 - 2 * m), i2 = i1 + 2 * m, mid = i1 + m;
    const n = rand(2, 5);
    let dir = chance(0.5) ? 1 : -1;
    if (!inAB(mid + dir * n)) dir = -dir;
    const ans = mid + dir * n;
    const walk = Array.from({ length: n }, (_, i) => L(mid + dir * (i + 1))).join(', ');
    return {
      q: `What is the ${ORD[n - 1]} letter to the ${dir > 0 ? 'right' : 'left'} of the letter that is midway between <b>${L(i1)}</b> and <b>${L(i2)}</b> in the alphabet?`,
      ...mcLetter(ans, [mid + dir * (n - 1), mid + dir * (n + 1), mid - dir * n, mid, ans + dir * 2]),
      e: `Midway between ${L(i1)} and ${L(i2)} is ${L(mid)}. Count ${n} to the ${dir > 0 ? 'right' : 'left'}: ${walk}. The answer is ${L(ans)}.`,
      t: `Midway means walking in from both ends at the same time until you meet.`,
    };
  });

  def('letters', 1, () => {
    const n = rand(4, 24);
    if (chance(0.5)) {
      return {
        q: `Which letter is the <b>${nth(n)}</b> letter of the alphabet?`,
        ...mcLetter(n - 1, [n, n - 2, n + 1, n - 3]),
        e: `Count using landmarks: E=5, J=10, O=15, T=20, Y=25 (“EJOTY”). The ${nth(n)} letter is ${L(n - 1)}.`,
        t: `EJOTY: E=5, J=10, O=15, T=20, Y=25. Jump to the closest landmark and step from there.`,
      };
    }
    const i = n - 1;
    return {
      q: `What position is the letter <b>${L(i)}</b> in the alphabet? (A = 1)`,
      ...mc(n, [n + 1, n - 1, n + 2, n - 2]),
      e: `Use the “EJOTY” landmarks: E=5, J=10, O=15, T=20, Y=25. ${L(i)} is number ${n}.`,
      t: `EJOTY: E=5, J=10, O=15, T=20, Y=25. Jump to the closest landmark and step from there.`,
    };
  });

  def('letters', 2, () => {
    const n = rand(3, 12);
    const ans = 26 - n;
    return {
      q: `If the alphabet were written backward (starting with Z), which letter would be <b>${nth(n)}</b>?`,
      ...mcLetter(ans, [ans + 1, ans - 1, n - 1, ans - 2]),
      e: `Backward: ${Array.from({ length: n }, (_, i) => L(25 - i)).join(', ')}. The ${nth(n)} is ${L(ans)}.`,
      t: `27 minus the position. So the ${nth(n)} from the end is the ${nth(27 - n)} letter forward.`,
    };
  });

  const CODE_WORDS = ['CAT', 'DOG', 'BIRD', 'FISH', 'TREE', 'LAMP', 'DESK', 'ROAD', 'MILK', 'BOOK', 'HAND', 'SHOE', 'CAKE', 'RING', 'SOAP', 'WIND', 'FARM', 'GOLD', 'NEST', 'PINE', 'COIN', 'BELL', 'DRUM', 'KITE', 'LEAF', 'MOON', 'ROSE', 'SALT', 'TOOTH', 'SMILE', 'BRUSH', 'CLEAN', 'PLATE', 'CHAIR', 'HOUSE', 'WATER', 'LIGHT', 'PAPER', 'TRAIN', 'GUM', 'JAW'];
  def('letters', 2, () => {
    const s = pick([1, 2, 3, -1, -2, 1]);
    const [w1, w2] = sample(CODE_WORDS, 2);
    const enc = (w, k) => [...w].map((ch) => L(P(ch) + k)).join('');
    const ans = enc(w2, s);
    const partial = w2[0] + enc(w2.slice(1), s);
    const wrongs = [enc(w2, s + 1), enc(w2, s - 1 || s + 2), enc(w2, -s), partial, [...ans].reverse().join('')];
    const wraps = [...w1 + w2].some((ch) => !inAB(P(ch) + s));
    return {
      q: `In a certain code, <b>${w1}</b> is written as <b>${enc(w1, s)}</b>. How would <b>${w2}</b> be written in the same code?`,
      ...mc(ans, wrongs, { fmt: String }),
      e: `Compare the first letters: ${w1[0]} → ${enc(w1, s)[0]}. Every letter moves ${Math.abs(s)} place${Math.abs(s) > 1 ? 's' : ''} ${s > 0 ? 'forward' : 'back'} in the alphabet${wraps ? ' (wrapping around from Z to A)' : ''}. So ${w2} → ${ans}.`,
      t: `Work out the shift from one letter only, then check just the first letter of each choice — usually only one fits.`,
    };
  });

  const WORD_GROUPS = [
    ['carpet', 'carton', 'cartoon', 'carrot', 'carbon', 'career', 'cargo', 'carol'],
    ['station', 'static', 'statue', 'stature', 'status', 'stall', 'stamp', 'stand'],
    ['present', 'preserve', 'president', 'press', 'pressure', 'prevent', 'preview', 'previous'],
    ['company', 'compare', 'compass', 'compete', 'complex', 'comply', 'compose', 'compute'],
    ['money', 'monkey', 'monster', 'month', 'monument', 'mood', 'moon', 'monday'],
    ['plant', 'plane', 'planet', 'plate', 'platform', 'play', 'plaza', 'please'],
    ['brace', 'bracket', 'brain', 'brake', 'branch', 'brand', 'brass', 'brave'],
    ['trade', 'traffic', 'tragic', 'trail', 'train', 'trait', 'tramp', 'trance'],
    ['dental', 'dentist', 'denture', 'dense', 'density', 'deny', 'depart', 'depend'],
    ['mint', 'minute', 'minor', 'mind', 'mine', 'minimal', 'mirror', 'miracle'],
    ['floss', 'flour', 'flower', 'flow', 'fluid', 'flute', 'flutter', 'flush'],
    ['guard', 'guess', 'guest', 'guide', 'guilt', 'guitar', 'gulf', 'gummy'],
  ];
  const GENERAL_WORDS = ['apple', 'basket', 'candle', 'dolphin', 'engine', 'forest', 'garden', 'harbor', 'island', 'jacket', 'kettle', 'ladder', 'marble', 'needle', 'orange', 'pencil', 'quarter', 'rabbit', 'saddle', 'tunnel', 'umbrella', 'violin', 'window', 'yellow', 'zipper'];
  function alphaQ(words) {
    const ord = rand(0, 4);
    const sorted = words.slice().sort();
    const ans = sorted[ord];
    return {
      q: `If these words were put in alphabetical order, which word would be <b>${ord === 4 ? 'last' : ORD[ord]}</b>?${big(words.join('   '))}`,
      c: words.slice(),
      a: words.indexOf(ans),
      e: `In order: ${sorted.join(', ')}. The ${ord === 4 ? 'last' : ORD[ord]} one is <b>${ans}</b>.`,
      t: `Compare first letters only. Look at the second letter just to break a tie.`,
    };
  }
  def('letters', 1, () => alphaQ(sample(GENERAL_WORDS, 5)));
  def('letters', 2, () => alphaQ(sample(pick(WORD_GROUPS), 5)));

  const UNIQUE_WORDS = ['PLANET', 'GARDEN', 'MOUTH', 'FRIEND', 'CANDLE', 'BRIGHT', 'STAMP', 'WINTER', 'DENTAL', 'SMILE', 'CLOUD', 'PRINCE', 'HOTEL', 'MARBLE', 'FOREST', 'CRUMB', 'BLANKET', 'HUNGRY', 'FAMOUS', 'PENCIL', 'MOTHER', 'JUNGLE', 'FLIGHT', 'SUGAR', 'TOWEL', 'GUMLINE', 'MOLAR', 'ENAMEL'].filter((w) => new Set(w).size === w.length);
  def('letters', 2, () => {
    const w = pick(UNIQUE_WORDS);
    const sorted = [...w].sort();
    const k = rand(1, w.length);
    const ans = sorted[k - 1];
    const others = shuffle([...w].filter((ch) => ch !== ans)).slice(0, 4);
    const out = shuffle([ans, ...others]);
    return {
      q: `If the letters in the word <b>${w}</b> were arranged in alphabetical order, which letter would be <b>${ORD[k - 1]}</b>?`,
      c: out,
      a: out.indexOf(ans),
      e: `Alphabetical order: ${sorted.join(' ')}. The ${ORD[k - 1]} letter is ${ans}.`,
      t: `Run through A, B, C… and tick off the letters that are in the word until you reach the spot you need.`,
    };
  });

  // ============ ARITHMETIC ============
  const FRACS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8], [1, 9], [2, 9], [4, 9], [1, 10], [3, 10], [7, 10], [9, 10], [5, 12], [7, 12], [2, 7], [3, 7]];
  const terminates = (d) => [2, 4, 5, 8, 10, 20, 25].includes(d);
  function compareQ(allFrac) {
    const items = [];
    let guard = 0;
    while (items.length < 5 && guard++ < 500) {
      let it;
      if (allFrac || chance(0.5)) {
        const [n, d] = pick(FRACS);
        const v = n / d;
        const style = terminates(d) && !allFrac ? pick(['f', 'f', 'd', 'p']) : 'f';
        it = { v, rep: style === 'f' ? `${n}/${d}` : style === 'd' ? String(U.round(v, 3)) : `${U.round(v * 100, 1)}%` };
      } else {
        const v = rand(5, 95) / 100;
        it = { v, rep: chance(0.5) ? String(v) : `${Math.round(v * 100)}%` };
      }
      if (items.every((o) => Math.abs(o.v - it.v) >= 0.015)) items.push(it);
    }
    const small = chance(0.5);
    const target = items.reduce((b, o) => (small ? (o.v < b.v ? o : b) : o.v > b.v ? o : b));
    const dec = (v) => (Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9 ? String(U.round(v, 3)) : '≈ ' + v.toFixed(3));
    return {
      q: `Which of these numbers is the <b>${small ? 'smallest' : 'largest'}</b>?`,
      c: items.map((o) => o.rep),
      a: items.indexOf(target),
      e: `Turn them all into decimals: ${items.map((o) => `${o.rep} = ${dec(o.v)}`).join('; ')}. The ${small ? 'smallest' : 'largest'} is <b>${target.rep}</b>.`,
      t: `Sort by landmarks: under a half, about a half, or over? For a fraction, double the top — if it beats the bottom, it is over a half.`,
    };
  }
  def('arith', 2, () => compareQ(false));
  def('arith', 3, () => compareQ(true));

  // The quickest way to take each percent in your head.
  function pctTip(p, base) {
    const whole = num(base), ten = num(base / 10), five = num(base / 20);
    const from10 = `10% of ${whole} is ${ten}`;
    if (p === 50) return `50% is just half of ${whole}.`;
    if (p === 25) return `25% is a quarter: halve ${whole}, then halve again.`;
    if (p === 75) return `75% is the whole minus a quarter: take a quarter of ${whole} off ${whole}.`;
    if (p === 10) return `10% means moving the decimal one place left: ${whole} → ${ten}.`;
    if (p === 5) return `5% is half of 10%: ${from10}, so halve it to ${five}.`;
    if (p === 15) return `15% is 10% plus half of that: ${from10}, plus ${five}.`;
    return `Build from 10%: ${from10}, then ${p === 20 ? 'double it' : `times ${p / 10}`}.`;
  }

  def('arith', 1, () => {
    const p = pick([10, 20, 25, 50, 75, 5, 15, 30, 40, 60]);
    const unit = 100 / gcd(p, 100);
    const base = unit * rand(2, Math.max(3, Math.floor(400 / unit)));
    const ans = (base * p) / 100;
    return {
      q: `What is ${p}% of ${num(base)}?`,
      ...mc(ans, [ans * 10, ans / 10, base - ans, ans + p, ans * 2]),
      e: `${p}% of ${num(base)} = ${num(base)} × ${p / 100} = ${num(ans)}.`,
      t: pctTip(p, base),
    };
  });

  def('arith', 2, () => {
    let base, p, part, guard = 0;
    do {
      base = pick([8, 16, 20, 24, 40, 48, 60, 64, 80, 120, 160, 200, 250]);
      p = pick([5, 10, 12.5, 20, 25, 40, 50, 60, 75, 80, 125, 150]);
      part = (base * p) / 100;
    } while (!Number.isInteger(part) && guard++ < 100);
    const pc = (v) => `${num(v)}%`;
    return {
      q: `${num(part)} is what percent of ${num(base)}?`,
      ...mc(p, [p / 2, p * 2, 100 - p, p + 5, p - 5, U.round((base / part) * 10, 1)], { fmt: pc }),
      e: `Divide the part by the whole: ${num(part)} ÷ ${num(base)} = ${num(part / base)}. Multiply by 100 → ${num(p)}%.`,
      t: `Check the landmarks first: is the part a half (50%), a quarter (25%), or a tenth (10%) of the whole? Most answers are one of those.`,
    };
  });

  def('arith', 2, () => {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    let d1 = pick(dens), d2 = pick(dens);
    const coprime = (d) => pick(Array.from({ length: d - 1 }, (_, i) => i + 1).filter((x) => gcd(x, d) === 1));
    let n1 = coprime(d1), n2 = coprime(d2);
    const plus = chance(0.6);
    if (!plus && n1 / d1 <= n2 / d2) {
      [n1, n2, d1, d2] = [n2, n1, d2, d1];
    }
    if (!plus && n1 / d1 <= n2 / d2) return QB.gens.arith[0].f();
    const L2 = lcm(d1, d2);
    const raw = plus ? n1 * (L2 / d1) + n2 * (L2 / d2) : n1 * (L2 / d1) - n2 * (L2 / d2);
    const res = [raw, L2];
    const op = plus ? '+' : '−';
    const wrongs = [
      [Math.abs(plus ? n1 + n2 : n1 - n2), d1 + d2],
      [raw + 1, L2],
      [raw - 1, L2],
      [n1 * n2, d1 * d2],
      [raw, L2 * 2],
    ];
    return {
      q: `${n1}/${d1} ${op} ${n2}/${d2} = ?`,
      ...mcFrac(res, wrongs),
      e: `Use a common denominator of ${L2}: ${n1 * (L2 / d1)}/${L2} ${op} ${n2 * (L2 / d2)}/${L2} = ${raw}/${L2}${fstr(res) !== `${raw}/${L2}` ? ` = ${fstr(res)}` : ''}. (Never add the bottoms together.)`,
      t: `Cross-multiply instead of hunting for a common bottom: tops go across, the new bottom is the two bottoms multiplied, then simplify.`,
    };
  });

  def('arith', 2, () => {
    const [n1, d1] = pick(FRACS.filter((f) => f[1] <= 10));
    const [n2, d2] = pick(FRACS.filter((f) => f[1] <= 10));
    const div = chance(0.6);
    const res = div ? [n1 * d2, d1 * n2] : [n1 * n2, d1 * d2];
    const other = div ? [n1 * n2, d1 * d2] : [n1 * d2, d1 * n2];
    const wrongs = [other, [res[1], res[0]], [n1 + n2, d1 + d2], [res[0] * 2, res[1]], [res[0], res[1] * 2]];
    return {
      q: `${n1}/${d1} ${div ? '÷' : '×'} ${n2}/${d2} = ?`,
      ...mcFrac(res, wrongs),
      e: div
        ? `To divide, flip the second fraction and multiply: ${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2}${fstr(res) !== `${n1 * d2}/${d1 * n2}` ? ` = ${fstr(res)}` : ''}.`
        : `Multiply straight across: (${n1}×${n2})/(${d1}×${d2}) = ${n1 * n2}/${d1 * d2}${fstr(res) !== `${n1 * n2}/${d1 * d2}` ? ` = ${fstr(res)}` : ''}.`,
      t: `Multiply straight across; to divide, flip the second fraction. Cancel matching numbers first to keep them small.`,
    };
  });

  def('arith', 2, () => {
    const ap = pick([1, 1, 2]), bp = pick([1, 1, 2]);
    const ai = ap === 1 ? rand(2, 9) + (chance(0.4) ? rand(1, 9) * 10 : 0) : rand(2, 9);
    const bi = rand(2, 9);
    const a = ai / 10 ** ap, b = bi / 10 ** bp;
    const places = ap + bp;
    const ans = U.round((ai * bi) / 10 ** places, 6);
    const f = (v) => String(U.round(v, 6));
    return {
      q: `${f(a)} × ${f(b)} = ?`,
      ...mc(ans, [U.round(ans * 10, 6), U.round(ans / 10, 6), U.round(a + b, 6), U.round(ans * 100, 6)], { fmt: f }),
      e: `Ignore the decimals: ${ai} × ${bi} = ${ai * bi}. Count the decimal places in the question: ${ap} + ${bp} = ${places}. Put ${places} place${places > 1 ? 's' : ''} back → ${f(ans)}.`,
      t: `Ignore the dots, multiply the whole numbers, then put back as many decimal places as the question had in total.`,
    };
  });

  def('arith', 2, () => {
    const qv = rand(2, 12), bT = rand(2, 9);
    const b = bT / 10, a = U.round((qv * bT) / 10, 4);
    return {
      q: `${num(a)} ÷ ${num(b)} = ?`,
      ...mc(qv, [qv / 10, qv * 10, qv + 1, qv - 1, qv / 100]),
      e: `Move both decimal points one place right so you divide by a whole number: ${num(a * 10)} ÷ ${bT} = ${qv}.`,
      t: `Slide both decimal points right until you are dividing by a whole number.`,
    };
  });

  def('arith', 1, () => {
    const form = rand(1, 4);
    let q, ans, wrong, steps;
    if (form === 1) {
      const a = rand(2, 20), b = rand(2, 9), c = rand(2, 9);
      q = `${a} + ${b} × ${c}`; ans = a + b * c; wrong = (a + b) * c;
      steps = `${b} × ${c} = ${b * c} first, then ${a} + ${b * c} = ${ans}`;
    } else if (form === 2) {
      const a = rand(3, 9), b = rand(3, 9), d = rand(2, 6), k = rand(2, 6), c = d * k;
      q = `${a} × ${b} − ${c} ÷ ${d}`; ans = a * b - k; wrong = Number.isInteger((a * b - c) / d) ? (a * b - c) / d : a * b - c + d;
      steps = `${a} × ${b} = ${a * b} and ${c} ÷ ${d} = ${k}, then ${a * b} − ${k} = ${ans}`;
    } else if (form === 3) {
      const a = rand(2, 9), b = rand(2, 9), c = rand(2, 6), d = rand(1, 9);
      q = `(${a} + ${b}) × ${c} − ${d}`; ans = (a + b) * c - d; wrong = a + b * c - d;
      steps = `parentheses first: ${a} + ${b} = ${a + b}; then ${a + b} × ${c} = ${(a + b) * c}; then − ${d} = ${ans}`;
    } else {
      const c = rand(2, 6), k = rand(2, 8), b = c * k, a = rand(k + 1, 30), d = rand(1, 12);
      q = `${a} − ${b} ÷ ${c} + ${d}`; ans = a - k + d; wrong = Number.isInteger((a - b) / c) ? (a - b) / c + d : a - b + d;
      steps = `${b} ÷ ${c} = ${k} first; then ${a} − ${k} + ${d} = ${ans}`;
    }
    return {
      q: `${q} = ?`,
      ...mc(ans, [wrong, ans + 1, ans - 1, ans + 2]),
      e: `Order of operations: parentheses, then × and ÷, then + and −. Here: ${steps}.`,
      t: `Do the × and ÷ parts in your head first, then read the line left to right as simple + and −.`,
    };
  });

  def('arith', 1, () => {
    const x = rand(2, 15), y = rand(2, 12);
    const op = pick(['+', '−', '×']);
    const ans = op === '+' ? x + y : op === '−' ? x - y : x * y;
    return {
      q: `√${x * x} ${op} √${y * y} = ?`,
      ...mc(ans, [ans + 1, ans - 1, op === '×' ? x + y : x * y, ans + 2]),
      e: `√${x * x} = ${x} (since ${x} × ${x} = ${x * x}) and √${y * y} = ${y} (since ${y} × ${y} = ${y * y}). ${x} ${op} ${y} = ${ans}.`,
      t: `√ just asks what times itself. Knowing the squares up to 15×15 turns these into instant recall.`,
    };
  });

  def('arith', 2, () => {
    const a = rand(-15, 15) || 4, b = rand(2, 15), c = rand(2, 15);
    const show = (v) => (v < 0 ? `(−${-v})` : v);
    const ans = a - -b - c;
    return {
      q: `${a < 0 ? '−' + -a : a} − (−${b}) − ${c} = ?`,
      ...mc(ans, [a - b - c, a + b + c, ans + 2, -ans, ans - 2], { fmt: (v) => (v < 0 ? '−' + -v : String(v)) }),
      e: `Subtracting a negative is the same as adding: ${show(a)} + ${b} − ${c} = ${ans < 0 ? '−' + -ans : ans}.`,
      t: `Two minus signs side by side make a plus.`,
    };
  });

  // ============ WORD PROBLEMS ============
  const mcMoney = (ans, wrongs) => mc(U.round(ans, 2), wrongs.map((w) => U.round(w, 2)), { fmt: money });

  def('wordprob', 1, () => {
    const [thing] = pick([['pounds of apples'], ['gallons of gas'], ['yards of fabric'], ['boxes of gloves'], ['bags of mulch'], ['packs of floss'], ['bottles of water']]);
    const p = pick([0.75, 1.25, 1.5, 2.25, 2.4, 3.5, 0.8, 1.2, 4.5, 6]);
    const n1 = rand(2, 6), n2 = rand(7, 15);
    const ans = p * n2;
    return {
      q: `If ${n1} ${thing} cost ${money(p * n1)}, how much will ${n2} ${thing} cost?`,
      ...mcMoney(ans, [ans + p, ans - p, p * n1 + n2 - n1, ans + 1, p * (n2 + n1)]),
      e: `Find the price of one: ${money(p * n1)} ÷ ${n1} = ${money(p)}. Then ${n2} × ${money(p)} = ${money(ans)}.`,
      t: `Get the price of ONE first — everything after that is a single multiply.`,
    };
  });

  def('wordprob', 2, () => {
    const thing = pick(['pencils', 'erasers', 'oranges', 'lemons', 'donuts', 'toothbrushes', 'cans of soup']);
    const g = pick([2, 3, 4, 6]);
    const Pr = pick([0.25, 0.4, 0.45, 0.5, 0.75, 0.9, 1, 1.25]);
    const dz = rand(1, 4), count = 12 * dz, groups = count / g;
    const ans = groups * Pr;
    return {
      q: `${cap(thing)} sell at ${g} for ${money(Pr)}. How much will ${dz} dozen cost?`,
      ...mcMoney(ans, [count * Pr, ans + Pr, ans - Pr, dz * Pr, (groups + 1) * Pr]),
      e: `${dz} dozen = ${count}. ${count} ÷ ${g} = ${groups} groups of ${g}. ${groups} × ${money(Pr)} = ${money(ans)}.`,
      t: `A dozen is 12. Count the groups, then multiply by the group price.`,
    };
  });

  def('wordprob', 1, () => {
    const s = pick([35, 40, 45, 50, 55, 60, 65, 70]);
    const h1 = rand(2, 4), h2 = rand(5, 9);
    const D = s * h1, ans = s * h2;
    return {
      q: `A car travels ${D} miles in ${h1} hours. At the same speed, how far will it travel in ${h2} hours?`,
      ...mc(ans, [ans + s, ans - s, D + h2, s * (h2 + h1), ans + 10]),
      e: `Speed = ${D} ÷ ${h1} = ${s} miles per hour. Distance = ${s} × ${h2} = ${ans} miles.`,
      t: `Find the miles in ONE hour, then multiply. One-hour amounts are the easiest thing to scale.`,
    };
  });

  def('wordprob', 2, () => {
    let s, m, guard = 0;
    do {
      s = pick([30, 40, 45, 48, 50, 60, 72, 75, 90]);
      m = pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 50]);
    } while (((s * m) % 60 !== 0 || (s * m) / 60 === m) && guard++ < 100);
    const d = (s * m) / 60;
    return {
      q: `How many minutes will it take to drive ${d} miles at ${s} miles per hour?`,
      ...mc(m, [m + 5, m - 5, m + 10, Math.round((s / d) * 10), m * 2]),
      e: `Time = distance ÷ speed = ${d} ÷ ${s} = ${num(d / s)} hours. × 60 = ${m} minutes.`,
      t: `60 mph is a mile a minute. Compare the speed to 60: at 30 mph a mile takes 2 minutes, at 120 mph half a minute.`,
    };
  });

  def('wordprob', 3, () => {
    const [a, b] = pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [5, 20], [8, 24], [15, 30], [4, 4], [6, 6], [9, 18], [10, 40], [14, 35], [21, 42], [12, 4]]);
    const t = (a * b) / (a + b);
    const [x, y] = names(2);
    const job = pick(['paint a room', 'clean an office', 'stock the shelves', 'sort the files', 'mow a lawn']);
    const unit = a + b > 40 ? 'minutes' : 'hours';
    return {
      q: `${x} can ${job} in ${a} ${unit}. ${y} can do the same job in ${b} ${unit}. How many ${unit} will it take if they work together?`,
      ...mc(t, [(a + b) / 2, a + b, Math.abs(a - b) || a / 4, Math.min(a, b), t + 1]),
      e: `Each ${unit.slice(0, -1)}, ${x} does 1/${a} of the job and ${y} does 1/${b}. Together: 1/${a} + 1/${b} = ${a + b}/${a * b}. Time = ${a * b} ÷ ${a + b} = ${num(t)} ${unit}.`,
      t: `The answer must be less than ${Math.min(a, b)} ${unit} — one person alone is that fast — which usually kills most of the choices. For two people: multiply the times, divide by the sum.`,
    };
  });

  def('wordprob', 1, () => {
    const item = pick(['jacket', 'pair of shoes', 'lamp', 'backpack', 'electric toothbrush', 'set of scrubs']);
    const P0 = pick([20, 40, 60, 80, 120, 45, 90, 50, 150, 36]);
    const p = pick([10, 20, 25, 30, 40, 50, 15]);
    const off = (P0 * p) / 100, ans = P0 - off;
    return {
      q: `A ${item} priced at ${money(P0)} is on sale for ${p}% off. What is the sale price?`,
      ...mcMoney(ans, [off, P0 - p, P0 + off, ans - 5, ans + 5]),
      e: `${p}% of ${money(P0)} = ${money(off)}. ${money(P0)} − ${money(off)} = ${money(ans)}.`,
      t: `${p}% off means you pay ${100 - p}%. 10% of ${money(P0)} is ${money(P0 / 10)}, so ${100 - p}% is ${money(ans)}.`,
    };
  });

  def('wordprob', 3, () => {
    const P0 = pick([100, 200, 80, 120, 150, 250, 400]);
    const p1 = pick([10, 20, 25, 30, 40, 50]), p2 = pick([10, 20, 25, 50]);
    const s1 = (P0 * (100 - p1)) / 100;
    const ans = (s1 * (100 - p2)) / 100;
    return {
      q: `A store marks a ${money(P0)} item down ${p1}%. Later it takes an additional ${p2}% off the sale price. What is the final price?`,
      ...mcMoney(ans, [(P0 * (100 - p1 - p2)) / 100, s1, ans + 5, ans - 5, (P0 * p2) / 100]),
      e: `First: ${p1}% off ${money(P0)} → ${money(s1)}. Then ${p2}% off ${money(s1)} → ${money(ans)}. The second cut comes off the smaller price, not the original.`,
      t: `Never add the two percents. Chain what you PAY instead: ${100 - p1}% of the price, then ${100 - p2}% of that.`,
    };
  });

  def('wordprob', 1, () => {
    const n = rand(3, 5);
    const avg = rand(70, 92);
    const vals = Array.from({ length: n - 1 }, () => avg + rand(-12, 7));
    const last = avg * n - vals.reduce((s, v) => s + v, 0);
    if (last < 50 || last > 100) return QB.gens.wordprob.find((g) => g.d === 1).f();
    vals.push(last);
    const sum = avg * n;
    return {
      q: `What is the average of ${vals.slice(0, -1).join(', ')} and ${last}?`,
      ...mc(avg, [avg + 1, avg - 1, avg + 2, Math.round(sum / (n + 1))]),
      e: `Add them: ${vals.join(' + ')} = ${sum}. Divide by how many numbers there are (${n}): ${sum} ÷ ${n} = ${avg}.`,
      t: `Pick a round number near the middle, add up how far each number sits above or below it, then share that leftover out.`,
    };
  });

  def('wordprob', 2, () => {
    const n = rand(3, 4);
    const target = pick([80, 82, 85, 88, 90]);
    const prev = Array.from({ length: n }, () => rand(target - 12, Math.min(100, target + 8)));
    const need = target * (n + 1) - prev.reduce((s, v) => s + v, 0);
    if (need < 60 || need > 100) return QB.gens.wordprob.find((g) => g.d === 1).f();
    const [x] = names(1);
    const prevAvg = prev.reduce((s, v) => s + v, 0) / n;
    return {
      q: `${x} scored ${prev.join(', ')} on the first ${n} tests. What score is needed on test ${n + 1} to have an average of exactly ${target}?`,
      ...mc(need, [target, Math.round(target + (target - prevAvg)), need + n, need - n, need + 5]),
      e: `To average ${target} over ${n + 1} tests you need ${target} × ${n + 1} = ${target * (n + 1)} total points. So far: ${prev.join(' + ')} = ${target * (n + 1) - need}. Needed: ${target * (n + 1)} − ${target * (n + 1) - need} = ${need}.`,
      t: `Work in points above and below ${target}: add up how far the scores fall short (scores above give points back), then add that gap to ${target}.`,
    };
  });

  def('wordprob', 2, () => {
    const [a, b] = pick([[3, 5], [2, 3], [4, 5], [3, 7], [5, 7], [1, 4], [2, 5], [3, 4]]);
    const k = rand(2, 9);
    const total = (a + b) * k;
    const [g1, g2] = pick([['cats', 'dogs'], ['boys', 'girls'], ['adults', 'children'], ['red marbles', 'blue marbles'], ['morning patients', 'afternoon patients']]);
    const askFirst = chance(0.5);
    const ans = (askFirst ? a : b) * k;
    return {
      q: `The ratio of ${g1} to ${g2} is ${a} to ${b}. If there are ${total} in all, how many are ${askFirst ? g1 : g2}?`,
      ...mc(ans, [(askFirst ? b : a) * k, Math.round(total / (askFirst ? a : b)), ans + k, ans - k, total - ans + 1]),
      e: `${a} + ${b} = ${a + b} parts. ${total} ÷ ${a + b} = ${k} per part. ${cap(askFirst ? g1 : g2)} = ${askFirst ? a : b} × ${k} = ${ans}.`,
      t: `Add the parts first — the total always splits into that many equal shares, so one divide does most of the work.`,
    };
  });

  def('wordprob', 2, () => {
    const r = pick([12, 14, 15, 16, 18, 20, 22, 24]);
    const h = rand(42, 50);
    const ot = h - 40;
    const ans = 40 * r + ot * r * 1.5;
    const [x] = names(1);
    return {
      q: `${x} earns ${money(r)} an hour, with time-and-a-half for every hour over 40 in a week. How much does ${x} earn for working ${h} hours in one week?`,
      ...mcMoney(ans, [h * r, 40 * r + ot * r * 2, 40 * r + ot * 1.5, h * r * 1.5, ans + r]),
      e: `Regular: 40 × ${money(r)} = ${money(40 * r)}. Overtime rate: ${money(r)} × 1.5 = ${money(r * 1.5)}; ${ot} hours × ${money(r * 1.5)} = ${money(ot * r * 1.5)}. Total ${money(ans)}.`,
      t: `Count overtime as 1.5 hours each: ${h} hours = 40 + ${ot} × 1.5 = ${40 + ot * 1.5} normal hours. Then one multiply.`,
    };
  });

  def('wordprob', 2, () => {
    let f, p, guard = 0;
    do {
      f = rand(3, 12);
      p = pick([3, 4, 6, 8, 9, 16, 18]);
    } while ((12 * f) % p !== 0 && guard++ < 100);
    const total = 12 * f, ans = total / p;
    const thing = pick(['board', 'rope', 'ribbon', 'pipe', 'piece of wire']);
    return {
      q: `A ${thing} ${f} feet long is cut into pieces that are each ${p} inches long. How many pieces will there be?`,
      ...mc(ans, [ans + 1, ans - 1, Math.round((f * p) / 12) || ans * 2, ans * 2, total]),
      e: `Change feet to inches first: ${f} × 12 = ${total} inches. ${total} ÷ ${p} = ${ans} pieces.`,
      t: `Change to the smaller unit first (feet × 12). After that it is one divide.`,
    };
  });

  def('wordprob', 2, () => {
    const m = pick([2, 3, 4]);
    const s = rand(4, 16);
    const total = s * (m + 1);
    const [x, y] = names(2);
    const word = m === 2 ? 'twice' : m === 3 ? 'three times' : 'four times';
    return {
      q: `${x} is ${word} as old as ${y}. Together their ages add up to ${total}. How old is ${x}?`,
      ...mc(s * m, [s, total / 2, total - s * m + m, s * m + m, s * (m + 1) - m]),
      e: `Think of ${y} as 1 part and ${x} as ${m} parts: ${m + 1} parts = ${total}, so 1 part = ${s}. ${x} = ${m} × ${s} = ${s * m}.`,
      t: `Think in parts: ${m} parts and 1 part make ${m + 1} parts, so divide the total by ${m + 1}.`,
    };
  });

  def('wordprob', 3, () => {
    const q = rand(3, 8), p = rand(2, 10);
    const a = p + 2 * q;
    const [x] = names(1);
    return {
      q: `In ${p} years, ${x} will be twice as old as ${x} was ${q} years ago. How old is ${x} now?`,
      ...mc(a, [a + 2, a - 2, p + q, 2 * (p + q), a + q]),
      e: `Let age now = A. Then A + ${p} = 2 × (A − ${q}) → A + ${p} = 2A − ${2 * q} → A = ${p} + ${2 * q} = ${a}. Check: in ${p} years ${a + p}; ${q} years ago ${a - q}; ${a + p} = 2 × ${a - q}. ✓`,
      t: `Skip the algebra — try the answers. Start with a middle choice and test it against the sentence.`,
    };
  });

  def('wordprob', 1, () => {
    const n = rand(2, 5);
    const p = pick([1.25, 1.75, 2.5, 0.85, 3.4, 1.6, 2.15]);
    const bill = n * p <= 5 ? 10 : n * p <= 15 ? 20 : 50;
    const cost = U.round(n * p, 2), ans = bill - cost;
    const item = pick(['notebooks', 'pens', 'coffees', 'muffins', 'toothpaste tubes']);
    return {
      q: `You buy ${n} ${item} at ${money(p)} each and pay with a $${bill} bill. How much change should you get?`,
      ...mcMoney(ans, [cost, bill - p, ans - 0.25, ans + 0.25, ans + 1]),
      e: `Cost: ${n} × ${money(p)} = ${money(cost)}. Change: ${money(bill)} − ${money(cost)} = ${money(ans)}.`,
      t: `Count up like a cashier: to the next whole dollar first, then up to the bill.`,
    };
  });

  def('wordprob', 2, () => {
    const P0 = pick([500, 1000, 1200, 2000, 2500, 5000, 800]);
    const r = pick([3, 4, 5, 6, 8]), t = rand(2, 4);
    const ans = (P0 * r * t) / 100;
    return {
      q: `How much simple interest will ${money(P0)} earn in ${t} years at ${r}% per year?`,
      ...mcMoney(ans, [(P0 * r) / 100, P0 + ans, ans * 2, (P0 * r * t) / 1000, ans + (P0 * r) / 100]),
      e: `Interest = amount × rate × years = ${money(P0)} × ${r / 100} × ${t} = ${money(ans)}.`,
      t: `Work out one year (${money((P0 * r) / 100)}), then multiply by the years.`,
    };
  });

  def('wordprob', 2, () => {
    const b = pick([6, 8, 12, 15, 20, 24, 25]);
    let n = b * rand(3, 12) + rand(1, b - 1);
    const thing = pick(['jars', 'books', 'cans', 'toothbrushes', 'glove boxes', 'bottles']);
    const full = chance(0.35);
    const ans = full ? Math.floor(n / b) : Math.ceil(n / b);
    return {
      q: full
        ? `A carton holds ${b} ${thing}. How many cartons can be <b>completely filled</b> with ${n} ${thing}?`
        : `A carton holds ${b} ${thing}. What is the smallest number of cartons needed to pack ${n} ${thing}?`,
      ...mc(ans, [full ? ans + 1 : ans - 1, ans + (full ? 2 : 1), ans - 2, n % b]),
      e: full
        ? `${n} ÷ ${b} = ${num(U.round(n / b, 2))}. Only ${ans} cartons are full; the leftover ${n % b} don’t fill another.`
        : `${n} ÷ ${b} = ${num(U.round(n / b, 2))}. You can’t leave ${n % b} ${thing} behind, so round UP to ${ans} cartons.`,
      t: `Divide, then decide what happens to the leftovers: “enough to pack everything” rounds up, “completely filled” drops them.`,
    };
  });

  def('wordprob', 2, () => {
    const A = pick([20, 25, 40, 50, 80, 120, 200, 250]);
    const p = pick([10, 20, 25, 40, 50, 60, 75]);
    const up = chance(0.6);
    const B = (A * (up ? 100 + p : 100 - p)) / 100;
    const pc = (v) => `${num(v)}%`;
    return {
      q: `The price of an item ${up ? 'rose' : 'dropped'} from ${money(A)} to ${money(B)}. By what percent did the price ${up ? 'increase' : 'decrease'}?`,
      ...mc(p, [U.round((Math.abs(B - A) / B) * 100, 1), Math.abs(B - A), p + 5, p - 5, p * 2], { fmt: pc }),
      e: `Change = ${money(Math.abs(B - A))}. Divide by the ORIGINAL price: ${num(Math.abs(B - A))} ÷ ${num(A)} = ${num(p / 100)} = ${p}%.`,
      t: `Always divide by the STARTING price. Quick check: did it move by about a tenth, a quarter, or a half?`,
    };
  });

  def('wordprob', 1, () => {
    const n = rand(3, 6);
    const each = pick([12, 14, 15, 16, 18, 20, 22.5, 25]);
    const total = n * each;
    const tip = pick([10, 12, 15, 18, 20]);
    const bill = total - tip;
    if (bill <= 0) return QB.gens.wordprob[0].f();
    return {
      q: `${n} friends split a restaurant bill of ${money(bill)} plus a ${money(tip)} tip equally. How much does each person pay?`,
      ...mcMoney(each, [bill / n, each + 1, each - 1, tip / n + bill / (n + 1), each + 2]),
      e: `Total: ${money(bill)} + ${money(tip)} = ${money(total)}. ÷ ${n} people = ${money(each)} each.`,
      t: `Add the tip in first, then divide once. The answer should land just above the bill split on its own.`,
    };
  });

  def('wordprob', 2, () => {
    const r = pick([3, 4, 5, 6, 8, 10, 12]);
    const sales = pick([1500, 2000, 2500, 3000, 4500, 6000, 12000]);
    const ans = (sales * r) / 100;
    return {
      q: `A salesperson earns a ${r}% commission. How much commission is earned on ${money(sales)} in sales?`,
      ...mcMoney(ans, [ans * 10, ans / 10, sales - ans, ans + 50, ans * 2]),
      e: `1% of ${money(sales)} is ${money(sales / 100)}. × ${r} = ${money(ans)}.`,
      t: `1% is two decimal places left: 1% of ${money(sales)} is ${money(sales / 100)}. Multiply that by ${r}.`,
    };
  });

  def('wordprob', 3, () => {
    const n = rand(8, 40), k = pick([3, 3, 4]);
    const nums = Array.from({ length: k }, (_, i) => n + i);
    const sum = nums.reduce((s, v) => s + v, 0);
    const ask = pick(['largest', 'smallest']);
    const ans = ask === 'largest' ? nums[k - 1] : nums[0];
    return {
      q: `The sum of ${k} consecutive whole numbers is ${sum}. What is the ${ask} of the numbers?`,
      ...mc(ans, [ans + 1, ans - 1, Math.round(sum / k), ans + 2, ans - 2]),
      e: `Divide the sum by ${k} to find the middle: ${sum} ÷ ${k} = ${num(sum / k)}. The numbers are ${nums.join(', ')}, so the ${ask} is ${ans}.`,
      t: `Divide the sum by how many numbers there are — that lands you in the middle. Then step out either side.`,
    };
  });

  def('wordprob', 1, () => {
    const [n, d] = pick([[1, 4], [3, 4], [2, 5], [3, 5], [3, 8], [5, 8], [1, 3], [2, 3], [5, 6]]);
    const total = d * rand(3, 10);
    const part = (total * n) / d;
    const [g1, g2] = pick([['boys', 'girls'], ['full-time', 'part-time'], ['new patients', 'returning patients']]);
    return {
      q: `A group of ${total} people is ${n}/${d} ${g1}. The rest are ${g2}. How many are ${g2}?`,
      ...mc(total - part, [part, total - part + 1, total / d, total - n, total - part - 2]),
      e: `${n}/${d} of ${total} = ${total} ÷ ${d} × ${n} = ${part} ${g1}. ${total} − ${part} = ${total - part} ${g2}.`,
      t: `Divide by the bottom number to get one share, then multiply. Asked for the rest? Use the leftover fraction, ${d - n}/${d}.`,
    };
  });

  def('wordprob', 2, () => {
    const k = pick([6, 8, 10, 12]);
    const f = pick([2, 3, 4]);
    let m = pick([5, 6, 7, 9]);
    if (m === f) m += 1;
    const c = f * k, t = m * k;
    const [unit, thing] = pick([['cups of flour', 'cookies'], ['teaspoons of salt', 'servings'], ['bags of seed', 'square yards']]);
    return {
      q: `If ${f} ${unit} are needed for ${c} ${thing}, how many ${unit} are needed for ${t} ${thing}?`,
      ...mc(m, [m + 1, m - 1, f + (t - c) / 10, Math.round(t / f), m + 2]),
      e: `${c} ÷ ${f} = ${k} ${thing} per 1. So ${t} ${thing} needs ${t} ÷ ${k} = ${m} ${unit}.`,
      t: `Find the amount needed for ONE, then multiply — or spot the jump between the two batch sizes and scale by that.`,
    };
  });

  def('wordprob', 3, () => {
    const [w1, d1, w2] = pick([[6, 10, 4], [4, 9, 6], [8, 6, 12], [3, 12, 4], [5, 12, 6], [10, 6, 15], [12, 5, 10], [9, 8, 6]]);
    const ans = (w1 * d1) / w2;
    return {
      q: `${w1} workers can finish a job in ${d1} days. Working at the same rate, how many days would it take ${w2} workers?`,
      ...mc(ans, [(d1 * w2) / w1, d1 + (w1 - w2), ans + 1, ans - 1, d1]),
      e: `Total work = ${w1} workers × ${d1} days = ${w1 * d1} worker-days. ${w1 * d1} ÷ ${w2} workers = ${num(ans)} days.`,
      t: `More workers means fewer days. Multiply workers × days for the fixed total, then divide by the new crew size.`,
    };
  });

  def('wordprob', 1, () => {
    const per = rand(6, 14), days = rand(4, 6), weeks = rand(2, 4);
    const ans = per * days * weeks;
    return {
      q: `A dental hygienist sees ${per} patients a day and works ${days} days a week. How many patients does the hygienist see in ${weeks} weeks?`,
      ...mc(ans, [per * days, per * weeks, per * days + weeks, ans + per, ans - per]),
      e: `${per} × ${days} = ${per * days} per week. × ${weeks} weeks = ${ans}.`,
      t: `Multiply in whichever order is easiest: ${days} days × ${weeks} weeks first, then the patients.`,
    };
  });

  // ============ SHAPES & MEASURING ============
  def('geometry', 1, () => {
    const l = rand(5, 20), w = rand(3, l - 1);
    const area = chance(0.5);
    const ans = area ? l * w : 2 * (l + w);
    return {
      q: `A rectangle is ${l} feet long and ${w} feet wide. What is its ${area ? 'area' : 'perimeter'}?`,
      ...mc(ans, [area ? 2 * (l + w) : l * w, area ? ans + l : l + w, ans + 2, ans - 2]),
      e: area ? `Area = length × width = ${l} × ${w} = ${ans} square feet.` : `Perimeter = distance around = 2 × (${l} + ${w}) = ${ans} feet.`,
      t: `Perimeter: add length and width, then double. Area: multiply them.`,
    };
  });

  def('geometry', 2, () => {
    const s = rand(3, 15);
    const fromP = chance(0.5);
    return fromP
      ? {
          q: `A square has a perimeter of ${4 * s} inches. What is its area?`,
          ...mc(s * s, [4 * s, (4 * s) ** 2 / 4, s * 4 + s, (s + 1) ** 2]),
          e: `Each side = ${4 * s} ÷ 4 = ${s} inches. Area = ${s} × ${s} = ${s * s} square inches.`,
          t: `Everything comes from one side: perimeter ÷ 4.`,
        }
      : {
          q: `A square has an area of ${s * s} square feet. What is its perimeter?`,
          ...mc(4 * s, [s, s * s / 2, 2 * s, 4 * s + 4]),
          e: `Side = √${s * s} = ${s} feet. Perimeter = 4 × ${s} = ${4 * s} feet.`,
          t: `Everything comes from one side: the number that times itself gives the area.`,
        };
  });

  def('geometry', 3, () => {
    const l = pick([9, 12, 15, 18, 21, 24]), w = pick([9, 12, 15, 18]);
    const ans = (l * w) / 9;
    return {
      q: `How many square yards of carpet are needed to cover a floor that is ${l} feet by ${w} feet?`,
      ...mc(ans, [l * w, (l * w) / 3, ((l + w) * 2) / 3, ans + 3]),
      e: `Change feet to yards first: ${l} ft = ${l / 3} yd and ${w} ft = ${w / 3} yd. ${l / 3} × ${w / 3} = ${ans} square yards.`,
      t: `A square yard is 3 ft × 3 ft = 9 square feet. Divide each side by 3 first — smaller numbers, fewer slips.`,
    };
  });

  def('geometry', 2, () => {
    const s = pick([3, 4, 6]);
    const l = rand(4, 12), w = rand(3, 10);
    const per = (12 / s) ** 2;
    const ans = l * w * per;
    return {
      q: `How many ${s}-inch square tiles are needed to cover a floor that is ${l} feet by ${w} feet?`,
      ...mc(ans, [l * w * (12 / s), l * w, ans / 2, ans + per]),
      e: `A foot is 12 inches, so ${12 / s} tiles fit along each foot and ${12 / s} × ${12 / s} = ${per} tiles cover one square foot. The floor is ${l} × ${w} = ${l * w} sq ft. ${l * w} × ${per} = ${ans} tiles.`,
      t: `Work out how many tiles cover ONE square foot, then multiply by the floor’s square feet.`,
    };
  });

  def('geometry', 2, () => {
    const s = pick([2, 3, 4, 6]);
    const ans = (12 / s) ** 2;
    return {
      q: `How many ${s}-inch squares can be cut from a square piece of paper that is 1 foot on each side?`,
      ...mc(ans, [12 / s, (12 / s) * 4, 144 / s, ans + 2]),
      e: `1 foot = 12 inches. ${12 / s} squares fit across and ${12 / s} fit down: ${12 / s} × ${12 / s} = ${ans}.`,
      t: `Count how many fit across one edge, then multiply that by itself.`,
    };
  });

  def('geometry', 2, () => {
    const s = pick([4, 5, 6, 8, 10, 12, 15]);
    const n = rand(5, 15);
    const L2 = s * n;
    return {
      q: `Fence posts are placed ${s} feet apart along a straight ${L2}-foot fence, with a post at each end. How many posts are needed?`,
      ...mc(n + 1, [n, n - 1, n + 2, n * 2]),
      e: `${L2} ÷ ${s} = ${n} gaps between posts. A straight line always has one more post than gaps: ${n} + 1 = ${n + 1}.`,
      t: `A straight fence needs one more post than gaps. Picture a fence with 2 gaps: it takes 3 posts.`,
    };
  });

  def('geometry', 3, () => {
    const s = pick([4, 5, 8, 10]);
    const side = s * rand(3, 8);
    const ans = (4 * side) / s;
    return {
      q: `Posts are placed every ${s} feet around the edge of a square garden that is ${side} feet on each side, with a post at every corner. How many posts are needed?`,
      ...mc(ans, [ans + 1, ans + 4, side / s + 1, ans - 4]),
      e: `Perimeter = 4 × ${side} = ${4 * side} ft. ${4 * side} ÷ ${s} = ${ans}. In a closed loop the last gap ends at the first post, so posts = gaps = ${ans} (no +1).`,
      t: `Around a closed loop, posts = gaps. No extra post, because the last gap closes back to the first.`,
    };
  });

  def('geometry', 1, () => {
    const l = rand(2, 9), w = rand(2, 8), h = rand(2, 6);
    return {
      q: `What is the volume of a box that is ${l} inches long, ${w} inches wide, and ${h} inches high?`,
      ...mc(l * w * h, [l + w + h, 2 * (l * w + w * h + l * h), l * w + h, l * w * h + l]),
      e: `Volume = length × width × height = ${l} × ${w} × ${h} = ${l * w * h} cubic inches.`,
      t: `Multiply all three, starting with the easiest pair.`,
    };
  });

  def('geometry', 3, () => {
    const c = pick([2, 3]);
    const a = c * rand(2, 4), b = c * rand(2, 4), h = c * rand(1, 3);
    const ans = (a / c) * (b / c) * (h / c);
    return {
      q: `How many ${c}-inch cubes fit inside a box that is ${a} × ${b} × ${h} inches?`,
      ...mc(ans, [(a * b * h) / c, a * b * h, ans * c, ans + 2]),
      e: `Count how many fit along each edge: ${a}÷${c} = ${a / c}, ${b}÷${c} = ${b / c}, ${h}÷${c} = ${h / c}. ${a / c} × ${b / c} × ${h / c} = ${ans}.`,
      t: `Divide each edge by the cube size, then multiply those three counts. Dividing the volumes is the trap.`,
    };
  });

  const CONV = [
    ['feet', 'inches', 12, 'foot'], ['yards', 'feet', 3, 'yard'], ['yards', 'inches', 36, 'yard'], ['pounds', 'ounces', 16, 'pound'],
    ['hours', 'minutes', 60, 'hour'], ['gallons', 'quarts', 4, 'gallon'], ['quarts', 'pints', 2, 'quart'], ['days', 'hours', 24, 'day'],
    ['weeks', 'days', 7, 'week'], ['minutes', 'seconds', 60, 'minute'], ['gross', 'items', 144, 'gross'], ['dozen', 'items', 12, 'dozen'],
  ];
  def('geometry', 1, () => {
    const [big1, small, f, one] = pick(CONV);
    const half = chance(0.3);
    const n = rand(2, 9) + (half ? 0.5 : 0);
    const ans = n * f;
    if (!Number.isInteger(ans)) return QB.gens.geometry[0].f();
    const nS = half ? `${Math.floor(n)} 1/2` : n;
    return {
      q: `How many ${small} are in ${nS} ${big1}?`,
      ...mc(ans, [n * (f === 12 ? 10 : 12), ans + f, ans - f, n + f, Math.round(ans / 2)]),
      e: `There are ${f} ${small} in 1 ${one}. ${nS} × ${f} = ${num(ans)}.`,
      t: `Big unit to small unit always multiplies. Worth knowing by heart: 12 inches a foot, 3 feet a yard, 16 ounces a pound, 4 quarts a gallon.`,
    };
  });

  def('geometry', 2, () => {
    const b = 2 * rand(2, 10), h = rand(3, 12);
    return {
      q: `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area?`,
      ...mc((b * h) / 2, [b * h, b + h, (b * h) / 4, (b * h) / 2 + h]),
      e: `Triangle area = ½ × base × height = ½ × ${b} × ${h} = ${(b * h) / 2} square cm.`,
      t: `Half of base × height. Halve the even number first to keep it simple.`,
    };
  });

  def('geometry', 2, () => {
    const scale = pick([10, 20, 40, 50, 60, 80, 100]);
    const inch = rand(1, 6) + 0.5;
    const ans = scale * inch;
    return {
      q: `On a map, 1 inch equals ${scale} miles. Two towns are ${Math.floor(inch)} 1/2 inches apart on the map. How many miles apart are they?`,
      ...mc(ans, [scale * Math.floor(inch), scale * (Math.floor(inch) + 1), ans + scale / 4, ans + 5]),
      e: `${scale} × ${Math.floor(inch)} = ${scale * Math.floor(inch)}, plus half of ${scale} (${scale / 2}) = ${ans} miles.`,
      t: `Do the whole inches first (${scale} × ${Math.floor(inch)}), then add half of ${scale}.`,
    };
  });

  def('geometry', 3, () => {
    const w = rand(3, 9), l = rand(w + 1, 15);
    return {
      q: `A rectangle has an area of ${l * w} square feet. Its width is ${w} feet. What is its perimeter?`,
      ...mc(2 * (l + w), [l, l + w, l * w / 2, 2 * l + w]),
      e: `Length = area ÷ width = ${l * w} ÷ ${w} = ${l}. Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} feet.`,
      t: `Area ÷ width gives the length. Then add the two sides and double.`,
    };
  });

  def('geometry', 3, () => {
    const r = pick([7, 14, 21]);
    const circ = chance(0.5);
    const ans = circ ? 2 * 22 * (r / 7) : 22 * (r / 7) * r;
    return {
      q: `A circle has a radius of ${r} inches. Using π ≈ 22/7, what is its ${circ ? 'circumference (distance around)' : 'area'}?`,
      ...mc(ans, circ ? [22 * (r / 7), ans * 2, 22 * (r / 7) * r] : [2 * 22 * (r / 7), ans * 2, ans / 2]),
      e: circ
        ? `Circumference = 2 × π × r = 2 × 22/7 × ${r} = ${ans} inches.`
        : `Area = π × r × r = 22/7 × ${r} × ${r} = ${ans} square inches.`,
      t: `22/7 is picked so the 7 cancels — divide the radius by 7 first, then multiply.`,
    };
  });

  // ============ DATES & TIME ============
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const D = (i) => DAYS[((i % 7) + 7) % 7];
  const mcDay = (ans, wrongs) => mc(ans, wrongs, { fmt: D, key: (v) => D(v), valid: () => true });

  def('dates', 1, () => {
    const t = rand(0, 6), n = rand(3, 13);
    const ans = t + n;
    return {
      q: `If today is <b>${D(t)}</b>, what day of the week will it be ${n} days from now?`,
      ...mcDay(ans, [ans + 1, ans - 1, ans + 2, ans - 2]),
      e: `${n} days = ${Math.floor(n / 7) ? `${Math.floor(n / 7)} week + ` : ''}${n % 7} day${n % 7 === 1 ? '' : 's'}. A full week lands on the same day, so count ${n % 7} forward from ${D(t)} → ${D(ans)}.`,
      t: `Any 7 days lands on the same day. Drop 7s until fewer than 7 are left, then count those.`,
    };
  });

  def('dates', 2, () => {
    const t = rand(0, 6), n = rand(15, 75);
    const back = chance(0.35);
    const ans = back ? t - n : t + n;
    const r = n % 7;
    return {
      q: `If today is <b>${D(t)}</b>, what day of the week ${back ? `was it ${n} days ago` : `will it be ${n} days from now`}?`,
      ...mcDay(ans, [ans + 1, ans - 1, back ? t + n : t - n, ans + 2]),
      e: `Divide by 7: ${n} ÷ 7 = ${Math.floor(n / 7)} weeks with ${r} left over. Whole weeks don’t change the day, so count ${r} ${back ? 'back' : 'forward'} from ${D(t)} → ${D(ans)}.`,
      t: `Only the leftover after dividing by 7 matters. Whole weeks change nothing.`,
    };
  });

  const REL = [[-3, 'three days ago'], [-2, 'the day before yesterday'], [-1, 'yesterday'], [1, 'tomorrow'], [2, 'the day after tomorrow'], [3, 'three days from now']];
  def('dates', 3, () => {
    const [o1, p1] = pick(REL);
    let [o2, p2] = pick([...REL, [0, 'today']]);
    if (o2 === o1) [o2, p2] = [0, 'today'];
    const X = rand(0, 6);
    const today = X - o1;
    const ans = X + (o2 - o1);
    const ask = o2 === 0 ? 'what day is it today' : o2 < 0 ? `what day was it ${p2}` : `what day will it be ${p2}`;
    return {
      q: `If ${p1} ${o1 < 0 ? 'was' : 'is'} <b>${D(X)}</b>, ${ask}?`,
      ...mcDay(ans, [ans + 1, ans - 1, X - (o2 - o1), ans + 2]),
      e: `First find today: if ${p1} ${o1 < 0 ? 'was' : 'is'} ${D(X)}, today is ${D(today)}. ${o2 === 0 ? `So today is ${D(ans)}.` : `${cap(p2)} is ${Math.abs(o2)} day${Math.abs(o2) > 1 ? 's' : ''} ${o2 < 0 ? 'before' : 'after'} today → ${D(ans)}.`}`,
      t: `Work out today first, then step from today. Jumping straight between the two clues is where people slip.`,
    };
  });

  const clock = (m) => {
    m = ((m % 1440) + 1440) % 1440;
    const h24 = Math.floor(m / 60), mm = m % 60;
    return `${h24 % 12 || 12}:${String(mm).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
  };
  const dur = (m) => {
    const h = Math.floor(m / 60), mm = m % 60;
    return `${h} hr${mm ? ` ${mm} min` : ''}`;
  };

  def('dates', 2, () => {
    const start = rand(24, 47) * 15 + pick([0, 5, 10]);
    const len = rand(8, 40) * 15 + pick([0, 5, 10, -5]);
    const end = start + len;
    const w = [len + 60, len - 60, len + 30, len - 30, len + 15];
    return {
      q: `A shift starts at <b>${clock(start)}</b> and ends at <b>${clock(end)}</b> the same day. How long is the shift?`,
      ...mc(len, w, { fmt: dur, key: String, valid: (v) => v > 0 }),
      e: `From ${clock(start)} to ${clock(start - (start % 60) + 60)} is ${60 - (start % 60)} min. Then count whole hours and minutes to ${clock(end)}. Total = ${dur(len)}.`,
      t: `Count up to the next whole hour, then count whole hours, then the extra minutes. Crossing noon, stop at 12:00 on the way.`,
    };
  });

  def('dates', 2, () => {
    const start = rand(36, 88) * 15 + pick([0, 5]);
    const len = rand(4, 14) * 15 + pick([0, 5, 10]);
    const ans = start + len;
    const act = pick(['A movie starts', 'A meeting begins', 'An appointment starts', 'A flight leaves']);
    return {
      q: `${act} at <b>${clock(start)}</b> and lasts ${dur(len).replace('hr', 'hours').replace('min', 'minutes')}. What time does it end?`,
      ...mc(ans, [ans + 60, ans - 60, ans + 10, ans - 10, ans + 30], { fmt: clock, key: (v) => clock(v) }),
      e: `Add the hours first, then the minutes: ${clock(start)} + ${Math.floor(len / 60)} hr = ${clock(start + Math.floor(len / 60) * 60)}; + ${len % 60} min = ${clock(ans)}.`,
      t: `Add the hours first, then the minutes. If the minutes pass 60, add an hour and take 60 off.`,
    };
  });

  def('dates', 1, () => {
    const m = rand(0, 11), n = rand(2, 11);
    const back = chance(0.3);
    const ans = back ? m - n : m + n;
    const M = (i) => MONTHS[((i % 12) + 12) % 12];
    return {
      q: `What month is ${n} months ${back ? 'before' : 'after'} <b>${M(m)}</b>?`,
      ...mc(ans, [ans + 1, ans - 1, back ? m + n : m - n, ans + 2], { fmt: M, key: (v) => M(v), valid: () => true }),
      e: `Count ${n} months ${back ? 'back' : 'forward'} from ${M(m)}: ${Array.from({ length: n }, (_, i) => M(back ? m - i - 1 : m + i + 1).slice(0, 3)).join(', ')} → ${M(ans)}.`,
      t: `6 months is the opposite side of the year and 12 months is back where you started, so count from the nearest of those.`,
    };
  });

  def('dates', 2, () => {
    const d1 = rand(1, 12), gap = rand(8, 18), d2 = d1 + gap;
    const t = rand(0, 6), ans = t + gap;
    const mon = pick(MONTHS.filter((m) => m !== 'February'));
    return {
      q: `If ${mon} ${d1} is a <b>${D(t)}</b>, what day of the week is ${mon} ${d2}?`,
      ...mcDay(ans, [ans + 1, ans - 1, ans + 2, ans - 2]),
      e: `${d2} − ${d1} = ${gap} days. ${gap} ÷ 7 = ${Math.floor(gap / 7)} week${Math.floor(gap / 7) > 1 ? 's' : ''} and ${gap % 7} day${gap % 7 === 1 ? '' : 's'}. Count ${gap % 7} forward from ${D(t)} → ${D(ans)}.`,
      t: `Subtract the dates, divide by 7, and count only the leftover.`,
    };
  });

  def('dates', 1, () => {
    const m = rand(75, 400);
    return {
      q: `${m} minutes is the same as how many hours and minutes?`,
      ...mc(m, [m + 60, m - 60, m + 10, Math.floor(m / 100) * 60 + (m % 100)], { fmt: dur, key: (v) => dur(v), valid: (v) => v > 0 && v % 60 < 60 }),
      e: `${m} ÷ 60 = ${Math.floor(m / 60)} with ${m % 60} left over → ${dur(m)}. Minutes are not decimals: 1.5 hours is 1 hr 30 min.`,
      t: `Count in 60s: 120 = 2 hr, 180 = 3 hr, 240 = 4 hr. Take the biggest one that fits; whatever is left is the minutes.`,
    };
  });

  // ============ DETAIL CHECKING ============
  const FIRST = ['Mary', 'John', 'Linda', 'Robert', 'Patricia', 'Michael', 'Barbara', 'William', 'Susan', 'David', 'Karen', 'Richard', 'Nancy', 'Joseph', 'Sandra', 'Thomas', 'Donna', 'Charles', 'Carol', 'Daniel'];
  const LAST = ['Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clarkson', 'Rodriguez', 'Whitfield', 'Hendricks', 'McAllister', 'Delgado', 'Fitzgerald', 'Kowalski', 'Baumann', 'Schneider', 'Pemberton', 'Castellano', 'Lindqvist', 'Oyelaran'];
  const STREETS = ['Maple', 'Oakwood', 'Cedar Ridge', 'Pinecrest', 'Willow', 'Birchwood', 'Lakeview', 'Sunset', 'Hillcrest', 'Fairview', 'Kingsley', 'Brookside'];
  const SUF = ['St.', 'Ave.', 'Rd.', 'Dr.', 'Blvd.', 'Ln.', 'Ct.'];
  const LOOK = { 1: '7', 7: '1', 3: '8', 8: '3', 6: '9', 9: '6', 5: '6', 0: '8', 2: '7', 4: '9', a: 'o', o: 'a', e: 'c', c: 'e', i: 'l', l: 'i', m: 'n', n: 'm', r: 'n', u: 'v', h: 'b', b: 'h', t: 'f', f: 't', s: 'z' };
  const digits = (n) => Array.from({ length: n }, () => rand(0, 9)).join('');
  function makeItem(kind) {
    if (kind === 'num') return pick([() => `${digits(4)}-${digits(4)}`, () => digits(rand(6, 8)), () => `(${rand(2, 9)}${digits(2)}) ${digits(3)}-${digits(4)}`, () => `${AB[rand(0, 25)]}${AB[rand(0, 25)]}-${digits(4)}-${AB[rand(0, 25)]}${AB[rand(0, 25)]}`])();
    if (kind === 'name') return `${pick(LAST)}, ${pick(FIRST)} ${AB[rand(0, 25)]}.`;
    return `${rand(10, 9999)} ${pick(['N.', 'S.', 'E.', 'W.', ''])} ${pick(STREETS)} ${pick(SUF)}`.replace(/\s+/g, ' ');
  }
  function mutate(s) {
    for (let tries = 0; tries < 50; tries++) {
      const i = rand(0, s.length - 1);
      const ch = s[i];
      if (!/[A-Za-z0-9]/.test(ch)) continue;
      const mode = rand(1, 3);
      let out;
      if (mode === 1 && i < s.length - 1 && /[A-Za-z0-9]/.test(s[i + 1]) && s[i + 1] !== ch) {
        out = s.slice(0, i) + s[i + 1] + ch + s.slice(i + 2);
      } else if (mode === 2 && LOOK[ch.toLowerCase()]) {
        let r = LOOK[ch.toLowerCase()];
        if (ch !== ch.toLowerCase()) r = r.toUpperCase();
        out = s.slice(0, i) + r + s.slice(i + 1);
      } else if (mode === 3 && /[a-z]/.test(ch) && i > 0) {
        out = s.slice(0, i) + s.slice(i + 1);
      }
      if (out && out !== s) return out;
    }
    return /\d/.test(s) ? s.replace(/\d/, (d) => String((+d + 1) % 10)) : s.slice(0, -1) + (s.endsWith('.') ? ',' : '.');
  }
  function pairsQ(kinds) {
    const same = rand(0, 5);
    const flags = shuffle(Array.from({ length: 5 }, (_, i) => i < same));
    const rows = flags.map((isSame) => {
      const a = makeItem(pick(kinds));
      return { a, b: isSame ? a : mutate(a), same: isSame };
    });
    const diffList = rows.map((r, i) => (r.same ? null : `#${i + 1} (${U.esc(r.a)} vs ${U.esc(r.b)})`)).filter(Boolean);
    return {
      q: `How many of these pairs are <b>exactly</b> alike?<table class="pairs">${rows.map((r, i) => `<tr><td class="n">${i + 1}</td><td>${U.esc(r.a)}</td><td>${U.esc(r.b)}</td></tr>`).join('')}</table>`,
      c: ['0', '1', '2', '3', '4', '5'],
      a: same,
      fixed: true,
      e: same === 5 ? 'All five pairs match exactly.' : `${same} pair${same === 1 ? ' is' : 's are'} identical. Different: ${diffList.join('; ')}.`,
      t: `Read in chunks of 3–4 characters instead of one at a time, and check the middle — that is where changes hide. Look-alikes: 1/7, 3/8, 6/9, rn/m.`,
    };
  }
  def('compare', 2, () => pairsQ(['num']));
  def('compare', 3, () => pairsQ(['name', 'addr', 'name']));
  def('compare', 1, () => {
    const a = makeItem(pick(['num', 'num', 'name', 'addr']));
    const same = chance(0.45);
    const b = same ? a : mutate(a);
    return {
      q: `Are these two exactly the same?${big(`${U.esc(a)}<br>${U.esc(b)}`)}`,
      c: ['Same', 'Different'],
      a: same ? 0 : 1,
      fixed: true,
      e: same ? 'They match character for character.' : `They differ: “${U.esc(a)}” vs “${U.esc(b)}”.`,
      t: `Compare in chunks of 3–4 characters and watch the look-alikes: 1/7, 3/8, 6/9, rn/m.`,
    };
  });

  // ============ SCRAMBLED SENTENCES ============
  const SENTENCES = [
    ['Dogs usually have four legs', true], ['The sun rises in the west', false], ['Ice is colder than steam', true],
    ['A week has eight days', false], ['Fish can live out of water for years', false], ['Most birds are able to fly', true],
    ['Children grow into adults over time', true], ['Winter is usually warmer than summer', false], ['Paper burns easily in a fire', true],
    ['A triangle has four sides', false], ['People need water to stay alive', true], ['The moon is larger than the earth', false],
    ['An hour is longer than a minute', true], ['Teeth are softer than bread', false], ['Brushing helps prevent tooth decay', true],
    ['Sugar is good for healthy teeth', false], ['Snow falls mostly in hot weather', false], ['A dollar is worth more than a dime', true],
    ['Trees grow from small seeds', true], ['Cats are larger than elephants', false], ['Rain comes from clouds in the sky', true],
    ['Glass is easy to see through', true], ['Stones float easily on water', false], ['Night is darker than day', true],
    ['Most people sleep during the night', true], ['Lemons taste very sweet', false], ['A year has twelve months', true],
    ['Doctors often help sick people', true], ['Bread is made mostly from metal', false], ['Adults have more teeth than babies', true],
    ['Milk comes from chickens', false], ['A mile is shorter than a foot', false], ['Wood comes from trees', true],
    ['Dentists clean teeth with hammers', false], ['Floss removes food between teeth', true], ['An apple is a type of fruit', true],
    ['A circle has three corners', false], ['Fire needs air to burn', true], ['Water boils when it is very cold', false],
    ['The ocean water is salty', true], ['Spiders have six legs', false], ['January comes before March', true],
    ['Feathers are heavier than the same amount of lead', false], ['Plants need sunlight to grow', true], ['Horses can fly over mountains', false],
  ];
  def('scramble', 2, () => {
    const [s, truth] = pick(SENTENCES);
    const words = s.toUpperCase().split(' ');
    let sc;
    do sc = shuffle(words); while (sc.join(' ') === words.join(' '));
    return {
      q: `Rearrange these words to make a sentence. Is the sentence <b>true</b> or <b>false</b>?${big(sc.join('  '))}`,
      c: ['True', 'False'],
      a: truth ? 0 : 1,
      fixed: true,
      e: `The sentence is: “${s}.” That is ${truth ? 'true' : 'false'}.`,
      t: `Find the naming word and the action word first. You can usually judge true or false before the sentence is fully sorted.`,
    };
  });

  // ============ LOGIC ============
  const NONSENSE = ['blims', 'zorps', 'tuns', 'glips', 'frabs', 'wexes', 'plonks', 'drells', 'snigs', 'varks', 'quibs', 'mogs', 'trels', 'bings', 'yabs', 'klems'];
  const PEOPLE = ['Zeb', 'Pim', 'Rook', 'Tal', 'Vex', 'Nim'];
  const sing = (w) => w.replace(/es$/, (m) => (/(x|s)es$/.test(w) ? '' : 'e')).replace(/s$/, '');
  const an = (w) => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;
  const TF = ['True', 'False', 'Not certain'];
  // [difficulty, premise1, premise2, conclusion, answer 0=T 1=F 2=NC, why]
  const SYL = [
    [1, 'All A are B.', 'All B are C.', 'All A are C.', 0, 'The A circle is inside the B circle, and the B circle is inside the C circle, so all A are C.'],
    [2, 'All A are B.', 'All C are B.', 'All A are C.', 2, 'A and C are both inside B, but they might not overlap each other. You can’t be sure.'],
    [2, 'All A are B.', 'No B are C.', 'No A are C.', 0, 'A is inside B, and B never touches C, so A can’t touch C.'],
    [3, 'Some A are B.', 'Some B are C.', 'Some A are C.', 2, 'The B that are A and the B that are C could be completely different ones.'],
    [3, 'Some A are B.', 'All B are C.', 'Some A are C.', 0, 'The A that are B are also C (all B are C), so some A are C.'],
    [3, 'All A are B.', 'Some B are C.', 'Some A are C.', 2, 'The B that are C might not include any A.'],
    [2, 'All A are B.', 'All B are C.', 'No A are C.', 1, 'A is inside B, which is inside C, so all A are C. “No A are C” is false.'],
    [2, 'All A are B.', 'No B are C.', 'Some A are C.', 1, 'A is inside B, and nothing in B is C, so no A can be C.'],
    [3, 'No A are B.', 'No B are C.', 'No A are C.', 2, 'A and C are both outside B, but nothing says whether A and C overlap.'],
    [3, 'No A are B.', 'All C are A.', 'No C are B.', 0, 'C is inside A, and A never touches B, so C never touches B.'],
    [3, 'All A are B.', 'No C are A.', 'No C are B.', 2, 'C is outside A, but C could still be in the part of B that isn’t A.'],
  ];
  const IND = [
    [1, 'All A are B.', 'X is an A.', 'X is a B.', 0, 'All A are B, and X is an A, so X must be a B.'],
    [2, 'All A are B.', 'X is an A.', 'X is not a B.', 1, 'All A are B, and X is an A, so X must be a B. The statement is false.'],
    [2, 'All A are B.', 'X is a B.', 'X is an A.', 2, 'X could be a B that isn’t an A — nothing says B contains only A.'],
    [2, 'All A are B.', 'X is not a B.', 'X is not an A.', 0, 'If X were an A, X would have to be a B. X isn’t a B, so X can’t be an A.'],
    [2, 'All A are B.', 'X is not an A.', 'X is not a B.', 2, 'X is not an A, but X could still be a B (B may include other things).'],
    [2, 'No A are B.', 'X is an A.', 'X is a B.', 1, 'No A are B, so X (an A) can’t be a B.'],
    [3, 'Some A are B.', 'X is an A.', 'X is a B.', 2, 'Only some A are B. X could be one of them, or not.'],
  ];
  function fill(tpl, A, Bw, C, X) {
    return tpl
      .replace(/an A\b/g, an(sing(A))).replace(/a B\b/g, an(sing(Bw)))
      .replace(/\bA\b/g, A).replace(/\bB\b/g, Bw).replace(/\bC\b/g, C).replace(/\bX\b/g, X)
      .replace(/^(\w)/, (m) => m.toUpperCase());
  }
  function sylQ(t) {
    const [A, Bw, C] = sample(NONSENSE, 3);
    const X = pick(PEOPLE);
    const [, p1, p2, c, ans, why] = t;
    return {
      q: `Assume the first two statements are true. Is the third statement true, false, or not certain?<div class="stmts"><div>1. ${fill(p1, A, Bw, C, X)}</div><div>2. ${fill(p2, A, Bw, C, X)}</div><div>3. ${fill(c, A, Bw, C, X)}</div></div>`,
      c: TF.slice(),
      a: ans,
      fixed: true,
      e: `${TF[ans]}. ${fill(why, A, Bw, C, X)}`,
      t: `Draw a circle for each group, or swap the made-up words for real ones (cats, animals). If you can picture even one case where it fails, answer “Not certain”.`,
    };
  }
  for (const t of SYL) def('logic', t[0], () => sylQ(t));
  for (const t of IND) def('logic', t[0], () => sylQ(t));

  const COMPS = [
    ['taller', 'shorter', 'tallest', 'shortest'],
    ['older', 'younger', 'oldest', 'youngest'],
    ['faster', 'slower', 'fastest', 'slowest'],
    ['heavier', 'lighter', 'heaviest', 'lightest'],
  ];
  function rankQ(n, tree, askSuper) {
    const ppl = names(n); // ppl[0] is the most (tallest), ppl[n-1] the least
    const [more, less, most, least] = pick(COMPS);
    const edges = [];
    if (!tree) for (let i = 0; i < n - 1; i++) edges.push([i, i + 1]);
    else for (let i = 1; i < n; i++) {
      const j = rand(0, i - 1);
      edges.push([j, i]);
    }
    const reach = Array.from({ length: n }, () => Array(n).fill(false));
    edges.forEach(([a, b]) => (reach[a][b] = true));
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (reach[i][k] && reach[k][j]) reach[i][j] = true;
    const say = ([a, b]) => (chance(0.5) ? `${ppl[a]} is ${more} than ${ppl[b]}.` : `${ppl[b]} is ${less} than ${ppl[a]}.`);
    const facts = shuffle(edges).map(say).join(' ');
    if (askSuper) {
      const top = chance(0.5);
      const ans = top ? 0 : n - 1;
      return {
        q: `${facts} Who is the <b>${top ? most : least}</b>?`,
        c: ppl.slice().sort(),
        a: ppl.slice().sort().indexOf(ppl[ans]),
        e: `Line them up from ${most} to ${least}: ${ppl.join(' → ')}. The ${top ? most : least} is ${ppl[ans]}.`,
        t: `Line the names up left to right as you read — each fact slots someone in. The one nobody beats is the answer.`,
      };
    }
    let i, j, guard = 0;
    do {
      [i, j] = sample([...Array(n).keys()], 2);
    } while (guard++ < 30 && Math.abs(i - j) === 1 && !tree);
    const useMore = chance(0.5);
    const stmt = useMore ? `${ppl[i]} is ${more} than ${ppl[j]}.` : `${ppl[i]} is ${less} than ${ppl[j]}.`;
    const iAbove = reach[i][j], jAbove = reach[j][i];
    let ans;
    if (!iAbove && !jAbove) ans = 2;
    else ans = (useMore ? iAbove : jAbove) ? 0 : 1;
    const why = ans === 2
      ? `Nothing links ${ppl[i]} and ${ppl[j]} — not directly and not through a chain of other people — so you can’t tell.`
      : `Following the chain: ${tree ? `the facts show ${iAbove ? ppl[i] : ppl[j]} is ${more} than ${iAbove ? ppl[j] : ppl[i]}` : ppl.join(' → ') + ` (${most} to ${least})`}.`;
    return {
      q: `Assume these facts are true: ${facts}<br><br>Is this statement true, false, or not certain? <b>${stmt}</b>`,
      c: TF.slice(),
      a: ans,
      fixed: true,
      e: `${TF[ans]}. ${why}`,
      t: `Build the line-up first, then look for a link between the two names. No link, even through other people, means “Not certain”.`,
    };
  }
  def('logic', 1, () => rankQ(3, false, true));
  def('logic', 2, () => rankQ(3, false, false));
  def('logic', 2, () => rankQ(4, false, true));
  def('logic', 3, () => rankQ(4, false, false));
  def('logic', 3, () => rankQ(4, true, false));
  def('logic', 3, () => rankQ(3, true, false));
})();
