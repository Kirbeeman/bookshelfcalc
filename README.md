# Kindle Library Calculator

A calculator for your Kindle library, in the style of a popular gaming database website. See what your library is worth, how long it would take to read, and the **Shelf of Shame**: everything you bought but never opened.

**Use it at https://bookshelf.kirbee213.tv**

- [User guide](GUIDE.md): every feature, setting and fix.
- [Changelog](CHANGELOG.md): what changed in each version.

Your books are stored only in your own browser. Nothing is sent to a server, and nobody else can see your library.

---

## Get started

Open **https://bookshelf.kirbee213.tv** on a computer. The first visit walks you through setup step by step. If you'd rather do it by hand:

1. **Install Tampermonkey**, a free browser extension, from your browser's add-on store (Chrome, Edge, Firefox or Opera).
2. **Chrome, Edge and Opera only:** open `chrome://extensions` (or `edge://` / `opera://extensions`), click **Details** under Tampermonkey and turn on **Allow User Scripts**. On older versions, turn on **Developer mode** instead.
3. **Install the sync script:** open [`kindle-library-calculator.user.js`](kindle-library-calculator.user.js), click **Raw**, then **Install**.
4. **Sign in** in the same browser:
   - **amazon.com** (required): your library, purchase dates and prices.
   - **read.amazon.com** (the Kindle reader has its own sign-in).
   - **goodreads.com** (optional): books you've marked read there count as read here.
5. Open the site and press **Sync now**.

**On a phone, or rather not install anything?** You can still bring your books in from a Goodreads export: **Settings → Import a file**. See the [guide](GUIDE.md#without-the-script-file-import) for how.

## Updates

- **The site** updates itself. Open pages reload on their own when a new version is out.
- **The sync script** updates through Tampermonkey (about once a day). When an update is waiting, a red dot appears on **Settings**; click **Update** there. The dot goes away once you've looked at what's new. If the site *needs* a newer script, it asks you to update before you can continue.
- **What changed:** see the [changelog](CHANGELOG.md), or **Settings → What's new**.
- **Forcing the front-end to reload.** The front-end is the webpage itself (bookshelf.kirbee213.tv), not the sync script. It normally updates on its own, but if you've heard about a change and don't see it yet, force a fresh copy with either method:

  | Browser | Keyboard (Windows / Linux) | Keyboard (Mac) | Mouse |
  | --- | --- | --- | --- |
  | Chrome, Edge, Opera, Brave | `Ctrl` + `F5` or `Ctrl` + `Shift` + `R` | `Cmd` + `Shift` + `R` | Hold `Shift` and click the reload button |
  | Firefox | `Ctrl` + `F5` or `Ctrl` + `Shift` + `R` | `Cmd` + `Shift` + `R` | Hold `Shift` and click the reload button |
  | Safari | | `Cmd` + `Option` + `R` | Hold `Option` and click the reload button |

  Your books and settings are not affected; only the page itself is fetched again.

## Good to know

- **It's good, not perfect.** It only knows what Amazon and Goodreads share, so expect some guessed genres, page counts and prices. Click any book's title to fix it; your edits are never overwritten.
- **Your library is per browser.** A different computer or browser starts empty. To move it, use **Settings → Back up library**, then **Import a file** on the other one.
- Trouble? See [Troubleshooting](GUIDE.md#troubleshooting).

---

## Files in this repo

| File | What it is |
| --- | --- |
| `index.html` | The site, served at bookshelf.kirbee213.tv |
| `kindle-library-calculator.user.js` | The Tampermonkey sync script |
| `GUIDE.md` | The full user guide |
| `CHANGELOG.md` | What changed in each version |
| `src/` | Source files the site and script are built from, with build and release steps (`src/README.md`) |
| `BookshelfCalc/index.html` | A copy of the site for a `/BookshelfCalc` path |
| `CNAME` | Points GitHub Pages at bookshelf.kirbee213.tv |

---

## Thanks

A big thank-you to everyone using the calculator: for finding bugs, suggesting features, and cheering it on. Many of the features started out as one of your ideas. Found a problem or have an idea? [Open an issue](https://github.com/Kirbeeman/bookshelfcalc/issues).
