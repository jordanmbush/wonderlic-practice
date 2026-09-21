import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

/**
 * Reads the practice app's own data at build time, so the guides and the app
 * can never disagree about what a topic is called.
 *
 * The app is deliberately plain browser JavaScript: `core.js` and
 * `lessons.js` are classic scripts that assign to `window`, loaded in order by
 * <script> tags with no imports and no bundler. That is what lets the practice
 * engine stay a folder of files anyone can open, and it is worth keeping.
 *
 * It does mean Astro cannot simply `import` them. So they run here in a
 * sandbox whose `window` is the sandbox itself — the same trick the browser
 * plays — and whatever they hang off it is read back out. Nothing from Node
 * except `console` is exposed to that sandbox.
 *
 * This is the ONLY place that reads these files as data. Everything else
 * imports from here.
 *
 * ⚠️ `lessons.js` lives in `src/data/`, not in `public/js/`, and that is
 * deliberate: it is build-time content now. Moving it back under `public/`
 * would ship ~40KB of lesson HTML to every visitor of `/practice/`, who never
 * reads it — the guides do. The app no longer loads it at all.
 */
/**
 * The project root, found by walking up from the working directory.
 *
 * NOT `import.meta.dirname`: Astro bundles this module into `dist/.prerender/`
 * before running it, so at build time that resolves inside the output folder
 * and every read fails with ENOENT on a path that looks almost right. The
 * working directory is where `npm run build` was invoked, which is the root
 * for a local build and for CI alike — but it is verified rather than assumed,
 * because a wrong root here fails deep inside the build with a confusing
 * message rather than here with a clear one.
 */
function findRoot() {
  let dir = process.cwd();
  for (let up = 0; up < 6; up++) {
    const manifest = path.join(dir, "package.json");
    if (fs.existsSync(manifest)) {
      const { name } = JSON.parse(fs.readFileSync(manifest, "utf8"));
      if (name === "wonderlic-practice") return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `content.mjs: couldn't find the wonderlic-practice project root from ${process.cwd()}. ` +
      `Run the build from inside the repository.`,
  );
}

const root = findRoot();

const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);

for (const file of ["public/js/core.js", "src/data/lessons.js"]) {
  const full = path.join(root, file);
  vm.runInContext(fs.readFileSync(full, "utf8"), sandbox, { filename: full });
}

/** Lesson content, keyed by the app's category id. */
export const LESSONS = sandbox.LESSONS;

/** The question categories, in the app's own order, with icons and blurbs. */
export const CATS = sandbox.CATS;

/** Site name, domain, contact address and the trademark wording. */
export const SITE = sandbox.SITE;

if (!LESSONS || !CATS || !SITE) {
  throw new Error(
    "content.mjs: the app scripts didn't define what was expected. " +
      "core.js should set window.SITE and window.CATS; lessons.js should set " +
      "window.LESSONS. If a script was renamed or made into an ES module, this " +
      "loader has to change with it.",
  );
}
