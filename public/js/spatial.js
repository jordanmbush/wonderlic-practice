// Shape and pattern questions — the abstract-reasoning part of the test.
// Figures are inline SVG (no image files), drawn in currentColor so they
// follow the light/dark theme.
(function () {
  const { rand, pick, chance, shuffle, sample } = U;
  const def = QB.def.bind(QB);

  const svg = (inner, size) => `<svg viewBox="0 0 100 100" class="fig${size ? ' ' + size : ''}">${inner}</svg>`;
  const poly = (pts, solid) =>
    `<polygon points="${pts}" fill="${solid ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>`;
  const dot = (x, y, r = 7) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="currentColor"/>`;
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`;

  // Turn (and optionally flip) a figure. Flipping is what makes a shape
  // impossible to match by turning alone.
  const place = (inner, deg, flip) =>
    `<g transform="rotate(${deg} 50 50)${flip ? ' translate(100 0) scale(-1 1)' : ''}">${inner}</g>`;

  // Shapes with no mirror symmetry and no rotational symmetry, so every turn
  // looks different and a flipped copy can never be matched by turning.
  const GLYPHS = [
    () => poly('26,18 46,18 46,62 62,62 62,82 26,82'), // L block, arms clearly unequal
    () => poly('24,16 24,84 70,84'), // scalene right triangle
    () => poly('28,20 36,20 36,82 28,82', true) + poly('36,26 74,38 36,50', true), // flag
    () => poly('25,25 64,25 78,39 78,78 25,78') + dot(60, 66), // clipped square, dot well off the diagonal
    () => poly('25,46 50,22 75,46 75,79 25,79') + box(57, 57, 13, 22), // house with a door
  ];

  // A regular shape with `sides` sides, turned by `rot` degrees.
  const flat = (sides) => (sides % 2 === 0 ? 180 / sides : 0); // sit even-sided shapes flat
  const reg = (sides, r, rot, solid) => {
    const pts = Array.from({ length: sides }, (_, i) => {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2 + (rot * Math.PI) / 180;
      return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return poly(pts, solid);
  };

  const row = (figs) => `<div class="figrow">${figs.join('')}</div>`;
  const numbered = (figs) =>
    `<div class="figrow">${figs.map((f, i) => `<div class="figbox"><span>${i + 1}</span>${f}</div>`).join('')}</div>`;
  const QMARK = '<div class="qcell fig">?</div>';
  const PICK5 = ['1', '2', '3', '4', '5'];

  // Choices are pictures, so compare the markup itself to be sure no two
  // options show the same figure.
  function mcFig(correct, wrongs, n = 5) {
    const out = [correct];
    for (const w of wrongs) {
      if (out.length >= n) break;
      if (!out.includes(w)) out.push(w);
    }
    const order = shuffle(out);
    return { c: order, a: order.indexOf(correct) };
  }

  const norm = (d) => ((d % 360) + 360) % 360;

  // ---------- which figure comes next (turning) ----------
  def('spatial', 2, () => {
    const g = pick(GLYPHS)();
    const step = pick([45, 90, -45, -90, 135]);
    const shown = Math.abs(step) === 90 ? 3 : 4;
    const start = rand(0, 7) * 45;
    const seq = Array.from({ length: shown }, (_, i) => svg(place(g, start + step * i)));
    const ansDeg = start + step * shown;
    const ans = svg(place(g, ansDeg));
    const wrongs = [
      svg(place(g, ansDeg, true)),
      svg(place(g, ansDeg + step)),
      svg(place(g, ansDeg - step)),
      svg(place(g, ansDeg + 90)),
      svg(place(g, ansDeg + 180)),
      svg(place(g, ansDeg - 90)),
    ];
    const way = step > 0 ? 'clockwise' : 'counter-clockwise';
    return {
      q: `Which figure comes next?${row(seq.concat(QMARK))}`,
      ...mcFig(ans, wrongs),
      e: `Each figure turns ${Math.abs(step)}° ${way}, so the next one sits ${norm(ansDeg - start)}° round from where the row started.`,
      t: 'Pick one feature — the point, the door, the long leg — and watch only that travel round. Ignore the rest of the shape.',
    };
  });

  // ---------- which one has been flipped ----------
  def('spatial', 3, () => {
    const g = pick(GLYPHS)();
    const angles = sample([0, 45, 90, 135, 180, 225, 270, 315], 5);
    const oddAt = rand(0, 4);
    const figs = angles.map((a, i) => svg(place(g, a, i === oddAt)));
    return {
      q: `Four of these are the same figure turned different ways. Which one is different?${numbered(figs)}`,
      c: PICK5.slice(),
      a: oddAt,
      fixed: true,
      e: `Figure ${oddAt + 1} is a mirror image — flipped over, not turned. No amount of turning makes it match the other four.`,
      t: 'Turning never swaps left for right. The figure whose hook or point faces the opposite way is the flipped one.',
    };
  });

  // ---------- odd one out by a simple property ----------
  def('spatial', 1, () => {
    const oddAt = rand(0, 4);
    const kind = pick(['sides', 'shaded', 'dot']);
    let figs, e;
    if (kind === 'sides') {
      const base = pick([3, 4, 5, 6]);
      const odd = base === 3 ? 4 : base - 1;
      figs = Array.from({ length: 5 }, (_, i) => reg(i === oddAt ? odd : base, rand(28, 38), rand(0, 90), false));
      e = `Four of them have ${base} sides. Figure ${oddAt + 1} has ${odd}.`;
    } else if (kind === 'shaded') {
      const sides = pick([3, 4, 5, 6]);
      figs = Array.from({ length: 5 }, (_, i) => reg(sides, rand(28, 38), rand(0, 90), i !== oddAt));
      e = `Four of them are filled in. Figure ${oddAt + 1} is just an outline.`;
    } else {
      const sides = pick([3, 4, 5, 6]);
      figs = Array.from({ length: 5 }, (_, i) => reg(sides, 36, rand(0, 90), false) + (i === oddAt ? '' : dot(50, 52, 8)));
      e = `Four of them have a dot inside. Figure ${oddAt + 1} is empty.`;
    }
    return {
      q: `Which figure does NOT belong with the others?${numbered(figs.map((f) => svg(f)))}`,
      c: PICK5.slice(),
      a: oddAt,
      fixed: true,
      e,
      t: 'Run one check at a time: count the sides, then filled or not, then what is inside. Stop at the first check that splits 4 from 1.',
    };
  });

  // ---------- complete the grid ----------
  const SHAPES = {
    triangle: (fill) => reg(3, 34, 0, fill === 'solid') + (fill === 'dot' ? dot(50, 58, 7) : ''),
    square: (fill) => reg(4, 34, flat(4), fill === 'solid') + (fill === 'dot' ? dot(50, 50, 7) : ''),
    circle: (fill) =>
      `<circle cx="50" cy="50" r="32" fill="${fill === 'solid' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="5"/>` +
      (fill === 'dot' ? dot(50, 50, 7) : ''),
  };
  const FILL_WORD = { open: 'an empty shape', dot: 'a shape with a dot in it', solid: 'a filled-in shape' };
  def('spatial', 2, () => {
    const shapes = shuffle(Object.keys(SHAPES));
    const fills = shuffle(['open', 'dot', 'solid']);
    const byRow = chance(0.5); // shape changes down the rows, or across the columns
    const cellAt = (r, c) => SHAPES[shapes[byRow ? r : c]](fills[byRow ? c : r]);
    const cells = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        cells.push(r === 2 && c === 2 ? '<div class="qcell">?</div>' : svg(cellAt(r, c), 'sm'));
    const ansShape = shapes[2], ansFill = fills[2];
    const ans = svg(SHAPES[ansShape](ansFill));
    const wrongs = [
      svg(SHAPES[ansShape](fills[0])),
      svg(SHAPES[ansShape](fills[1])),
      svg(SHAPES[shapes[0]](ansFill)),
      svg(SHAPES[shapes[1]](ansFill)),
      svg(SHAPES[shapes[0]](fills[0])),
    ];
    return {
      q: `Which figure belongs in the empty box?<div class="matrix">${cells.join('')}</div>`,
      ...mcFig(ans, wrongs),
      e: `Each ${byRow ? 'row' : 'column'} keeps the same shape and each ${byRow ? 'column' : 'row'} keeps the same filling, so the missing one is ${FILL_WORD[ansFill]} — a ${ansShape}.`,
      t: 'Say the pattern in two short phrases — “shape across, filling down” — then read off what the empty box has to be.',
    };
  });

  // ---------- counting series ----------
  const ring = (n) => {
    const out = [`<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="4"/>`];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / Math.max(n, 3) - Math.PI / 2;
      out.push(dot(50 + (n === 1 ? 0 : 25) * Math.cos(a), 50 + (n === 1 ? 0 : 25) * Math.sin(a), 8));
    }
    return out.join('');
  };
  def('spatial', 1, () => {
    const useDots = chance(0.5);
    const fig = (n) => svg(useDots ? ring(n) : reg(n, 36, flat(n), false));
    const start = useDots ? rand(1, 3) : 3;
    const len = useDots ? 4 : 3; // shapes stop at a hexagon; dots can run longer
    const seq = Array.from({ length: len }, (_, i) => start + i);
    const ansN = start + len;
    const ans = fig(ansN);
    const wrongs = [fig(ansN + 1), fig(seq[len - 1]), fig(seq[len - 2]), fig(ansN + 2)];
    return {
      q: `Which figure comes next?${row(seq.map(fig).concat(QMARK))}`,
      ...mcFig(ans, wrongs, 4),
      e: useDots
        ? `The number of dots goes up by one each time: ${seq.join(', ')}. Next is ${ansN}.`
        : `The number of sides goes up by one each time: ${seq.join(', ')}. Next is a ${ansN}-sided figure.`,
      t: `Count the parts and turn the row into numbers — ${seq.join(', ')} — then the answer is just the next number.`,
    };
  });

  // ---------- same figure, turned ----------
  def('spatial', 2, () => {
    const [gA, gB] = sample(GLYPHS, 2);
    const a = gA(), b = gB();
    const base = rand(0, 7) * 45;
    const ansDeg = base + pick([45, 90, 135, 180, 225, 270]);
    const ans = svg(place(a, ansDeg));
    const wrongs = [
      svg(place(a, ansDeg + 90, true)),
      svg(place(a, base, true)),
      svg(place(b, rand(0, 7) * 45)),
      svg(place(b, rand(0, 7) * 45, true)),
    ];
    return {
      q: `Which figure is the SAME as this one, just turned?${row([svg(place(a, base))])}`,
      ...mcFig(ans, wrongs, 4),
      e: 'Only one choice is this figure turned. Two of the others are mirror images (flipped over) and the rest are a different shape.',
      t: 'Flipped copies are the trap. Check which way the shape leans: turning keeps that the same, flipping reverses it.',
    };
  });
})();
