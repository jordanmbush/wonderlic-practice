/* Teaching content for each question category.
   Plain browser script: defines window.LESSONS. */
window.LESSONS = {
  /* ------------------------------------------------------------------ */
  strategy: {
    title: 'Test-day strategy',
    intro: `<p>The Wonderlic SLE gives you <b>50 questions in 12 minutes</b>. That’s about <b>14 seconds per question</b>. Almost nobody finishes, and that’s normal. Your score is simply the number you get right, so the goal is to collect as many easy points as you can, as fast as you can.</p>`,
    sections: [
      {
        h: 'Pacing',
        html: `<ul>
<li>Aim for roughly <b>4 questions per minute</b>. At the 6-minute mark, try to be around question 20–25.</li>
<li>Questions get <b>harder as you go</b>. The early ones are quick points — move through them briskly but carefully.</li>
<li>If a question isn’t clicking after about 20 seconds, <b>guess, flag it, and move on</b>. One stubborn question can cost you three easy ones.</li>
<li>Glance at the clock a few times, not constantly. Checking the clock every question wastes time.</li>
</ul>`,
      },
      {
        h: 'Never leave a blank',
        html: `<ul>
<li>There is <b>no penalty for wrong answers</b>. A blank is always worth zero; a guess might be worth a point.</li>
<li>Skip-and-return: if a question looks long (a big word problem, a table of names), skip it and come back if you have time.</li>
<li>In the last 30 seconds, <b>fill in an answer for every question left</b> — even without reading them.</li>
<li>When guessing, first cross out anything clearly wrong. Knocking out even one or two choices raises your odds a lot.</li>
</ul>`,
      },
      {
        h: 'Work smarter, not harder',
        html: `<ul>
<li><b>Read the answer choices first</b> on math questions. They tell you how exact you need to be. If the choices are 12, 45, and 300, a rough estimate is enough.</li>
<li><b>Estimate and eliminate.</b> Round the numbers, find the ballpark, and pick the choice that fits. Skip the long division if you can.</li>
<li>Watch for <b>trap answers</b> — the number you get if you stop one step early (like the discount amount instead of the sale price).</li>
<li>Read the question’s last line carefully: “which is <i>smallest</i>,” “which does <i>not</i> belong,” “how many are <i>the same</i>.”</li>
<li>No calculator is allowed, so practice doing math on scratch paper — or in your head — here too.</li>
</ul>`,
      },
      {
        h: 'Stay calm',
        html: `<ul>
<li>You are not supposed to finish. Seeing unanswered questions near the end is expected, not a sign you’re failing.</li>
<li>If you feel rushed or stuck, take one slow breath and go to the next question. A fresh question resets your focus.</li>
<li>Don’t go back and second-guess answers you already chose unless you spot a clear mistake.</li>
</ul>`,
      },
      {
        h: 'What’s a good score?',
        html: `<p>On the Wonderlic personnel test, the <b>average score is about 20–21</b> out of 50. Scoring in the mid-20s or higher puts you above average.</p>
<p>Every school sets its own cutoff, and they change. <b>Check your own program’s required score</b> with the admissions office or on its website, and aim a few points above it to give yourself a cushion.</p>`,
      },
      {
        h: 'How to use this app',
        html: `<ol>
<li><b>Learn a topic.</b> Read the lesson for one question type and work through its examples.</li>
<li><b>Untimed practice.</b> Do practice questions in that topic with no clock. Focus on getting them right and understanding the method.</li>
<li><b>Speed drills.</b> Once you’re accurate, practice the same topic with a timer to build speed.</li>
<li><b>Full timed tests.</b> Take full 50-question, 12-minute tests to practice pacing and guessing.</li>
<li><b>Review every mistake.</b> After each session, look at what you missed and why. Go back to that topic’s lesson if the same kind of mistake keeps showing up.</li>
</ol>
<p>A little every day (15–20 minutes) beats one long cram session.</p>`,
      },
    ],
    examples: [],
  },

  /* ------------------------------------------------------------------ */
  vocab: {
    title: 'Vocabulary',
    intro: `<p>These questions test word meanings. You may be asked for a word that means the <b>same</b> (synonym) or the <b>opposite</b> (antonym), whether two words are <b>similar, contradictory, or neither</b>, or which word best <b>completes a sentence</b>.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li>Before you look at the choices, <b>think of your own quick definition</b> of the word (“candid = honest, open”).</li>
<li>Check the question: does it want the <b>same</b> or the <b>opposite</b>? Circle that word in your mind.</li>
<li>Pick the choice that matches your definition. Cross out choices that are just related to the topic but don’t mean the same thing.</li>
<li>For sentence completion, read the whole sentence and look for <b>clue words</b>: “because” and “so” point the same direction; “but,” “although,” and “however” signal a contrast.</li>
</ol>`,
      },
      {
        h: 'Speed tricks',
        html: `<ul>
<li><b>Similar / contradictory / neither:</b> ask “could I swap one word for the other in a sentence?” If yes → similar. If they’re opposites → contradictory. If they’re just unrelated → neither.</li>
<li>If you don’t know the word, use <b>word parts</b>: <i>un-, in-, dis-, non-</i> often mean “not”; <i>pre-</i> means “before”; <i>-less</i> means “without.”</li>
<li>Decide if the word feels <b>positive or negative</b>. Even that can knock out half the choices.</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Look-alike words:</b> ADOPT (take as your own) vs. ADEPT (skilled); AFFECT vs. EFFECT; ACCEPT vs. EXCEPT; COMPLEMENT (goes with) vs. COMPLIMENT (praise). Read every letter.</li>
<li><b>Answering the wrong direction:</b> choosing the synonym when the question asked for the opposite. The test often includes both as choices.</li>
<li><b>“Related” isn’t “same”:</b> DOCTOR and HOSPITAL go together, but they don’t mean the same thing.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'Which word means the <b>opposite</b> of <b>ABUNDANT</b>?',
        choices: ['Plentiful', 'Scarce', 'Large', 'Rich', 'Ample'],
        answer: 1,
        how: `<p>Abundant = “a lot of something.” The opposite is “very little.”</p><p>Plentiful and ample mean the <i>same</i> as abundant (trap!). Large and rich are unrelated. <b>Scarce</b> = hard to find, very little. Answer: <b>Scarce</b>.</p>`,
      },
      {
        q: 'Which word means the <b>same</b> as <b>CANDID</b>?',
        choices: ['Hidden', 'Frank', 'Careful', 'Sweet', 'Quick'],
        answer: 1,
        how: `<p>Candid = honest and open (think “candid photo” — natural, not posed).</p><p>Hidden is nearly the opposite. <b>Frank</b> means honest and direct. Answer: <b>Frank</b>.</p>`,
      },
      {
        q: 'Are these two words similar, contradictory, or neither?<br><b>ADOPT — ADEPT</b>',
        choices: ['Similar', 'Contradictory', 'Neither'],
        answer: 2,
        how: `<p>These look alike, but read every letter.</p><ul><li>ADOPT = to take something (or someone) as your own.</li><li>ADEPT = skilled.</li></ul><p>They don’t mean the same thing, and they aren’t opposites. Answer: <b>Neither</b>.</p>`,
      },
      {
        q: 'Choose the word that best completes the sentence:<br>“Because the patient was ______ about the procedure, the hygienist explained each step slowly.”',
        choices: ['bored', 'certain', 'anxious', 'eager', 'proud'],
        answer: 2,
        how: `<p>The clue word is <b>because</b> — the blank explains <i>why</i> the hygienist went slowly.</p><p>You slow down for someone who is nervous. Bored, certain, eager, and proud don’t call for extra care. Answer: <b>anxious</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  analogy: {
    title: 'Analogies',
    intro: `<p>Analogies ask you to spot a relationship and repeat it: “HAND is to GLOVE as FOOT is to ___,” or “which pair has the same relationship as DENTIST : TOOTH?” Some use numbers (3 : 9 :: 4 : ?) or letters (ABC : DEF).</p>`,
    sections: [
      {
        h: 'How to attack it: make a bridge sentence',
        html: `<ol>
<li>Make a short sentence that links the first pair: “A glove <b>is worn on</b> a hand.”</li>
<li>Plug the second pair into the same sentence: “A ___ <b>is worn on</b> a foot.” → shoe.</li>
<li>If more than one choice fits, make your sentence <b>more specific</b> and try again.</li>
</ol>
<p>Common bridges: <i>is a type of</i>, <i>is part of</i>, <i>is used to</i>, <i>works with</i>, <i>is the opposite of</i>, <i>is a bigger version of</i>, <i>is made of</i>.</p>`,
      },
      {
        h: 'Number and letter analogies',
        html: `<ul>
<li><b>Numbers:</b> find the rule that turns the first number into the second. 3 → 9 could be “×3,” “+6,” or “squared.” <b>Test each rule against the answer choices</b> — usually only one rule gives an answer that’s listed.</li>
<li><b>Letters:</b> count how far each letter moves. ABC → DEF moves every letter forward 3. Apply the same move to the next group.</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Order matters.</b> DENTIST : TOOTH is not the same as TOOTH : DENTIST. Keep the pairs facing the same direction.</li>
<li><b>Same topic ≠ same relationship.</b> A choice that sounds dental (like “Nurse : Hospital”) isn’t right just because it’s about health care.</li>
<li>Don’t lock onto the first rule you see for numbers — check it against the choices.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'HAND is to GLOVE as FOOT is to ______.',
        choices: ['Toe', 'Leg', 'Shoe', 'Walk', 'Knee'],
        answer: 2,
        how: `<p>Bridge sentence: “A glove <b>is worn on</b> a hand.”</p><p>Now: “A ___ is worn on a foot.” Toe, leg, and knee are body parts; walk is an action. Answer: <b>Shoe</b>.</p>`,
      },
      {
        q: 'Which pair has the same relationship as <b>DENTIST : TOOTH</b>?',
        choices: ['Teacher : School', 'Baker : Oven', 'Barber : Hair', 'Driver : Road', 'Pilot : Sky'],
        answer: 2,
        how: `<p>Bridge: “A dentist <b>takes care of</b> teeth.”</p><ul><li>A teacher works <i>at</i> a school — a place, not what they care for.</li><li>A baker <i>uses</i> an oven — a tool.</li><li>A barber takes care of hair ✔</li></ul><p>Answer: <b>Barber : Hair</b>.</p>`,
      },
      {
        q: '3 : 9 :: 4 : ?',
        choices: ['8', '16', '20', '24', '64'],
        answer: 1,
        how: `<p>Rules that turn 3 into 9: ×3, +6, or squared (3 × 3).</p><ul><li>×3 → 4 × 3 = 12 (not a choice)</li><li>+6 → 4 + 6 = 10 (not a choice)</li><li>Squared → 4 × 4 = 16 ✔</li></ul><p>Answer: <b>16</b>. Letting the choices pick the rule saves time.</p>`,
      },
      {
        q: 'ABC is to DEF as JKL is to ______.',
        choices: ['MNO', 'KLM', 'NOP', 'LMN', 'JKM'],
        answer: 0,
        how: `<p>A → D is 3 letters forward (B, C, <b>D</b>). Same for B → E and C → F.</p><p>Move J, K, L forward 3: J → M, K → N, L → O. Answer: <b>MNO</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  meaning: {
    title: 'Sayings & meaning',
    intro: `<p>You’ll see two proverbs or sentences and decide if they mean <b>similar</b> things, <b>contradict</b> each other, or <b>neither</b> (they’re about different things). You may also pick which saying matches another, or what a saying means.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li><b>Translate each saying into plain advice</b> in a few words. “Look before you leap” → “be careful before acting.”</li>
<li>Compare the two plain versions:
<ul><li>Same advice → <b>similar</b>.</li><li>Opposite advice on the <i>same topic</i> → <b>contradictory</b>.</li><li>Different topics → <b>neither</b>.</li></ul></li>
<li>For “which saying matches,” translate the given one, then find the choice with the same plain meaning.</li>
</ol>`,
      },
      {
        h: 'Speed tricks',
        html: `<ul>
<li>Ignore the picture words (birds, cooks, stones) and focus on the <b>lesson</b>. The test deliberately uses different images for the same idea.</li>
<li>Ask: “Would these two give the <b>same advice</b> to someone making a decision?”</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Shared words don’t mean shared meaning.</b> Two sayings about birds can be about totally different things.</li>
<li><b>Contradictory needs the same topic.</b> If one is about money and the other about honesty, that’s <b>neither</b>, not contradictory.</li>
<li>Known opposite pairs: “Look before you leap” vs. “He who hesitates is lost”; “Too many cooks spoil the broth” vs. “Many hands make light work”; “Absence makes the heart grow fonder” vs. “Out of sight, out of mind.”</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: '“The early bird catches the worm.”<br>“First come, first served.”<br>These two sayings are:',
        choices: ['Similar', 'Contradictory', 'Neither'],
        answer: 0,
        how: `<p>Plain versions: “Being early gets you the reward” and “Whoever arrives first gets helped first.”</p><p>Same idea. Answer: <b>Similar</b>.</p>`,
      },
      {
        q: '“Look before you leap.”<br>“He who hesitates is lost.”<br>These two sayings are:',
        choices: ['Similar', 'Contradictory', 'Neither'],
        answer: 1,
        how: `<p>Plain versions: “Think carefully before acting” vs. “If you wait too long, you’ll miss out.”</p><p>Same topic (whether to act quickly), opposite advice. Answer: <b>Contradictory</b>.</p>`,
      },
      {
        q: '“A penny saved is a penny earned.”<br>“Honesty is the best policy.”<br>These two sayings are:',
        choices: ['Similar', 'Contradictory', 'Neither'],
        answer: 2,
        how: `<p>Plain versions: “Saving money is as good as making it” and “Always tell the truth.”</p><p>One is about money, the other about honesty — different topics. Answer: <b>Neither</b>.</p>`,
      },
      {
        q: 'Which saying means most nearly the same as “Don’t count your chickens before they hatch”?',
        choices: ['Strike while the iron is hot.', 'Don’t sell the bear’s skin before you’ve caught the bear.', 'Every cloud has a silver lining.', 'Actions speak louder than words.', 'Birds of a feather flock together.'],
        answer: 1,
        how: `<p>Plain version: “Don’t act as if you have something before you actually have it.”</p><p>Selling a bear’s skin before catching the bear is the same mistake. The others are about acting fast, staying hopeful, doing vs. saying, and similar people sticking together. Answer: <b>the bear’s skin</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  oddone: {
    title: 'Odd one out',
    intro: `<p>You get a list of words or numbers and pick the one that <b>doesn’t belong</b>. Everything else shares a feature that the odd one lacks.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li>Look at the first two or three items and <b>name what they share</b> (“all fruits,” “all even,” “all happy feelings”).</li>
<li>Scan the rest for the one that breaks the pattern.</li>
<li>If two items seem odd, find a <b>tighter rule</b> that includes all but one.</li>
</ol>`,
      },
      {
        h: 'Things to check',
        html: `<ul>
<li><b>Words:</b> category (fruit vs. vegetable), meaning (positive vs. negative), part of speech (action vs. thing), opposites mixed with synonyms.</li>
<li><b>Numbers:</b> odd/even, perfect squares (1, 4, 9, 16, 25, 36…), multiples of a number (3, 6, 9, 12…), prime numbers (2, 3, 5, 7, 11, 13…).</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li>Don’t overthink. The test wants the <b>most obvious</b> difference, not a clever one about spelling or letter count.</li>
<li>Read every choice — the odd one is often near the end.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'Which word does <b>not</b> belong?',
        choices: ['Apple', 'Banana', 'Carrot', 'Grape', 'Pear'],
        answer: 2,
        how: `<p>Apple, banana, grape, and pear are all fruits. A carrot is a vegetable. Answer: <b>Carrot</b>.</p>`,
      },
      {
        q: 'Which does <b>not</b> belong?',
        choices: ['Molar', 'Femur', 'Incisor', 'Canine', 'Premolar'],
        answer: 1,
        how: `<p>Molar, incisor, canine, and premolar are all kinds of teeth. The femur is the thigh bone. Answer: <b>Femur</b>.</p>`,
      },
      {
        q: 'Which number does <b>not</b> belong?<br>4, 9, 16, 20, 25',
        choices: ['4', '9', '16', '20', '25'],
        answer: 3,
        how: `<p>4 = 2×2, 9 = 3×3, 16 = 4×4, 25 = 5×5 — all perfect squares.</p><p>20 isn’t a perfect square. Answer: <b>20</b>.</p>`,
      },
      {
        q: 'Which word does <b>not</b> belong?',
        choices: ['Gloomy', 'Happy', 'Joyful', 'Cheerful', 'Glad'],
        answer: 0,
        how: `<p>Happy, joyful, cheerful, and glad all mean feeling good. Gloomy means sad. Answer: <b>Gloomy</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  logic: {
    title: 'Logic & reasoning',
    intro: `<p>You’ll read a few statements and decide if a conclusion is <b>True</b>, <b>False</b>, or <b>Not certain</b>. Some use made-up words (“All blims are zorps”) so you can’t rely on real-world knowledge. Others compare people (“Ann is taller than Bo…”).</p>`,
    sections: [
      {
        h: 'Circle (Venn) diagrams for “all / some / no”',
        html: `<ul>
<li><b>“All A are B”</b> → draw the A circle <i>inside</i> the B circle.</li>
<li><b>“Some A are B”</b> → two circles that <i>overlap</i> a little.</li>
<li><b>“No A are B”</b> → two circles that <i>don’t touch</i>.</li>
</ul>
<p>Then ask: “<b>Is the conclusion true in every possible drawing?</b>” If yes → True. If it’s impossible → False. If it could go either way → <b>Not certain</b>.</p>`,
      },
      {
        h: 'Ranking lines for comparisons',
        html: `<ol>
<li>Draw a quick vertical line. Put “tallest / fastest / oldest” at the top.</li>
<li>Place each person as you read: “Ann is taller than Bo” → Ann above Bo.</li>
<li>Answer from the line. If two people could be in either order, the answer is <b>Not certain</b>.</li>
</ol>
<p>Example: “Dee is faster than Eli. Fay is faster than Eli.” Both are above Eli, but nothing tells you whether Dee or Fay is higher — so “Dee is faster than Fay” is <b>Not certain</b>.</p>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Backwards “all.”</b> “All A are B. X is a B.” Is X an A? <b>Not certain</b> — X could be a B that isn’t an A. (All dentists are graduates. Sam is a graduate. Sam might be a nurse!)</li>
<li><b>Forwards “all” works.</b> “All A are B. X is an A.” → X is a B: <b>True</b>.</li>
<li><b>“Some” chains don’t connect.</b> “All A are B. Some B are C.” You can’t say anything sure about A and C.</li>
<li><b>Ignore real-world facts.</b> Only use what the statements say.</li>
<li>Pick <b>False</b> only when the conclusion is <i>impossible</i>; if it merely isn’t proven, pick <b>Not certain</b>.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'All blims are zorps. Some zorps are tuns. Therefore some blims are tuns.',
        choices: ['True', 'False', 'Not certain'],
        answer: 2,
        how: `<p>Draw a big ZORP circle with a small BLIM circle inside it. The TUN circle overlaps ZORP somewhere.</p><p>The TUN circle could overlap the BLIM part — or a part of ZORP that has no blims. Both drawings fit the facts. Answer: <b>Not certain</b>.</p>`,
      },
      {
        q: 'All plonks are grims. All grims are fleps. Therefore all plonks are fleps.',
        choices: ['True', 'False', 'Not certain'],
        answer: 0,
        how: `<p>Nested circles: PLONK inside GRIM, GRIM inside FLEP.</p><p>So PLONK is inside FLEP in every drawing. Answer: <b>True</b>.</p>`,
      },
      {
        q: 'Ann is taller than Bo. Bo is taller than Cy. Cy is taller than Ann.',
        choices: ['True', 'False', 'Not certain'],
        answer: 1,
        how: `<p>Ranking line (tallest on top): Ann → Bo → Cy.</p><p>Cy is at the bottom, so Cy can’t be taller than Ann. Answer: <b>False</b>.</p>`,
      },
      {
        q: 'Dee runs faster than Eli. Fay runs faster than Eli. Dee runs faster than Fay.',
        choices: ['True', 'False', 'Not certain'],
        answer: 2,
        how: `<p>Put Eli at the bottom. Dee and Fay both go above Eli.</p><p>Nothing compares Dee and Fay directly, so either could be faster. Answer: <b>Not certain</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  series: {
    title: 'Number series',
    intro: `<p>You’ll see a list of numbers and pick the one that comes next. Each list follows a rule — adding, multiplying, a growing pattern, or two patterns mixed together.</p>`,
    sections: [
      {
        h: 'How to attack it: write the differences underneath',
        html: `<ol>
<li>Write the gap between each pair of numbers below them.<br><code>3 &nbsp; 7 &nbsp; 11 &nbsp; 15</code><br><code>&nbsp;+4 &nbsp;+4 &nbsp;+4</code></li>
<li><b>Gaps all the same</b> → keep adding that amount.</li>
<li><b>Gaps grow steadily</b> (+2, +3, +4…) → the next gap continues the pattern.</li>
<li><b>Numbers grow fast</b> → try multiplying (×2, ×3) instead of adding.</li>
<li><b>Numbers jump up and down</b> → look at every <i>other</i> number (two series mixed together) or at alternating steps (×2, +3, ×2, +3…).</li>
</ol>`,
      },
      {
        h: 'Patterns to recognize on sight',
        html: `<ul>
<li><b>Squares:</b> 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144</li>
<li><b>Cubes:</b> 1, 8, 27, 64, 125</li>
<li><b>Doubling:</b> 1, 2, 4, 8, 16, 32, 64, 128</li>
<li><b>Halving:</b> 64, 32, 16, 8, 4… or 1, ½, ¼, ⅛… or 0.8, 0.4, 0.2, 0.1</li>
<li><b>Add the two before:</b> 1, 1, 2, 3, 5, 8, 13, 21 (each number = the two before it added together)</li>
<li><b>Alternating steps:</b> 1, 2, 5, 10, 13, 26, 29 (×2, +3, ×2, +3…)</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li>Check your rule on <b>every</b> step, not just the first two numbers.</li>
<li>With two mixed series, make sure you continue the <b>right one</b> — count which position the blank is in.</li>
<li>If numbers get smaller, the rule may be subtracting or dividing.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'What number comes next?<br>3, 7, 11, 15, ?',
        choices: ['17', '18', '19', '20', '21'],
        answer: 2,
        how: `<p>Differences: +4, +4, +4. Keep adding 4: 15 + 4 = <b>19</b>.</p>`,
      },
      {
        q: 'What number comes next?<br>2, 6, 18, 54, ?',
        choices: ['108', '162', '72', '216', '150'],
        answer: 1,
        how: `<p>The numbers grow fast, so try multiplying: 2 × 3 = 6, 6 × 3 = 18, 18 × 3 = 54.</p><p>Next: 54 × 3 = <b>162</b>. (Quick math: 50 × 3 = 150, plus 4 × 3 = 12 → 162.)</p>`,
      },
      {
        q: 'What number comes next?<br>1, 3, 6, 10, 15, ?',
        choices: ['21', '20', '25', '18', '30'],
        answer: 0,
        how: `<p>Differences: +2, +3, +4, +5. The gap grows by 1 each time.</p><p>Next gap is +6: 15 + 6 = <b>21</b>.</p>`,
      },
      {
        q: 'What number comes next?<br>2, 10, 4, 20, 6, 30, ?',
        choices: ['36', '40', '8', '10', '7'],
        answer: 2,
        how: `<p>The numbers jump up and down, so look at every other number.</p><ul><li>1st, 3rd, 5th: 2, 4, 6 (adding 2)</li><li>2nd, 4th, 6th: 10, 20, 30 (adding 10)</li></ul><p>The blank is the 7th number, so it continues the first series: 6 + 2 = <b>8</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  letters: {
    title: 'Letter puzzles',
    intro: `<p>These questions use the alphabet: continuing a letter series (A C E G ?), finding a letter by position, cracking a simple code (CAT → DBU), or putting words or letters in alphabetical order.</p>`,
    sections: [
      {
        h: 'Turn letters into numbers',
        html: `<p>Most letter puzzles are really number puzzles. Memorize the anchors <b>E-J-O-T-Y = 5, 10, 15, 20, 25</b>, plus <b>M = 13</b> (the middle), and count from the nearest one.</p>
<table>
<tr><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>I</th><th>J</th><th>K</th><th>L</th><th>M</th></tr>
<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td></tr>
<tr><th>N</th><th>O</th><th>P</th><th>Q</th><th>R</th><th>S</th><th>T</th><th>U</th><th>V</th><th>W</th><th>X</th><th>Y</th><th>Z</th></tr>
<tr><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td></tr>
</table>
<p>Example: R? T is 20, so R is 18.</p>`,
      },
      {
        h: 'How to attack each type',
        html: `<ul>
<li><b>Letter series:</b> write the number under each letter and treat it like a number series. A C E G = 1, 3, 5, 7 → next is 9 = I.</li>
<li><b>Position puzzles</b> (“the letter midway between K and O”): convert to numbers, find the middle (add and halve), then count left or right. Work in small steps and write each one down.</li>
<li><b>Codes:</b> line up the word and its code letter by letter and see how far each letter moved. Apply the same moves to the new word.</li>
<li><b>Alphabetizing words:</b> compare the first letter; if tied, the second; and so on. Jot down the first few letters of each word to sort faster.</li>
<li><b>A word’s letters in order:</b> write the letters out and cross them off as you pick the earliest one. PLANET → A, E, L, N, P, T.</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Left vs. right:</b> “to the right” means later in the alphabet (toward Z); “to the left” means earlier (toward A).</li>
<li><b>Counting the starting letter:</b> “3rd letter to the right of M” is N, O, <b>P</b> — don’t count M itself.</li>
<li><b>Codes don’t always use the same shift</b> for every letter — check each letter, not just the first.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'What letter comes next?<br>A, C, E, G, ?',
        choices: ['H', 'I', 'J', 'K', 'F'],
        answer: 1,
        how: `<p>As numbers: 1, 3, 5, 7 — adding 2 each time.</p><p>Next: 9 = <b>I</b>.</p>`,
      },
      {
        q: 'What is the 3rd letter to the right of the letter midway between K and O?',
        choices: ['N', 'O', 'P', 'Q', 'R'],
        answer: 2,
        how: `<ol><li>K = 11, O = 15. Middle: (11 + 15) ÷ 2 = 13 = <b>M</b>.</li><li>3 letters to the right of M: N (1), O (2), <b>P</b> (3).</li></ol><p>Answer: <b>P</b>.</p>`,
      },
      {
        q: 'In a code, CAT is written as DBU. How is DOG written in the same code?',
        choices: ['EPH', 'CNF', 'DPH', 'EOH', 'FQI'],
        answer: 0,
        how: `<p>Compare letter by letter: C→D, A→B, T→U. Each letter moves forward 1.</p><p>DOG: D→E, O→P, G→H. Answer: <b>EPH</b>.</p>`,
      },
      {
        q: 'If these words were put in alphabetical order, which would be <b>third</b>?<br>Denture, Decay, Dentist, Dental, Debris',
        choices: ['Denture', 'Decay', 'Dentist', 'Dental', 'Debris'],
        answer: 3,
        how: `<p>All start with DE, so look at the 3rd letter: Debris (B), Decay (C), then three words with N.</p><p>Order so far: 1. Debris, 2. Decay. The DENT- words differ at the 5th letter: Dent<b>a</b>l, Dent<b>i</b>st, Dent<b>u</b>re.</p><p>So 3rd is <b>Dental</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  arith: {
    title: 'Arithmetic',
    intro: `<p>Straight math without a calculator: comparing fractions, decimals, and percents; working with fractions; percents; multiplying decimals; order of operations; and square roots. Speed comes from knowing a few facts by heart.</p>`,
    sections: [
      {
        h: 'Cheat sheet: fractions, decimals, percents',
        html: `<table>
<tr><th>Fraction</th><th>Decimal</th><th>Percent</th></tr>
<tr><td>1/2</td><td>0.5</td><td>50%</td></tr>
<tr><td>1/3</td><td>0.333…</td><td>33⅓%</td></tr>
<tr><td>2/3</td><td>0.667</td><td>66⅔%</td></tr>
<tr><td>1/4</td><td>0.25</td><td>25%</td></tr>
<tr><td>3/4</td><td>0.75</td><td>75%</td></tr>
<tr><td>1/5</td><td>0.2</td><td>20%</td></tr>
<tr><td>2/5</td><td>0.4</td><td>40%</td></tr>
<tr><td>1/6</td><td>0.167</td><td>16⅔%</td></tr>
<tr><td>1/8</td><td>0.125</td><td>12.5%</td></tr>
<tr><td>3/8</td><td>0.375</td><td>37.5%</td></tr>
<tr><td>5/8</td><td>0.625</td><td>62.5%</td></tr>
<tr><td>7/8</td><td>0.875</td><td>87.5%</td></tr>
<tr><td>1/10</td><td>0.1</td><td>10%</td></tr>
</table>
<p><b>Squares:</b> 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100, 11²=121, 12²=144, 13²=169, 14²=196, 15²=225. Knowing these makes square roots instant: √169 = 13.</p>`,
      },
      {
        h: 'How to attack each type',
        html: `<ul>
<li><b>Smallest / largest:</b> turn everything into decimals (or percents) and compare. For two fractions, cross-multiply: 3/5 vs 5/8 → 3×8 = 24 vs 5×5 = 25, so 5/8 is bigger.</li>
<li><b>Add / subtract fractions:</b> find a common bottom number. 1/2 + 1/3 = 3/6 + 2/6 = 5/6.</li>
<li><b>Multiply fractions:</b> straight across. 2/3 × 3/4 = 6/12 = 1/2.</li>
<li><b>Divide fractions:</b> flip the second one and multiply. 1/2 ÷ 1/4 = 1/2 × 4/1 = 2.</li>
<li><b>x% of y:</b> find 10% (move the decimal one place left), then build. 15% of 80 = 8 + 4 = 12.</li>
<li><b>x is what % of y:</b> make a fraction x/y and turn it into a percent. 9 is what % of 36? 9/36 = 1/4 = 25%.</li>
<li><b>Decimal × decimal:</b> multiply as whole numbers, then count the total decimal places. 0.3 × 0.4 → 3 × 4 = 12, two places → 0.12.</li>
<li><b>Order of operations:</b> parentheses, then powers/roots, then × and ÷ (left to right), then + and − (left to right). 6 + 4 × 3 − 2 = 6 + 12 − 2 = 16.</li>
</ul>`,
      },
      {
        h: 'Speed tricks and traps',
        html: `<ul>
<li><b>Percent flip:</b> x% of y = y% of x. 8% of 50 is the same as 50% of 8 = 4.</li>
<li>Multiplying two numbers smaller than 1 gives a <b>smaller</b> answer (0.3 × 0.4 = 0.12, not 1.2).</li>
<li>Dividing by a fraction smaller than 1 gives a <b>bigger</b> answer.</li>
<li>Don’t add fractions straight across: 1/2 + 1/3 is <b>not</b> 2/5.</li>
<li>√0.49 = 0.7 and √(1/9) = 1/3 — take the root of the top and bottom separately.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'Which is the <b>largest</b>?',
        choices: ['3/5', '0.58', '62%', '5/8', '0.6'],
        answer: 3,
        how: `<p>Turn everything into decimals:</p><ul><li>3/5 = 0.6</li><li>0.58</li><li>62% = 0.62</li><li>5/8 = 0.625 (from the cheat sheet)</li><li>0.6</li></ul><p>Largest is 0.625. Answer: <b>5/8</b>.</p>`,
      },
      {
        q: '0.3 × 0.4 = ?',
        choices: ['1.2', '0.12', '0.012', '0.7', '12'],
        answer: 1,
        how: `<p>Ignore the decimals: 3 × 4 = 12.</p><p>Count decimal places in the question: 0.<b>3</b> has one, 0.<b>4</b> has one → two total. Put two places in the answer: <b>0.12</b>.</p>`,
      },
      {
        q: 'What is 15% of 80?',
        choices: ['8', '10', '12', '15', '18'],
        answer: 2,
        how: `<p>10% of 80 = 8. 5% is half of that = 4.</p><p>15% = 8 + 4 = <b>12</b>.</p>`,
      },
      {
        q: '2/3 + 1/4 = ?',
        choices: ['11/12', '3/7', '5/6', '2/12', '1'],
        answer: 0,
        how: `<p>Common bottom number for 3 and 4 is 12.</p><p>2/3 = 8/12 and 1/4 = 3/12. Add the tops: 8 + 3 = 11. Answer: <b>11/12</b>.</p><p>(3/7 is the trap you get by adding straight across.)</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  wordprob: {
    title: 'Word problems',
    intro: `<p>Everyday math stories: prices, travel, work, discounts, averages, ratios, pay, and more. The math is usually simple — the skill is turning the words into a quick setup and not falling for trap answers.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li><b>Read the last sentence first</b> — what exactly are they asking for?</li>
<li>Pull out the numbers and write a one-line setup.</li>
<li><b>Estimate</b> the answer and cross out choices that are way off. Often that’s enough.</li>
<li>Check that your answer is in the <b>right units</b> (hours vs. minutes, feet vs. inches, sale price vs. discount).</li>
</ol>`,
      },
      {
        h: 'Formulas worth knowing',
        html: `<ul>
<li><b>Unit price:</b> total cost ÷ number of items. 6 for $3.00 → $0.50 each.</li>
<li><b>Distance = rate × time.</b> 50 mph for 3 hours = 150 miles. 45 minutes at 60 mph = 45 miles.</li>
<li><b>Working together:</b> add the rates, 1/a + 1/b. Shortcut for two people: (a × b) ÷ (a + b).</li>
<li><b>Discounts:</b> 20% off means you pay 80%. Two discounts in a row are applied one after the other — <b>20% off then 10% off is 28% off, not 30%</b>.</li>
<li><b>Average needed:</b> goal average × number of tests = total needed. Subtract what you have.</li>
<li><b>Ratios:</b> 3:5 of 40 → 3 + 5 = 8 parts; 40 ÷ 8 = 5 per part → 15 and 25.</li>
<li><b>Overtime (time-and-a-half):</b> overtime rate = regular rate × 1.5.</li>
<li><b>Feet ↔ inches:</b> convert everything to inches first. 5 ft 6 in = 66 in; cut into 6-inch pieces → 11 pieces.</li>
<li><b>Ages:</b> the difference between two people’s ages never changes.</li>
<li><b>Making change:</b> count up from the price. $13.47 → $14 is $0.53, → $20 is $6 more → $6.53.</li>
<li><b>Simple interest:</b> principal × rate × years. $500 at 4% for 3 years = $500 × 0.04 × 3 = $60.</li>
<li><b>Boxes needed:</b> divide and <b>round up</b>. 250 items, 12 per box → 20.8 → 21 boxes.</li>
<li><b>Percent change:</b> change ÷ <b>original</b>. 40 → 50 is 10/40 = 25% increase; 50 → 40 is 10/50 = 20% decrease.</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li>Answering a <b>middle step</b> (the discount instead of the final price, the overtime pay instead of the total pay).</li>
<li>Adding discounts together instead of applying them one at a time.</li>
<li>Averaging the two work times (3 and 6 hours → 4.5) — working together is always <b>faster</b> than the faster person alone.</li>
<li>Rounding boxes, buses, or trips <b>down</b> — you can’t leave items behind.</li>
<li>Using the new number instead of the original in percent change.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'A $50 jacket is marked 20% off. At the register you get an extra 10% off the sale price. What do you pay?',
        choices: ['$35', '$36', '$37', '$40', '$45'],
        answer: 1,
        how: `<p>Apply one discount at a time.</p><ol><li>20% off → pay 80%: $50 × 0.8 = $40.</li><li>10% off $40 → take away $4: $40 − $4 = <b>$36</b>.</li></ol><p>$35 is the trap from adding the discounts (30% off).</p>`,
      },
      {
        q: 'Ann can clean an office in 3 hours. Bo can clean it in 6 hours. Working together, how long will it take?',
        choices: ['4.5 hours', '9 hours', '2 hours', '1.5 hours', '3 hours'],
        answer: 2,
        how: `<p>Shortcut: (a × b) ÷ (a + b) = (3 × 6) ÷ (3 + 6) = 18 ÷ 9 = <b>2 hours</b>.</p><p>Check with rates: Ann does 1/3 per hour, Bo does 1/6. Together 2/6 + 1/6 = 3/6 = 1/2 per hour → 2 hours.</p><p>Quick check: together must be faster than Ann’s 3 hours, which rules out 3, 4.5, and 9.</p>`,
      },
      {
        q: 'Your first three test scores are 80, 85, and 90. What must you score on the fourth test to average 88?',
        choices: ['88', '92', '95', '97', '100'],
        answer: 3,
        how: `<ol><li>Total needed: 4 tests × 88 = 352.</li><li>Total so far: 80 + 85 + 90 = 255.</li><li>Needed: 352 − 255 = <b>97</b>.</li></ol>`,
      },
      {
        q: 'A worker earns $12 an hour and time-and-a-half for every hour over 40 in a week. How much does she earn for 46 hours?',
        choices: ['$588', '$552', '$600', '$828', '$576'],
        answer: 0,
        how: `<ol><li>Regular pay: 40 × $12 = $480.</li><li>Overtime rate: $12 × 1.5 = $18. Overtime hours: 46 − 40 = 6. Overtime pay: 6 × $18 = $108.</li><li>Total: $480 + $108 = <b>$588</b>.</li></ol><p>$552 is the trap (46 × $12, ignoring overtime).</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  geometry: {
    title: 'Measurement & geometry',
    intro: `<p>Practical shape and measurement questions: area and perimeter, carpet in square yards, tiles, fence posts, box volume, and converting between units. No fancy formulas — just a few facts and careful units.</p>`,
    sections: [
      {
        h: 'Key formulas',
        html: `<ul>
<li><b>Perimeter</b> (distance around): add all the sides. Rectangle = 2 × (length + width). Square = 4 × side.</li>
<li><b>Area</b> (space inside): rectangle = length × width. Square = side × side.</li>
<li><b>Volume</b> of a box: length × width × height. A 2 × 3 × 4 ft box = 24 cubic feet.</li>
<li><b>Tiles that fit:</b> big area ÷ small area — but first put both in the <b>same units</b>.</li>
<li><b>Fence posts in a straight line:</b> (length ÷ spacing) + 1. The extra post is for the far end. (Around a closed loop, don’t add 1.)</li>
</ul>`,
      },
      {
        h: 'Unit conversions',
        html: `<table>
<tr><th>Length</th><th>Weight &amp; volume</th><th>Time</th></tr>
<tr><td>12 in = 1 ft</td><td>16 oz = 1 lb</td><td>60 sec = 1 min</td></tr>
<tr><td>3 ft = 1 yd</td><td>2,000 lb = 1 ton</td><td>60 min = 1 hr</td></tr>
<tr><td>36 in = 1 yd</td><td>2 cups = 1 pint</td><td>24 hr = 1 day</td></tr>
<tr><td>5,280 ft = 1 mile</td><td>2 pints = 1 quart</td><td>7 days = 1 week</td></tr>
<tr><td>100 cm = 1 m</td><td>4 quarts = 1 gallon</td><td>52 weeks = 1 year</td></tr>
</table>
<p><b>Area and volume units are different!</b> 1 sq yd = 3 × 3 = <b>9 sq ft</b>. 1 sq ft = 12 × 12 = <b>144 sq in</b>. 1 cubic yd = 3 × 3 × 3 = <b>27 cubic ft</b>.</p>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li>Dividing square feet by 3 to get square yards. It’s <b>÷ 9</b>.</li>
<li>Mixing inches and feet in the same calculation. Convert first.</li>
<li>Forgetting the extra fence post at the end of a straight fence.</li>
<li>Mixing up perimeter (around) and area (inside).</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'A room is 12 feet by 15 feet. How many square yards of carpet are needed to cover the floor?',
        choices: ['20', '60', '180', '27', '54'],
        answer: 0,
        how: `<ol><li>Area in square feet: 12 × 15 = 180 sq ft.</li><li>Square feet → square yards: ÷ 9. 180 ÷ 9 = <b>20</b>.</li></ol><p>Faster: convert first — 12 ft = 4 yd, 15 ft = 5 yd, 4 × 5 = 20. (60 is the trap from dividing by 3.)</p>`,
      },
      {
        q: 'A straight fence is 60 feet long with a post every 6 feet, including one at each end. How many posts are there?',
        choices: ['9', '10', '11', '12', '6'],
        answer: 2,
        how: `<p>60 ÷ 6 = 10 gaps between posts.</p><p>A straight line has one more post than gaps: 10 + 1 = <b>11</b>.</p>`,
      },
      {
        q: 'How many 6-inch square tiles are needed to cover a floor that is 3 feet by 4 feet?',
        choices: ['12', '24', '36', '48', '72'],
        answer: 3,
        how: `<p>Convert to inches: 3 ft = 36 in, 4 ft = 48 in.</p><p>Tiles across: 36 ÷ 6 = 6. Tiles down: 48 ÷ 6 = 8. Total: 6 × 8 = <b>48</b>.</p><p>(Another way: each 6-inch tile is ¼ sq ft, so 4 tiles per sq ft. 3 × 4 = 12 sq ft × 4 = 48.)</p>`,
      },
      {
        q: 'A square has a perimeter of 36 inches. What is its area?',
        choices: ['36 sq in', '81 sq in', '72 sq in', '144 sq in', '18 sq in'],
        answer: 1,
        how: `<p>A square has 4 equal sides: 36 ÷ 4 = 9 inches per side.</p><p>Area = 9 × 9 = <b>81 sq in</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  dates: {
    title: 'Dates & time',
    intro: `<p>Calendar and clock questions: what day of the week it will be after some number of days, “the day before yesterday” puzzles, how much time passes between two clock times, and what month comes a number of months later.</p>`,
    sections: [
      {
        h: 'How to attack each type',
        html: `<ul>
<li><b>Days of the week:</b> the week repeats every 7 days. Divide the number of days by 7 and use only the <b>remainder</b>. 17 days from Tuesday: 17 ÷ 7 = 2 remainder 3 → count 3 days forward → Friday.</li>
<li><b>Same day again:</b> 7, 14, 21, 28 days later is the same weekday. If March 3 is a Monday, so are March 10, 17, 24, and 31.</li>
<li><b>Yesterday / tomorrow puzzles:</b> turn each phrase into a number. Day before yesterday = −2, yesterday = −1, today = 0, tomorrow = +1, day after tomorrow = +2. Find “today” first, then move.</li>
<li><b>Elapsed time:</b> count up to the next whole hour, then whole hours, then leftover minutes. Crossing noon? Go to 12:00 first.</li>
<li><b>Months:</b> number the months (Jan = 1 … Dec = 12). Add, and if you pass 12, subtract 12. 8 months after November: 11 + 8 = 19 → 19 − 12 = 7 = July.</li>
</ul>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li>Counting the starting day as day 1. “3 days after Tuesday” is Friday, not Thursday.</li>
<li>Subtracting clock times across noon (2:15 − 9:45 doesn’t work directly). Break it at 12:00.</li>
<li>Forgetting that there are 60 minutes in an hour, not 100.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'Today is Tuesday. What day of the week will it be 17 days from today?',
        choices: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Wednesday'],
        answer: 1,
        how: `<p>17 ÷ 7 = 2 weeks with <b>3 left over</b>. Two full weeks lands on Tuesday again.</p><p>Count 3 more: Wednesday (1), Thursday (2), <b>Friday</b> (3).</p>`,
      },
      {
        q: 'If the day before yesterday was Friday, what is the day after tomorrow?',
        choices: ['Tuesday', 'Monday', 'Wednesday', 'Sunday', 'Thursday'],
        answer: 0,
        how: `<p>Day before yesterday (−2) to day after tomorrow (+2) is 4 days.</p><p>Friday + 4: Saturday, Sunday, Monday, <b>Tuesday</b>.</p><p>(Check: yesterday = Saturday, today = Sunday, tomorrow = Monday, day after = Tuesday.)</p>`,
      },
      {
        q: 'A shift starts at 9:45 a.m. and ends at 2:15 p.m. How long is the shift?',
        choices: ['3 h 30 min', '4 h 15 min', '4 h 30 min', '5 h 30 min', '4 h 45 min'],
        answer: 2,
        how: `<ol><li>9:45 → 10:00 = 15 min.</li><li>10:00 → 2:00 = 4 hours.</li><li>2:00 → 2:15 = 15 min.</li></ol><p>Total: 4 hours + 30 min = <b>4 h 30 min</b>.</p>`,
      },
      {
        q: 'What month is 8 months after November?',
        choices: ['August', 'June', 'September', 'July', 'May'],
        answer: 3,
        how: `<p>November = 11. 11 + 8 = 19. Past 12, so subtract 12: 19 − 12 = 7.</p><p>Month 7 = <b>July</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  compare: {
    title: 'Detail comparison',
    intro: `<p>You’ll see several pairs of names, addresses, or numbers and count how many pairs are <b>exactly the same</b>. The differences are tiny on purpose — a swapped digit, one changed letter, a missing letter.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li>Go <b>one pair at a time</b>. Mark each pair “same” or “different” as you go.</li>
<li><b>Chunk numbers</b> into groups of 2–3 digits: 604172 → 604 | 172. Compare chunk to chunk.</li>
<li>Check the <b>start, end, and middle</b> — most changes hide in the middle.</li>
<li>For names, compare <b>word by word</b> and count letters in longer words.</li>
<li>Once you find one difference, stop checking that pair — it’s different.</li>
</ol>`,
      },
      {
        h: 'What to watch for',
        html: `<ul>
<li><b>Swapped digits:</b> 70563 vs 70536.</li>
<li><b>One-letter changes:</b> Jonathan vs Jonathon, Alvarez vs Alvares.</li>
<li><b>Missing or doubled letters:</b> Webb vs Web, Philip vs Phillip.</li>
<li><b>Abbreviations and punctuation:</b> St. vs St, Ave vs Ave., N. vs North.</li>
<li><b>Look-alike characters:</b> 6 vs 8, 1 vs 7, rn vs m.</li>
</ul>`,
      },
      {
        h: 'Speed tip',
        html: `<p>These are pure speed-and-care points — no knowledge needed. If you’re short on time, still try them: even a quick scan usually beats a random guess.</p>`,
      },
    ],
    examples: [
      {
        q: `How many of these pairs are <b>exactly the same</b>?
<table>
<tr><td>4821 Maple Ave</td><td>4821 Maple Ave</td></tr>
<tr><td>Jonathan Reyes</td><td>Jonathon Reyes</td></tr>
<tr><td>70563</td><td>70536</td></tr>
<tr><td>Dr. Ellen Park</td><td>Dr. Ellen Park</td></tr>
<tr><td>1159 W. 38th St</td><td>1159 W. 38th St</td></tr>
</table>`,
        choices: ['1', '2', '3', '4', '5'],
        answer: 2,
        how: `<ul><li>4821 Maple Ave — same ✔</li><li>Jonath<b>a</b>n vs Jonath<b>o</b>n — different</li><li>705<b>63</b> vs 705<b>36</b> — swapped digits, different</li><li>Dr. Ellen Park — same ✔</li><li>1159 W. 38th St — same ✔</li></ul><p>Answer: <b>3</b>.</p>`,
      },
      {
        q: `How many of these pairs are <b>exactly the same</b>?
<table>
<tr><td>38291</td><td>38291</td></tr>
<tr><td>604172</td><td>604172</td></tr>
<tr><td>55190</td><td>55109</td></tr>
<tr><td>8837</td><td>8837</td></tr>
<tr><td>219046</td><td>219046</td></tr>
</table>`,
        choices: ['1', '2', '3', '4', '5'],
        answer: 3,
        how: `<p>Chunk each number and compare:</p><ul><li>382|91 vs 382|91 — same ✔</li><li>604|172 vs 604|172 — same ✔</li><li>551|90 vs 551|09 — different (last two digits swapped)</li><li>88|37 vs 88|37 — same ✔</li><li>219|046 vs 219|046 — same ✔</li></ul><p>Answer: <b>4</b>.</p>`,
      },
      {
        q: `How many of these pairs are <b>exactly the same</b>?
<table>
<tr><td>Kathryn O’Neil</td><td>Katherine O’Neil</td></tr>
<tr><td>Marcus Webb</td><td>Marcus Web</td></tr>
<tr><td>Lisa Tran</td><td>Lisa Tran</td></tr>
<tr><td>Pedro Alvarez</td><td>Pedro Alvares</td></tr>
<tr><td>Greta Holm</td><td>Greta Holm</td></tr>
</table>`,
        choices: ['1', '2', '3', '4', '5'],
        answer: 1,
        how: `<ul><li>Kathryn vs Katherine — different spelling</li><li>Webb vs Web — missing letter</li><li>Lisa Tran — same ✔</li><li>Alvare<b>z</b> vs Alvare<b>s</b> — different last letter</li><li>Greta Holm — same ✔</li></ul><p>Answer: <b>2</b>.</p>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  scramble: {
    title: 'Scrambled sentences',
    intro: `<p>You’ll get a jumble of words. Mentally put them in order to make a sentence, then decide if that sentence is <b>true</b> or <b>false</b>.</p>`,
    sections: [
      {
        h: 'How to attack it',
        html: `<ol>
<li><b>Find the verb</b> (the action or “is/are/can/does” word).</li>
<li><b>Find the subject</b> — who or what is doing it (usually a noun, often with “the,” “a,” or “most”).</li>
<li>Snap the rest into place just enough to get the meaning. <b>Don’t fully rewrite the sentence</b> — you only need to know what it claims.</li>
<li>Decide if the claim is true in the real world.</li>
</ol>`,
      },
      {
        h: 'Common traps',
        html: `<ul>
<li><b>Watch for “not,” “never,” and “no.”</b> One small word flips the answer. “Water does not boil at 212°F” is false.</li>
<li><b>Watch for “all,” “always,” “most,” “some.”</b> “All birds can fly” is false; “most birds can fly” is true.</li>
<li>Use every word — if a word is left over, your sentence is probably wrong.</li>
</ul>`,
      },
    ],
    examples: [
      {
        q: 'Unscramble the words. Is the sentence true or false?<br><b>fish cannot water live of out most</b>',
        choices: ['True', 'False'],
        answer: 0,
        how: `<p>Verb: “cannot live.” Subject: “most fish.”</p><p>Sentence: “Most fish cannot live out of water.” That’s correct. Answer: <b>True</b>.</p>`,
      },
      {
        q: 'Unscramble the words. Is the sentence true or false?<br><b>north the in sun the rises</b>',
        choices: ['True', 'False'],
        answer: 1,
        how: `<p>Verb: “rises.” Subject: “the sun.”</p><p>Sentence: “The sun rises in the north.” The sun rises in the east. Answer: <b>False</b>.</p>`,
      },
      {
        q: 'Unscramble the words. Is the sentence true or false?<br><b>has teeth adult an thirty-two usually</b>',
        choices: ['True', 'False'],
        answer: 0,
        how: `<p>Verb: “has.” Subject: “an adult.”</p><p>Sentence: “An adult usually has thirty-two teeth.” That’s right (including wisdom teeth). Answer: <b>True</b>.</p>`,
      },
      {
        q: 'Unscramble the words. Is the sentence true or false?<br><b>boil water at does not 212 degrees Fahrenheit</b>',
        choices: ['True', 'False'],
        answer: 1,
        how: `<p>Verb: “does not boil.” Subject: “water.”</p><p>Sentence: “Water does not boil at 212 degrees Fahrenheit.” Water <i>does</i> boil at 212°F (at sea level), and the “not” makes this claim wrong. Answer: <b>False</b>.</p>`,
      },
    ],
  },
};
