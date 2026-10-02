# Source files

The site (`index.html`, `BookshelfCalc/index.html`) and the sync script (`kindle-library-calculator.user.js`) in the folder above are **built** from these files. Edit these, then rebuild; don't edit the built files directly, or the next build overwrites your change.

| File | What it is |
|---|---|
| `base.html` | The calculator page: layout, styles, themes, stats, shelf, charts, import/export |
| `sync.js` | Everything that talks to the sync script: sync, progress box, setup walkthrough, Settings updates, book details |
| `template.user.js` | The Tampermonkey script. Its `@version` is the release number; bump it for every release |
| `build.py` | Combines the above into the site and the script |

## Build

```bash
python3 src/build.py
```

Needs only Python 3. It writes `index.html`, `BookshelfCalc/index.html` and `kindle-library-calculator.user.js`.

## Releasing

1. Bump `@version` in `template.user.js` (open pages reload themselves when this number goes up, and people with an older script get the Update button in Settings).
2. Add a line for it at the top of `CHANGES` in `sync.js` (shown under Settings → What's new).
3. `python3 src/build.py`, then commit and push. GitHub Pages publishes within a couple of minutes.
