# Source files

The site (`index.html`, `BookshelfCalc/index.html`) and the sync script (`kindle-library-calculator.user.js`) in the folder above are **built** from these files. Edit these, then rebuild; don't edit the built files directly, or the next build overwrites your change.

| File | What it is |
|---|---|
| `base.html` | The calculator page: layout, styles, themes, stats, shelf, charts, import/export |
| `sync.js` | Everything that talks to the sync script and the phone bookmark: sync, progress box, setup walkthrough, Settings updates, book details |
| `drive.js` | Google Drive sync (one file in the user's own Drive, merged book by book) |
| `template.user.js` | The sync script's own code, built into `core.js`. Its `@version` is the release number; bump it for every release |
| `loader.user.js` | The sync script people install: it never updates itself, and only runs `core.js` from a signed release |
| `signing-key.pub` | The public half of the Shelf of Shame signing key (the private half never comes near this repo) |
| `signing.py` | Works out the release text, checks signatures, and saves a new one |
| `release.json` | The current signed release: the release text and its signature |
| `csp.py` | Adds the Content Security Policy to every page |
| `bookmarklet.src.js` | The phone bookmark's code; the build adds the shared Amazon readers from `template.user.js` and minifies it into `bm.js` |
| `script-version.json` | The script's code fingerprint and the version that last changed it (see Releasing) |
| `privacy.html`, `bookmark.html`, `help.html`, `iphone.html` | The privacy page, the bookmark set-up page, the getting-started guide for every device and the iPhone/iPad guide |
| `icons/make_icons.js`, `icon-*.png`, `og.png` | Draws the site icons and the link-preview picture (needs Playwright) |
| `build.py` | Combines the above into the site, the script and the bookmark code |

## Build

```bash
python3 src/build.py
```

Needs Python 3 and `terser` (for the bookmark code). It writes `index.html`, `BookshelfCalc/index.html`, `kindle-library-calculator.user.js`, `bm.js` and copies the pages and icons next to them.

## Releasing

1. Bump `@version` in `template.user.js`. Versions are Release.Build.Security.Patch: 2.0, then 2.1 for the next beta that goes live, 2.1.1 for a security fix, 2.1.1.1 for a small update.
2. Add a line for it at the top of `CHANGES` in `sync.js` (shown under Settings → What's new).
3. The required script version is automatic: when the script's code changes, the build makes that version required and anyone with an older script gets "Update needed". Page-only releases leave it alone.
4. Update `CHANGELOG.md`: write the new version at the top with its full description, and turn the previous one into a one-line title under *Earlier versions*.
5. `python3 src/build.py`. If `bm.js` or `core.js` changed, the build stops with **NEEDS SIGNING** and prints the release text (also in `src/release.pending.txt`).
6. Daniel signs that text on the Shelf of Shame signing page ("Sign a release": the text, his key file and passphrase), then `python3 src/signing.py save <signature>` checks it and saves `src/release.json`.
7. `python3 src/build.py` again, then commit and push. GitHub Pages publishes within a couple of minutes.

## Signed releases

The phone bookmark and the sync script only run `bm.js` and `core.js` when they match a release text signed with Daniel's signing key, which lives only in his signing folder and password manager. The key file is encrypted with his passphrase; neither ever comes near this repo. If the key were ever lost, a new key means everyone sets up the bookmark and installs the script again once.
