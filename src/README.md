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
3. **Only if the release changes the sync script itself** (`template.user.js`, not just the page): set `REQUIRED_SCRIPT` in `sync.js` to the new version. Anyone on an older script then gets the "Update needed" box and can't use the page until they update. Page-only releases leave it alone; people still see the optional red dot in Settings.
4. Update `CHANGELOG.md`: write the new version at the top with its full description, and turn the previous one into a one-line title under *Earlier versions*.
5. `python3 src/build.py`, then commit and push. GitHub Pages publishes within a couple of minutes.
