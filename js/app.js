(function () {
  const { shuffle, pick, esc } = U;
  const $main = document.getElementById('main');
  const TARGET_SEC = 14.4; // 12 minutes / 50 questions
  const TEST_Q = 50, TEST_SEC = 12 * 60;
  const DIFF = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
  const KEYS = 'ABCDEF';

  // ---------------- storage ----------------
  const Store = {
    data: null,
    get() {
      if (this.data) return this.data;
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem('wonderlic-practice') || '{}');
      } catch (e) {}
      this.data = Object.assign({ stats: {}, tests: [], seen: {}, missed: [], daily: {}, settings: { target: 22 } }, saved);
      return this.data;
    },
    save() {
      try {
        localStorage.setItem('wonderlic-practice', JSON.stringify(this.data));
      } catch (e) {}
    },
    record(q, correct, ms, mode) {
      const d = this.get();
      const s = (d.stats[q.cat] = d.stats[q.cat] || { n: 0, c: 0, ms: 0 });
      s.n++;
      if (correct) s.c++;
      s.ms += Math.min(ms, 120000);
      if (!q.gen) d.seen[q.id] = 1;
      const day = new Date().toISOString().slice(0, 10);
      d.daily[day] = (d.daily[day] || 0) + 1;
      const snap = { id: q.id, cat: q.cat, q: q.q, c: q.c, a: q.a, e: q.e, d: q.d, fixed: true };
      d.missed = d.missed.filter((m) => m.id !== q.id);
      if (!correct) d.missed.push(snap);
      if (d.missed.length > 200) d.missed = d.missed.slice(-200);
      this.save();
    },
  };

  // ---------------- question selection ----------------
  function prep(item) {
    const q = Object.assign({}, item);
    if (!q.fixed) {
      const order = shuffle(q.c.map((_, i) => i));
      q.c = order.map((i) => item.c[i]);
      q.a = order.indexOf(item.a);
    }
    return q;
  }

  function getQuestion(cat, diff, used) {
    const bank = QB.static[cat];
    if (bank && bank.length) {
      const seen = Store.get().seen;
      const fresh = (x) => !used.has(x.id);
      let pool = bank.filter((x) => fresh(x) && !seen[x.id] && (!diff || x.d === diff));
      if (!pool.length) pool = bank.filter((x) => fresh(x) && !seen[x.id]);
      if (!pool.length) {
        // Every question in this category has been seen: start the cycle over.
        bank.forEach((x) => delete seen[x.id]);
        pool = bank.filter((x) => fresh(x) && (!diff || x.d === diff));
        if (!pool.length) pool = bank.filter(fresh);
        if (!pool.length) pool = bank;
      }
      const item = pick(pool);
      used.add(item.id);
      return prep(item);
    }
    const gens = QB.gens[cat] || [];
    let q;
    for (let tries = 0; tries < 8; tries++) {
      let pool = diff ? gens.filter((g) => g.d === diff) : gens;
      if (!pool.length) pool = gens;
      const g = pick(pool);
      const r = g.f();
      q = Object.assign({ cat, d: g.d, gen: true }, r);
      q.id = cat + ':g:' + U.hash(r.q);
      if (!used.has(q.id)) break;
    }
    used.add(q.id);
    return q.fixed ? q : prep(q);
  }

  function weightedCat(cats) {
    const list = cats.filter((c) => QB.has(c));
    const total = list.reduce((s, c) => s + CAT[c].weight, 0);
    let r = Math.random() * total;
    for (const c of list) if ((r -= CAT[c].weight) < 0) return c;
    return list[0];
  }

  function buildTest() {
    const slots = [];
    CATS.forEach((c) => {
      for (let i = 0; i < c.weight; i++) slots.push(QB.has(c.id) ? c.id : 'wordprob');
    });
    const order = shuffle(slots).slice(0, TEST_Q);
    const used = new Set();
    // Like the real test: easier questions first, harder at the end.
    return order.map((cat, i) => getQuestion(cat, i < 15 ? 1 : i < 35 ? 2 : 3, used));
  }

  function weakCats(n = 3) {
    const st = Store.get().stats;
    return CATS.map((c) => {
      const s = st[c.id];
      const acc = s && s.n ? s.c / s.n : null;
      const sec = s && s.n ? s.ms / s.n / 1000 : null;
      // Unpracticed topics count as weak; slow topics count a bit weaker.
      const score = acc === null ? 0.45 : acc - Math.max(0, (sec - TARGET_SEC) / 100);
      return { id: c.id, acc, sec, n: s ? s.n : 0, score };
    })
      .sort((a, b) => a.score - b.score)
      .slice(0, n);
  }

  // ---------------- helpers ----------------
  let timers = [];
  let keyHandler = null;
  function clearTimers() {
    timers.forEach((t) => clearInterval(t));
    timers = [];
    keyHandler = null;
  }
  const fmtClock = (s) => {
    s = Math.max(0, Math.ceil(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  const pct = (v) => (v === null || v === undefined || isNaN(v) ? '—' : Math.round(v * 100) + '%');
  const catName = (id) => (CAT[id] ? CAT[id].name : id);
  function setView(html) {
    $main.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function catChips(selected) {
    return `<div class="chips">${CATS.filter((c) => QB.has(c.id))
      .map((c) => `<button class="chip ${selected.includes(c.id) ? 'on' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`)
      .join('')}</div>
      <div class="chip-actions"><button class="link" data-act="all">Select all</button> · <button class="link" data-act="none">Clear</button> · <button class="link" data-act="weak">My weak spots</button></div>`;
  }
  function wireChips(state) {
    $main.querySelectorAll('.chip').forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.dataset.cat;
        state.cats = state.cats.includes(id) ? state.cats.filter((x) => x !== id) : [...state.cats, id];
        b.classList.toggle('on');
      })
    );
    const set = (ids) => {
      state.cats = ids;
      $main.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', ids.includes(b.dataset.cat)));
    };
    $main.querySelector('[data-act=all]').onclick = () => set(CATS.map((c) => c.id));
    $main.querySelector('[data-act=none]').onclick = () => set([]);
    $main.querySelector('[data-act=weak]').onclick = () => set(weakCats(3).map((w) => w.id));
  }

  function questionHTML(q, opts = {}) {
    const label = opts.label || '';
    return `<div class="qcard">
      <div class="qmeta"><span>${label}</span><span>${CAT[q.cat].icon} ${catName(q.cat)} · ${DIFF[q.d] || ''}</span></div>
      <div class="qtext">${q.q}</div>
      <div class="choices ${q.c.length <= 3 ? 'row' : ''}">${q.c
        .map((c, i) => `<button class="choice" data-i="${i}"><span class="key">${KEYS[i]}</span><span class="ctext">${c}</span></button>`)
        .join('')}</div>
      <div class="feedback" hidden></div>
    </div>`;
  }

  function keyIndex(e, n) {
    const k = e.key.toUpperCase();
    let i = KEYS.indexOf(k);
    if (i < 0 && /^[1-6]$/.test(k)) i = +k - 1;
    return i >= 0 && i < n ? i : -1;
  }

  // ---------------- HOME ----------------
  function viewHome() {
    const d = Store.get();
    const tests = d.tests;
    const best = tests.length ? Math.max(...tests.map((t) => t.score)) : null;
    const last = tests.length ? tests[tests.length - 1].score : null;
    const today = d.daily[new Date().toISOString().slice(0, 10)] || 0;
    const weak = weakCats(3);
    const totalAnswered = Object.values(d.stats).reduce((s, v) => s + v.n, 0);
    let next;
    if (totalAnswered < 20) next = { t: 'Start by reading the test strategy, then try a topic.', href: '#/learn/strategy', b: 'Read strategy' };
    else if (!tests.length) next = { t: 'You’ve warmed up. Take a full timed test to get a baseline score.', href: '#/test', b: 'Take a full test' };
    else next = { t: `Work on your weakest topic: <b>${catName(weak[0].id)}</b>.`, href: `#/practice/${weak[0].id}`, b: 'Practice it' };

    setView(`
      <section class="hero">
        <h1>Wonderlic Practice</h1>
        <p class="sub">50 questions · 12 minutes · about <b>14 seconds</b> per question</p>
        <div class="stat-row">
          <div class="stat"><div class="v">${d.settings.target}</div><div class="l">Target score</div></div>
          <div class="stat"><div class="v">${best ?? '—'}</div><div class="l">Best test</div></div>
          <div class="stat"><div class="v">${last ?? '—'}</div><div class="l">Last test</div></div>
          <div class="stat"><div class="v">${today}</div><div class="l">Answered today</div></div>
        </div>
      </section>
      <section class="next card"><div>${next.t}</div><a class="btn primary" href="${next.href}">${next.b}</a></section>
      <section class="modes">
        <a class="mode card" href="#/learn"><div class="mi">📚</div><h3>Learn</h3><p>Plain-English lessons and worked examples for every question type.</p></a>
        <a class="mode card" href="#/practice"><div class="mi">🎯</div><h3>Practice</h3><p>No time pressure. Instant feedback and an explanation after every question.</p></a>
        <a class="mode card" href="#/drill"><div class="mi">⚡</div><h3>Speed Drill</h3><p>Beat the 14-second clock or sprint for 3 minutes to build speed.</p></a>
        <a class="mode card" href="#/test"><div class="mi">⏱️</div><h3>Full Test</h3><p>50 questions, 12 minutes, harder as you go — just like the real thing.</p></a>
        <a class="mode card" href="#/review"><div class="mi">🔁</div><h3>Review Mistakes</h3><p>${d.missed.length} question${d.missed.length === 1 ? '' : 's'} you missed, ready to retry.</p></a>
        <a class="mode card" href="#/stats"><div class="mi">📈</div><h3>Progress</h3><p>Scores over time, accuracy and speed by topic.</p></a>
      </section>
      <section>
        <h2>Focus areas</h2>
        <div class="weak">${weak
          .map((w) => `<a class="card weak-item" href="#/practice/${w.id}"><span>${CAT[w.id].icon} ${catName(w.id)}</span><span class="muted">${w.n ? `${pct(w.acc)} correct · ${w.sec.toFixed(1)}s avg` : 'Not practiced yet'}</span></a>`)
          .join('')}</div>
      </section>`);
  }

  // ---------------- LEARN ----------------
  function viewLearnList() {
    const L = window.LESSONS || {};
    const st = Store.get().stats;
    const groups = ['Verbal', 'Reasoning', 'Math'];
    setView(`
      <h1>Learn</h1>
      <p class="sub">Read a lesson, then practice that topic untimed. Once you’re getting most right, switch to Speed Drills.</p>
      <a class="card lesson-card strategy" href="#/learn/strategy"><div class="mi">🧭</div><div><h3>${L.strategy ? L.strategy.title : 'Test-day strategy'}</h3><p>Pacing, guessing, and a study plan. Start here.</p></div></a>
      ${groups
        .map(
          (g) => `<h2>${g}</h2><div class="grid">${CATS.filter((c) => c.group === g)
            .map((c) => {
              const s = st[c.id];
              return `<a class="card lesson-card" href="#/learn/${c.id}"><div class="mi">${c.icon}</div><div><h3>${c.name}</h3><p>${c.blurb}</p>${s ? `<p class="muted small">${pct(s.c / s.n)} correct · ${s.n} answered</p>` : ''}</div></a>`;
            })
            .join('')}</div>`
        )
        .join('')}`);
  }

  function viewLesson(id) {
    const L = (window.LESSONS || {})[id];
    if (!L) return viewLearnList();
    const c = CAT[id];
    setView(`
      <a class="back" href="#/learn">← All lessons</a>
      <h1>${c ? c.icon + ' ' : ''}${L.title}</h1>
      <div class="lesson">${L.intro || ''}
        ${(L.sections || []).map((s) => `<h2>${s.h}</h2>${s.html}`).join('')}
        ${
          L.examples && L.examples.length
            ? `<h2>Worked examples</h2>${L.examples
                .map(
                  (ex, i) => `<div class="card example">
                <div class="qtext">${ex.q}</div>
                <ol class="ex-choices" type="A">${ex.choices.map((ch, j) => `<li data-j="${j}">${ch}</li>`).join('')}</ol>
                <button class="btn small reveal" data-i="${i}">Show answer</button>
                <div class="how" hidden><p><b>Answer: ${KEYS[ex.answer]}. ${ex.choices[ex.answer]}</b></p>${ex.how}</div>
              </div>`
                )
                .join('')}`
            : ''
        }
      </div>
      ${
        c
          ? `<div class="lesson-cta card"><div>Ready to try it?</div><div class="btns"><a class="btn primary" href="#/practice/${id}">Practice (untimed)</a><a class="btn" href="#/drill/${id}">Speed drill</a></div></div>`
          : `<div class="lesson-cta card"><div>Ready?</div><div class="btns"><a class="btn primary" href="#/learn">Pick a topic</a><a class="btn" href="#/test">Full test</a></div></div>`
      }`);
    $main.querySelectorAll('.reveal').forEach((b) =>
      b.addEventListener('click', () => {
        const card = b.closest('.example');
        card.querySelector('.how').hidden = false;
        const ex = L.examples[+b.dataset.i];
        card.querySelector(`li[data-j="${ex.answer}"]`).classList.add('right');
        b.remove();
      })
    );
  }

  // ---------------- PRACTICE / DRILL SETUP ----------------
  function viewPracticeSetup() {
    const state = { cats: CATS.map((c) => c.id) };
    setView(`
      <h1>Practice</h1>
      <p class="sub">Untimed. You’ll see the answer and an explanation after each question, plus how long you took compared to the 14-second target.</p>
      <div class="card"><h3>Topics</h3>${catChips(state.cats)}</div>
      <div class="card"><h3>Difficulty</h3><div class="seg" id="diff">
        <button class="on" data-d="0">Mixed</button><button data-d="1">Easy</button><button data-d="2">Medium</button><button data-d="3">Hard</button></div></div>
      <button class="btn primary big" id="go">Start practicing</button>`);
    wireChips(state);
    let diff = 0;
    segWire('#diff', (v) => (diff = +v));
    document.getElementById('go').onclick = () => {
      if (!state.cats.length) return alert('Pick at least one topic.');
      runSession({ mode: 'practice', title: 'Practice', cats: state.cats, diff });
    };
  }

  function segWire(sel, fn) {
    const el = $main.querySelector(sel);
    el.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => {
        el.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        fn(b.dataset.d);
      })
    );
  }

  function viewDrillSetup(preset) {
    const state = { cats: preset ? [preset] : CATS.map((c) => c.id) };
    setView(`
      <h1>Speed Drill</h1>
      <p class="sub">The real test gives you about 14 seconds per question. These drills train you to answer fast and move on.</p>
      <div class="card"><h3>Topics</h3>${catChips(state.cats)}</div>
      <div class="card"><h3>Drill type</h3><div class="seg col" id="dtype">
        <button class="on" data-d="pace"><b>Beat the clock</b><span>20 questions, 14 seconds each. Miss the clock and it counts wrong.</span></button>
        <button data-d="sprint"><b>3-minute sprint</b><span>Answer as many as you can in 3 minutes.</span></button>
        <button data-d="half"><b>Mini test</b><span>25 questions in 6 minutes, no feedback until the end.</span></button>
      </div></div>
      <button class="btn primary big" id="go">Start drill</button>`);
    wireChips(state);
    let type = 'pace';
    segWire('#dtype', (v) => (type = v));
    document.getElementById('go').onclick = () => {
      if (!state.cats.length) return alert('Pick at least one topic.');
      if (type === 'half') return startTest({ count: 25, seconds: 6 * 60, cats: state.cats, title: 'Mini test' });
      runSession(
        type === 'pace'
          ? { mode: 'drill', title: 'Beat the clock', cats: state.cats, count: 20, perQ: 14 }
          : { mode: 'drill', title: '3-minute sprint', cats: state.cats, total: 180 }
      );
    };
  }

  // ---------------- SESSION RUNNER (practice, drills, review) ----------------
  function runSession(cfg) {
    clearTimers();
    const used = new Set();
    const s = { i: 0, results: [], start: Date.now(), done: false };
    const reviewQueue = cfg.review ? shuffle(Store.get().missed) : null;
    let cur, qStart, answered;

    function nextQ() {
      if (reviewQueue) return reviewQueue.length ? Object.assign({}, reviewQueue.shift()) : null;
      const cat = cfg.cats.length === 1 ? cfg.cats[0] : weightedCat(cfg.cats);
      return getQuestion(cat, cfg.diff || 0, used);
    }

    function header() {
      const correct = s.results.filter((r) => r.ok).length;
      return `<div class="runbar">
        <div><b>${cfg.title}</b> <span class="muted">${cfg.count ? `${Math.min(s.i + 1, cfg.count)} / ${cfg.count}` : reviewQueue ? `${reviewQueue.length + 1} left` : `#${s.i + 1}`}</span></div>
        <div class="score">✓ ${correct} / ${s.results.length}</div>
        <div class="clock" id="clock"></div>
        <button class="btn small" id="end">End</button>
      </div>
      <div class="pace"><div id="paceFill"></div></div>`;
    }

    function show() {
      if (s.done) return;
      if (cfg.count && s.i >= cfg.count) return finish();
      cur = nextQ();
      if (!cur) return finish();
      answered = false;
      qStart = Date.now();
      setView(header() + questionHTML(cur, { label: cfg.mode === 'practice' ? 'Take your time' : '' }) + `<div class="actions"><button class="btn primary" id="next" hidden>Next →</button></div>`);
      $main.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.i)));
      document.getElementById('end').onclick = finish;
      document.getElementById('next').onclick = advance;
      keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (answered) {
            e.preventDefault();
            advance();
          }
          return;
        }
        const i = keyIndex(e, cur.c.length);
        if (i >= 0 && !answered) answer(i);
      };
      tick();
    }

    function tick() {
      const now = Date.now();
      const clock = document.getElementById('clock');
      const fill = document.getElementById('paceFill');
      if (!clock) return;
      const qSec = (now - qStart) / 1000;
      if (cfg.total) {
        const left = cfg.total - (now - s.start) / 1000;
        clock.textContent = fmtClock(left);
        clock.classList.toggle('warn', left < 30);
        if (left <= 0) return finish();
      } else if (cfg.perQ && !answered) {
        const left = cfg.perQ - qSec;
        clock.textContent = fmtClock(left);
        clock.classList.toggle('warn', left < 5);
        if (left <= 0) return answer(-1);
      } else if (!answered) {
        clock.textContent = qSec.toFixed(0) + 's';
      }
      if (!answered && fill) {
        const frac = Math.min(1, qSec / (cfg.perQ || TARGET_SEC));
        fill.style.width = frac * 100 + '%';
        fill.className = frac < 0.6 ? 'ok' : frac < 1 ? 'mid' : 'over';
      }
    }
    timers.push(setInterval(tick, 200));

    function answer(i) {
      if (answered) return;
      answered = true;
      const ms = Date.now() - qStart;
      const ok = i === cur.a;
      s.results.push({ q: cur, pick: i, ok, ms });
      Store.record(cur, ok, ms, cfg.mode);
      $main.querySelectorAll('.choice').forEach((b, j) => {
        b.disabled = true;
        if (j === cur.a) b.classList.add('right');
        else if (j === i) b.classList.add('wrong');
      });
      const sec = ms / 1000;
      const fb = $main.querySelector('.feedback');
      fb.hidden = false;
      fb.className = 'feedback ' + (ok ? 'good' : 'bad');
      fb.innerHTML = `<div class="fb-head">${ok ? '✓ Correct' : i === -1 ? '⏰ Time’s up' : '✗ Not quite'} <span class="time ${sec <= TARGET_SEC ? 'fast' : 'slow'}">${sec.toFixed(1)}s ${sec <= TARGET_SEC ? '— on pace' : '— aim for under 14s'}</span></div>
        ${ok ? '' : `<div>Correct answer: <b>${KEYS[cur.a]}. ${cur.c[cur.a]}</b></div>`}
        <div class="explain">${cur.e || ''}</div>`;
      document.getElementById('next').hidden = false;
      if (ok && cfg.mode === 'drill') {
        const at = s.i;
        timers.push(setTimeout(() => s.i === at && advance(), 700));
      }
    }

    function advance() {
      if (s.done) return;
      s.i++;
      show();
    }

    function finish() {
      if (s.done) return;
      s.done = true;
      clearTimers();
      showSummary(cfg, s.results, () => runSession(cfg));
    }

    show();
  }

  function showSummary(cfg, results, again) {
    const n = results.length;
    const ok = results.filter((r) => r.ok).length;
    const avg = n ? results.reduce((a, r) => a + r.ms, 0) / n / 1000 : 0;
    const fast = results.filter((r) => r.ms / 1000 <= TARGET_SEC).length;
    setView(`
      <h1>${cfg.title} — done</h1>
      <div class="stat-row">
        <div class="stat"><div class="v">${ok}/${n}</div><div class="l">Correct</div></div>
        <div class="stat"><div class="v">${pct(n ? ok / n : null)}</div><div class="l">Accuracy</div></div>
        <div class="stat"><div class="v">${avg.toFixed(1)}s</div><div class="l">Avg per question</div></div>
        <div class="stat"><div class="v">${fast}/${n}</div><div class="l">Under 14s</div></div>
      </div>
      <div class="btns center"><button class="btn primary" id="again">Go again</button><a class="btn" href="#/">Home</a></div>
      ${reviewList(results.map((r) => ({ q: r.q, pick: r.pick, ok: r.ok, ms: r.ms })))}`);
    document.getElementById('again').onclick = again;
    wireReviewFilter();
  }

  function reviewList(items) {
    if (!items.length) return '';
    return `<div class="review-head"><h2>Review</h2><label><input type="checkbox" id="onlyMissed" checked> Only show missed</label></div>
      <div class="review">${items
        .map(
          (r, idx) => `<div class="card rv ${r.ok ? 'ok' : 'miss'}">
          <div class="qmeta"><span>#${idx + 1} ${r.ok ? '✓' : r.pick === null || r.pick === undefined || r.pick < 0 ? '— skipped' : '✗'}</span><span>${catName(r.q.cat)}${r.ms ? ` · ${(r.ms / 1000).toFixed(1)}s` : ''}</span></div>
          <div class="qtext">${r.q.q}</div>
          <ol class="ex-choices" type="A">${r.q.c.map((c, j) => `<li class="${j === r.q.a ? 'right' : j === r.pick ? 'wrong' : ''}">${c}</li>`).join('')}</ol>
          <div class="explain">${r.q.e || ''}</div>
        </div>`
        )
        .join('')}</div>`;
  }
  function wireReviewFilter() {
    const cb = document.getElementById('onlyMissed');
    if (!cb) return;
    const apply = () => $main.querySelector('.review').classList.toggle('only-missed', cb.checked);
    cb.onchange = apply;
    apply();
  }

  // ---------------- FULL TEST ----------------
  function viewTestIntro() {
    const tests = Store.get().tests;
    setView(`
      <h1>Full Practice Test</h1>
      <div class="card lesson">
        <ul>
          <li><b>50 questions, 12 minutes.</b> That’s about 14 seconds each — most people don’t finish, and that’s normal.</li>
          <li>Questions get <b>harder as you go</b>. Grab the easy points early.</li>
          <li>Your score is the <b>number you get right</b>. Wrong answers don’t cost extra, so never leave one blank — guess and move on.</li>
          <li>Stuck? Skip it. You can jump back using the question grid.</li>
          <li>No calculator. Use scratch paper if you want.</li>
          <li>Keyboard: press <kbd>A</kbd>–<kbd>E</kbd> (or <kbd>1</kbd>–<kbd>5</kbd>) to answer, <kbd>←</kbd>/<kbd>→</kbd> to move.</li>
        </ul>
      </div>
      <button class="btn primary big" id="go">Start the 12-minute test</button>
      ${tests.length ? `<p class="muted center">You’ve taken ${tests.length} test${tests.length > 1 ? 's' : ''}. Best: ${Math.max(...tests.map((t) => t.score))}.</p>` : ''}`);
    document.getElementById('go').onclick = () => startTest({ count: TEST_Q, seconds: TEST_SEC, title: 'Full test', full: true });
  }

  function startTest(cfg) {
    clearTimers();
    let qs;
    if (cfg.full) qs = buildTest();
    else {
      const used = new Set();
      qs = Array.from({ length: cfg.count }, (_, i) => getQuestion(weightedCat(cfg.cats), i < cfg.count * 0.3 ? 1 : i < cfg.count * 0.7 ? 2 : 3, used));
    }
    const t = { qs, picks: Array(qs.length).fill(null), ms: Array(qs.length).fill(0), i: 0, start: Date.now(), shownAt: Date.now(), done: false };

    function render() {
      const q = qs[t.i];
      t.shownAt = Date.now();
      const answeredCount = t.picks.filter((p) => p !== null).length;
      setView(`
        <div class="runbar test">
          <div><b>Question ${t.i + 1}</b> <span class="muted">of ${qs.length}</span></div>
          <div class="muted">${answeredCount} answered</div>
          <div class="clock big" id="clock"></div>
          <button class="btn small" id="finish">Finish</button>
        </div>
        ${questionHTML(q)}
        <div class="actions spread">
          <button class="btn" id="prev" ${t.i === 0 ? 'disabled' : ''}>← Back</button>
          <button class="btn primary" id="nextq">${t.i === qs.length - 1 ? 'Finish' : t.picks[t.i] === null ? 'Skip →' : 'Next →'}</button>
        </div>
        <div class="grid-nav">${qs
          .map((_, j) => `<button class="gn ${t.picks[j] !== null ? 'done' : ''} ${j === t.i ? 'cur' : ''}" data-j="${j}">${j + 1}</button>`)
          .join('')}</div>`);
      if (t.picks[t.i] !== null) $main.querySelector(`.choice[data-i="${t.picks[t.i]}"]`).classList.add('picked');
      $main.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => choose(+b.dataset.i)));
      $main.querySelectorAll('.gn').forEach((b) => b.addEventListener('click', () => go(+b.dataset.j)));
      document.getElementById('prev').onclick = () => go(t.i - 1);
      document.getElementById('nextq').onclick = () => (t.i === qs.length - 1 ? confirmFinish() : go(t.i + 1));
      document.getElementById('finish').onclick = confirmFinish;
      keyHandler = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter') return t.i < qs.length - 1 ? go(t.i + 1) : null;
        if (e.key === 'ArrowLeft') return go(t.i - 1);
        const i = keyIndex(e, q.c.length);
        if (i >= 0) choose(i);
      };
      tick();
    }

    function leave() {
      t.ms[t.i] += Date.now() - t.shownAt;
    }
    function go(j) {
      if (j < 0 || j >= qs.length || t.done) return;
      leave();
      t.i = j;
      render();
    }
    function choose(i) {
      if (t.done) return;
      t.picks[t.i] = i;
      $main.querySelectorAll('.choice').forEach((b) => b.classList.toggle('picked', +b.dataset.i === i));
      // Auto-advance to the next unanswered question to save time.
      const j = t.i;
      setTimeout(() => {
        if (t.done || t.i !== j) return;
        let k = t.picks.findIndex((p, idx) => p === null && idx > j);
        if (k < 0) k = t.picks.findIndex((p) => p === null);
        if (k >= 0) go(k);
        else render();
      }, 220);
    }
    function confirmFinish() {
      const left = t.picks.filter((p) => p === null).length;
      if (left && !confirm(`You have ${left} unanswered question${left > 1 ? 's' : ''}. Blank answers count as wrong — guessing is free. Finish anyway?`)) return;
      finish();
    }
    function tick() {
      const left = cfg.seconds - (Date.now() - t.start) / 1000;
      const el = document.getElementById('clock');
      if (el) {
        el.textContent = fmtClock(left);
        el.classList.toggle('warn', left < 60);
      }
      if (left <= 0) finish(true);
    }
    timers.push(setInterval(tick, 250));

    function finish(timeUp) {
      if (t.done) return;
      leave();
      t.done = true;
      clearTimers();
      const results = qs.map((q, j) => ({ q, pick: t.picks[j], ok: t.picks[j] === q.a, ms: t.ms[j] }));
      results.forEach((r) => {
        if (r.pick !== null) Store.record(r.q, r.ok, r.ms, 'test');
      });
      const score = results.filter((r) => r.ok).length;
      const used = Math.min(cfg.seconds, Math.round((Date.now() - t.start) / 1000));
      const perCat = {};
      results.forEach((r) => {
        const pc = (perCat[r.q.cat] = perCat[r.q.cat] || { n: 0, c: 0 });
        pc.n++;
        if (r.ok) pc.c++;
      });
      if (cfg.full) {
        const d = Store.get();
        d.tests.push({ date: new Date().toISOString(), score, answered: results.filter((r) => r.pick !== null).length, used, perCat });
        Store.save();
      }
      showTestResults(cfg, results, score, used, perCat, timeUp);
    }

    render();
  }

  function showTestResults(cfg, results, score, used, perCat, timeUp) {
    const target = Store.get().settings.target;
    const total = results.length;
    const answered = results.filter((r) => r.pick !== null).length;
    const scaled = cfg.full ? score : Math.round((score / total) * 50);
    const hit = scaled >= target;
    setView(`
      <h1>${cfg.title} results</h1>
      ${timeUp ? '<p class="banner">⏰ Time’s up!</p>' : ''}
      <div class="score-hero ${hit ? 'hit' : ''}">
        <div class="big-score">${score}<span>/${total}</span></div>
        <div>${cfg.full ? '' : `≈ ${scaled} on a 50-question test · `}Target ${target} — ${hit ? '🎉 you hit it!' : `${target - scaled} more to go`}</div>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="v">${answered}/${total}</div><div class="l">Answered</div></div>
        <div class="stat"><div class="v">${pct(answered ? score / answered : null)}</div><div class="l">Accuracy on answered</div></div>
        <div class="stat"><div class="v">${fmtClock(used)}</div><div class="l">Time used</div></div>
        <div class="stat"><div class="v">${answered ? (used / answered).toFixed(1) : '—'}s</div><div class="l">Per answered question</div></div>
      </div>
      <div class="card"><h3>By topic</h3>${Object.entries(perCat)
        .sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n)
        .map(([c, v]) => `<div class="bar-row"><span>${CAT[c].icon} ${catName(c)}</span><div class="bar"><div style="width:${(v.c / v.n) * 100}%"></div></div><span class="muted">${v.c}/${v.n}</span></div>`)
        .join('')}</div>
      <p class="muted">${answered < total ? `Tip: you left ${total - answered} blank. On the real test always guess before time runs out — a guess has a 1-in-4 or 1-in-5 chance.` : ''}</p>
      <div class="btns center"><a class="btn primary" href="#/review">Review mistakes</a><a class="btn" href="#/stats">Progress</a><a class="btn" href="#/">Home</a></div>
      ${reviewList(results)}`);
    wireReviewFilter();
  }

  // ---------------- REVIEW MISTAKES ----------------
  function viewReview() {
    const missed = Store.get().missed;
    if (!missed.length) {
      return setView(`<h1>Review Mistakes</h1><div class="card"><p>Nothing to review — questions you miss anywhere in the app show up here.</p><a class="btn primary" href="#/practice">Go practice</a></div>`);
    }
    const counts = {};
    missed.forEach((m) => (counts[m.cat] = (counts[m.cat] || 0) + 1));
    setView(`<h1>Review Mistakes</h1>
      <p class="sub">${missed.length} missed question${missed.length > 1 ? 's' : ''}. Get one right and it leaves the list.</p>
      <div class="card">${Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([c, n]) => `<div class="bar-row"><span>${CAT[c].icon} ${catName(c)}</span><span class="muted">${n}</span></div>`)
        .join('')}</div>
      <button class="btn primary big" id="go">Retry them</button>`);
    document.getElementById('go').onclick = () => runSession({ mode: 'review', title: 'Review', cats: [], review: true });
  }

  // ---------------- STATS ----------------
  function viewStats() {
    const d = Store.get();
    const target = d.settings.target;
    const tests = d.tests.slice(-20);
    const chart = tests.length
      ? `<div class="chart">${tests
          .map((t) => `<div class="col" title="${new Date(t.date).toLocaleDateString()}: ${t.score}"><div class="colbar ${t.score >= target ? 'hit' : ''}" style="height:${(t.score / 50) * 100}%"><span>${t.score}</span></div></div>`)
          .join('')}<div class="target-line" style="bottom:${(target / 50) * 100}%"><span>Target ${target}</span></div></div>`
      : '<p class="muted">No full tests yet.</p>';
    const rows = CATS.map((c) => {
      const s = d.stats[c.id];
      const acc = s && s.n ? s.c / s.n : null;
      const sec = s && s.n ? s.ms / s.n / 1000 : null;
      return `<tr><td>${c.icon} ${c.name}</td><td>${s ? s.n : 0}</td>
        <td><div class="bar sm"><div style="width:${(acc || 0) * 100}%" class="${acc === null ? '' : acc >= 0.8 ? 'good' : acc >= 0.6 ? 'mid' : 'low'}"></div></div> ${pct(acc)}</td>
        <td class="${sec === null ? '' : sec <= TARGET_SEC ? 'fast' : 'slow'}">${sec === null ? '—' : sec.toFixed(1) + 's'}</td>
        <td><a href="#/practice/${c.id}">Practice</a></td></tr>`;
    }).join('');
    setView(`
      <h1>Progress</h1>
      <div class="card"><h3>Full test scores</h3>${chart}</div>
      <div class="card"><h3>By topic</h3>
        <div class="table-wrap"><table class="stats"><thead><tr><th>Topic</th><th>Answered</th><th>Accuracy</th><th>Avg time</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="muted small">Avg time is green when you’re under the 14-second pace.</p>
      </div>
      <div class="card"><h3>Settings</h3>
        <label class="setting">Target score (check your program’s requirement): <input type="number" id="target" min="1" max="50" value="${target}"></label>
        <div class="btns"><button class="btn danger" id="reset">Reset all progress</button></div>
      </div>`);
    document.getElementById('target').onchange = (e) => {
      const v = Math.max(1, Math.min(50, +e.target.value || 22));
      d.settings.target = v;
      Store.save();
      viewStats();
    };
    document.getElementById('reset').onclick = () => {
      if (!confirm('Erase all scores, stats, and mistakes? This can’t be undone.')) return;
      Store.data = null;
      try {
        localStorage.removeItem('wonderlic-practice');
      } catch (e) {}
      viewStats();
    };
  }

  // ---------------- router ----------------
  function route() {
    clearTimers();
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    const [page, arg] = parts;
    document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#/' + (page || '')));
    if (page === 'learn') return arg ? viewLesson(arg) : viewLearnList();
    if (page === 'practice') return arg && CAT[arg] ? runSession({ mode: 'practice', title: 'Practice · ' + catName(arg), cats: [arg], diff: 0 }) : viewPracticeSetup();
    if (page === 'drill') return viewDrillSetup(CAT[arg] ? arg : null);
    if (page === 'test') return viewTestIntro();
    if (page === 'review') return viewReview();
    if (page === 'stats') return viewStats();
    viewHome();
  }
  document.addEventListener('keydown', (e) => {
    if (keyHandler && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA/.test(e.target.tagName)) keyHandler(e);
  });
  window.addEventListener('hashchange', route);
  route();
})();
