// Terms, privacy and trademark text for the #/legal page.
//
// Two things to keep true:
//  1. The privacy section says this site collects nothing. That is only
//     accurate while there is no analytics, no ads and no sign-up form. If any
//     of those are ever added, rewrite this section first.
//  2. The trademark wording is the point of the whole page. Leave it in place.
(function () {
  const site = window.SITE;
  const updated = 'September 2026';

  window.LEGAL = {
    updated,
    html: `
      <h1>Terms &amp; Privacy</h1>
      <p class="sub">Last updated ${updated}. Plain English, because there isn’t much to say.</p>

      <section class="card legal">
        <h2>What this site is</h2>
        <p>${site.name} is a free study tool for people preparing for the ${site.mark} test. Every question on it was written or generated for this site. None of it is real test content, and nobody here has seen the real test.</p>
        <p>A score you get here is a practice score. It is not an official result, it does not predict your real score, and it means nothing to a school or an employer.</p>
      </section>

      <section class="card legal">
        <h2>Trademarks</h2>
        <p><b>${site.mark} is a registered trademark of ${site.owner}</b> This site is not affiliated with, endorsed by, or sponsored by ${site.owner}</p>
        <p>The name is used only to say which test this site helps you prepare for. ${site.owner} had no part in making this site and does not review or approve anything on it.</p>
      </section>

      <section class="card legal">
        <h2>Your privacy</h2>
        <p>This site does not collect anything about you.</p>
        <ul>
          <li>There is no account and no sign-up. You are never asked for your name or email.</li>
          <li>There are no ads, no analytics and no tracking cookies.</li>
          <li>Your answers, scores and progress are saved in your own browser and never sent anywhere. We cannot see them.</li>
        </ul>
        <p>Because your progress lives in your browser, it stays on the one device and browser you study in. Clearing your browsing data, or using a private window, erases it. There is no backup and no way to recover it — which is fine for a few weeks of study, but worth knowing.</p>
      </section>

      <section class="card legal">
        <h2>Using the site</h2>
        <ul>
          <li>It’s free to use for your own studying.</li>
          <li>The questions, lessons and explanations belong to this site. Please don’t copy them onto another site or into a product you sell.</li>
          <li>We don’t promise the site will be available, error-free, or that it will raise your score. Use it at your own risk, and don’t rely on it as your only preparation.</li>
          <li>To the extent the law allows, we aren’t liable for any loss that comes from using the site.</li>
        </ul>
      </section>

      <section class="card legal">
        <h2>Questions or corrections</h2>
        <p>Found a wrong answer, or need something taken down? Email <b>[add a contact email before launch]</b>.</p>
      </section>

      <p><a class="back" href="#/">← Back to studying</a></p>`,
  };
})();
