# Kindle Library Calculator

A SteamDB-style calculator for your Kindle library. It shows how many books you own, what they're worth, how long it would take to read them all, and a **Shelf of Shame** of everything you bought but never opened.

**Everything lives at https://bookshelf.kirbee213.tv.**

- **With the free sync script installed** (Tampermonkey), the site fills itself in from your Kindle library and your Goodreads shelves every time you open it. Nothing to download, export or upload, and no other site to visit.
- **Without it** (or on a phone), the same site works from files you import.

> **Heads up: it's good, not perfect.** The calculator only knows what Amazon and Goodreads are willing to share. Expect a few titles that don't match between the two, and some genres, page counts and prices that are best guesses. Click any book's title in the library to fix it. Your edits always win and are never overwritten by a sync. See [Known limits](#known-limits).

Your books are stored only in your own browser. Nothing is sent to a server, and nobody else who visits the site can see your library.

---

## Contents

- [What it shows](#what-it-shows)
- [Two ways to use it](#two-ways-to-use-it)
- [Automatic sync: install the script](#automatic-sync-install-the-script)
- [What happens after you install the script](#what-happens-after-you-install-the-script)
- [Without the script: file import](#without-the-script-file-import)
- [How Kindle and Goodreads books are matched](#how-kindle-and-goodreads-books-are-matched)
- [Settings](#settings)
- [Editing books by hand](#editing-books-by-hand)
- [Backing up and moving to another computer](#backing-up-and-moving-to-another-computer)
- [Troubleshooting](#troubleshooting)
- [Known limits](#known-limits)
- [Files in this repo](#files-in-this-repo)

---

## What it shows

| Section | What you get |
| --- | --- |
| **Summary** | Books owned, library value (hidden until you click it), total reading time, and the percent of your library you've never opened. |
| **Shelf of Shame** | Up to 100 of your unread books drawn as spines on a bookcase. Thicker books get wider spines. Hover a spine to see the title, author and page count. |
| **Shame stats** | Money spent on unread books, hours of reading waiting on the shelf, the date you'd finish everything at your daily pace, your oldest unread book, and books added vs. finished in the last 12 months. |
| **Breakdowns** | Books by status, books added per year, and your most-owned authors with how many of theirs are unread. |
| **Your library** | A searchable, sortable table of every book. Change a status right in the table, or click a title to edit it. |

Statuses are **Unread**, **Reading**, **Finished** and **DNF** (Did Not Finish). Only **Unread** books go on the Shelf of Shame.

**Stalled books.** A book marked **Reading** for more than a year gets a red **stalled 1 yr+** tag, a **Stalled 1 yr+** button under Your library, and a link in the Shelf of Shame stats ("2 stalled for over a year, sort them"). Decide each one: mark it **Finished**, or **DNF** if you've given up on it. The clock starts when you set a book to Reading; books that were already Reading count from their purchase date.

Books bought in the **last 5 days** are outlined in gold and placed first on the Shelf of Shame, with a *new* tag in the library table. With the sync script, purchase dates come straight from Amazon. Without it, dates come from the Kindle for PC app file or an Amazon orders file, and a Kindle book that first shows up after your first import is dated the day it appeared. To mark a book as just bought yourself, click its title and set **Added on** to the purchase date.

**Spine color.** Above the bookcase, switch **Spine color** between **Default** (mixed book-cloth colors) and **By genre**. In genre mode the shelf doubles as a chart: its 100 spines are split between genres in proportion to your unread books, grouped together, biggest genre first. If half your unread books are Sci-Fi & Fantasy, half the spines are. The key under the shelf shows each genre's count and percentage. Genres come from Amazon's own categories for each book (its Kindle Store path, like *Kindle eBooks › Mystery, Thriller & Suspense › Thrillers*, plus its best-seller categories), read by the sync script. Without the script, set genres by clicking a book. To fix a wrong genre, click the book's title and pick one from **Genre**. Genres: Mystery & Thriller, Romance, Sci-Fi & Fantasy, Horror, General Fiction, History & Biography, Self-help & Health, Cooking & Food, Humor, Kids & YA, Comics, Other Nonfiction.

---

## Two ways to use it

Both happen on the same page, **bookshelf.kirbee213.tv**. The script just adds automatic syncing to it.

| | **With the sync script (recommended)** | Without it |
| --- | --- | --- |
| Install anything? | Tampermonkey browser extension, once | No |
| How books get in | Syncs by itself from Goodreads and your Kindle library when you open the page | You export and import files |
| Read status | From your Goodreads shelves, every time | From a Goodreads CSV, or set by hand |
| Works on phones | No (desktop browsers only) | Yes |

---

## Automatic sync: install the script

Once it's installed you never export, download or upload anything.

### Install (one time)

The easy way: open **https://bookshelf.kirbee213.tv**. The first time you visit, a step-by-step setup walks you through all of this, with buttons and instructions for your browser. It also comes back if you click **Set up sync** (on the example banner, or in **Settings**). The same steps by hand:

1. Install **Tampermonkey** from your browser's extension store (Chrome Web Store, Edge Add-ons, Firefox Add-ons or Opera add-ons).
2. **Chrome, Edge and Opera:** go to `chrome://extensions` (or `edge://extensions`, or `opera://extensions`), click **Details** on Tampermonkey and turn on **Allow User Scripts**. On older versions, turn on **Developer mode** at the top right of the extensions page instead. Without this, the script installs but never runs.
3. Open [`kindle-library-calculator.user.js`](kindle-library-calculator.user.js) in this repo and click **Raw**. Tampermonkey opens an install page. Click **Install**.

You can also copy the file's contents, open the Tampermonkey dashboard, click the **+** tab, paste and press **Ctrl+S**.

### Updating

Tampermonkey updates the script by itself: it checks this GitHub repo on a schedule (once a day by default) and installs a new version whenever the `@version` number goes up. Your books and settings are kept.

- **Right away:** click the Tampermonkey icon → **Check for userscript updates**.
- **More often:** Tampermonkey **Dashboard → Settings**, set **Config mode** to **Advanced**, then under **Script Update** change **Check Interval** (for example to every hour).
- **The site tells you:** when your script is older than the site, a red dot appears on **Settings**. Open it and click **Update** under *Sync script and updates*, press **Update** in the Tampermonkey tab, and come back. The page finishes by itself.
- **The page itself** checks for a newer version each visit and reloads on its own between syncs, so you never need Ctrl+F5. **Settings → What's new** lists the changes.

---

## What happens after you install the script

### Every time you open bookshelf.kirbee213.tv

1. The page finds the script and shows **Sync now** and a status line under the title.
2. The script reads your Goodreads **to-read**, **currently-reading** and **read** shelves. The status line shows progress, for example *Reading your Goodreads "read" shelf…*
3. It reads your **Kindle library** list in pages of 50 (*Reading your Kindle library… 150 books*). To keep things quick it reuses the last copy for up to 6 hours. **Sync now** always fetches a fresh one.
4. It reads **purchase dates** from Amazon's **Content & Devices** page (once a day, or whenever you press **Sync now**). Every book gets the real date you bought it. If you used Kindle's own **Mark as read**, those books count as finished too. For books you bought yourself, it also reads the **price you paid** (before tax) from each order's summary page, up to 150 orders per sync, one at a time with a short pause between (a full batch adds about 2–3 minutes to a sync). A big library fills in over a few syncs, and if Amazon pushes back it stops and picks up next time. Only the price is kept. Books shared with you, free books and Kindle Unlimited books have no order of yours to read.

**Book details from Amazon.** After each sync, the script reads each book's Amazon page once, in the background (about one book a second, unread books first), and fills in:

- **Genre**, from Amazon's categories for the book.
- **Page count**, from the print length Amazon lists, for books that don't have one yet (Goodreads or your own number comes first).
- **Today's Kindle price**, for books without a known price paid (shared, Kindle Unlimited, Prime, or bought but not yet read from its order). Kindle Unlimited books use the "to buy" price, not $0.00. These prices are rechecked once a month. In the library table they show as **now $5.99** to set them apart from what you actually paid, and library value uses: price paid → today's Kindle price → the guess from Settings. The spreadsheet export has a **Kindle price today** column.

Anything you set by hand is never overwritten. If Amazon asks the script to slow down, it stops and continues on your next visit.

> **Large libraries take a while the first time.** Each book's Amazon page is read one at a time, about a second per book, so the first scan of a 600-book library takes roughly 10 minutes, and a 2,000-book library around half an hour. The status line shows progress and an estimate, genre-colored spines start gray and fill in as it goes, and you can keep using the page. If you close it partway, the scan continues where it left off on your next visit. After the first pass, only new books are read (plus a monthly price check for books without a price paid), so later visits are quick.
5. It **matches the two** (see the next section) and updates the numbers, charts and Shelf of Shame.
6. Everything is saved in your browser for next time.

When it's done, the status line reads something like:

> Synced 11:20 AM · Goodreads 412 books, 380 matched · Kindle 597 books · 597 purchase dates

The script works in the background using your existing Goodreads and Amazon sign-ins, so you need to be **signed in to goodreads.com and read.amazon.com** in the same browser. It only reads; it never changes anything in either account. The first time, Tampermonkey may ask you to allow the script to connect to goodreads.com and amazon.com. Choose **Always allow**.

### Day to day

Open **bookshelf.kirbee213.tv**. That's it. Mark books as read on Goodreads the way you normally would, and buy Kindle books as usual; the page picks up both.

### Extras the script adds

- A **Shelf of Shame** button in the bottom-right corner of every Goodreads page links to the calculator.
- Visiting **read.amazon.com/kindle-library** refreshes the Kindle list right away (a small box in the corner counts the books). You don't need to do this, but it's there. UK, Canada and Australia Kindle sites work too.
- The older address **goodreads.com/kindle-calculator** still works, but keeps a separate copy of your library. Use bookshelf.kirbee213.tv.

### What you end up with

- **Your Kindle books** are the library. That's what you own.
- **Goodreads** supplies what you've done with them: status, rating and page count.
- **Kindle books with no Goodreads match** stay Unread and sit on the Shelf of Shame.
- **Goodreads-only books** (paper copies, library loans) are left out, unless you turn on *Include Goodreads books that aren't in my Kindle library* in Settings.
- **No Kindle list yet?** Your Goodreads books are used as the whole library instead.

---

## Without the script: file import

Use this on a phone, or if you don't want to install Tampermonkey. Without the script, a website isn't allowed to read your Amazon or Goodreads account, so you bring your books in as files.

Open **https://bookshelf.kirbee213.tv**. You'll see an example library of public-domain classics first. It disappears as soon as you import your own books or click **Start empty**.

Open **Settings**, click **Import a file** under *Files and backups*, and choose a tab. No console or developer tools are involved.

### Goodreads

1. On goodreads.com go to **My Books**, then **Import and export** (under Tools in the left sidebar), then **Export library**.
2. Download the CSV when it's ready.
3. In the calculator, open the **Goodreads** tab and drop in the CSV, then click **Import**.

Shelves become statuses: **to-read** is Unread, **currently-reading** is Reading, **read** is Finished. Ratings, page counts and date added come across too.

Tick **Only import Kindle editions** to skip books you logged as paperback or hardcover.

### Amazon orders

Adds prices and purchase dates to books you've already imported.

1. Request your data at **amazon.com/hz/privacy-central/data-requests** and pick Kindle / digital orders.
2. When Amazon emails you (this can take days or weeks), unzip the download and find the digital orders CSV, such as `Digital Items.csv`.
3. Drop it into the **Amazon orders** tab. Books are matched by ASIN or title.

### Any CSV or a backup

Any spreadsheet saved as CSV works if the first row has column names. Recognised columns: `title`, `author`, `asin`, `pages`, `price`, `date`, `status`, `progress`, `rating`, `source`. Backup files from **Back up library** go here too.

### Merge or replace

Imports **merge** by default: new books are added and existing ones are updated. Tick **Replace my current library** to start fresh instead.

---

## How Kindle and Goodreads books are matched

Each Goodreads book is compared with your Kindle books in this order:

1. **ASIN**, when both have one.
2. **Title and the author's last name.** Titles are simplified first: series tags like *(The Stormlight Archive, #1)*, subtitles after a colon, a leading *The/A/An*, and punctuation are all ignored. Kindle's *"Sanderson, Brandon"* author style is flipped to *Brandon Sanderson*.
3. **Title alone**, if only one book in your library has that title and the authors don't conflict.

Books that don't match any of these are treated as separate books. If a book you've read keeps showing as Unread, its title or author is probably spelled very differently on the two sites. Fix it by setting the status by hand.

---

## Settings

Click **Settings** to change:

| Setting | Default | What it does |
| --- | --- | --- |
| Pages to assume when unknown | 320 | Kindle doesn't report page counts. Used until Goodreads or you supply one. |
| Price to assume when unknown | $7.99 | Used for library value when a purchase price is missing. Shown as `~$7.99` in the table. |
| Minutes per page | 1.1 | Drives every reading-time estimate. About 1 minute per page is typical for adult fiction. |
| Pages you read per day | 55 | Used to work out when you'd clear the shelf. The **Reading pace** buttons next to the shame stats set it in one click: **Slow** 35, **Average** 55, **Fast** 90 pages a day. Any other number entered here counts as a custom pace. |
| Currency | USD | How money is displayed. |
| Finished when progress reaches % | 90 | Kindle books rarely hit 100% because of back matter. |
| Count Kindle Unlimited, Prime, borrowed and family-shared books | Off | Books you didn't buy are left out of totals by default. With the sync script, Amazon says how each book was obtained, so books shared with you through Amazon Family Library are marked **shared** automatically. Change a book's **How you got it** by hand and the sync leaves it alone. |
| Count samples | Off | Samples are left out by default. |
| Include Goodreads books that aren't in my Kindle library | Off | Tampermonkey version only. |

**Delete all books** at the bottom of Settings clears your library. You click it twice to confirm.

---

## Editing books by hand

- **Change a status** with the dropdown in the table.
- **Click a title** to edit the title, author, status, progress, pages, price, date added, how you got it, and rating, or to delete the book.
- **Add book** adds one manually.

A status you set by hand is **locked**: later imports and syncs won't overwrite it. Other fields still fill in if they were blank.

---

## Exporting a spreadsheet

Click **Export spreadsheet** next to the search box under **Your library**. You get an Excel file (`kindle-library-<date>.xlsx`) that opens in Excel, Google Sheets, Numbers or LibreOffice, with one row per book: title, author, status, progress, pages, price paid, purchase date, how you got it, genre, rating, whether it's counted in your totals, and ASIN. The header row stays put while you scroll, and every column has a filter arrow, so you can sort or filter by any column right away. Dates and prices are real dates and numbers, so they sort correctly.

The spreadsheet is a copy for looking at. To move your library to another computer, use **Back up library** (below).

## Backing up and moving to another computer

Your library lives in the browser you used. Clearing browser data, switching browsers or changing computers starts you over. To keep it:

1. Open **Settings** and click **Back up library**. A file like `kindle-library-2026-09-30.json` downloads.
2. On the other computer or browser, open the calculator, go to **Settings → Import a file**, choose **Any CSV / backup** and drop in the file.

The goodreads.com/kindle-calculator page stores its data separately from bookshelf.kirbee213.tv. A backup from one imports into the other.

---

## Troubleshooting

**The site doesn't show Sync now after installing the script.**
Turn on **Allow User Scripts** (or Developer mode) for Tampermonkey in Chrome/Edge, then reload the page. Check that the Tampermonkey icon shows the script as enabled on bookshelf.kirbee213.tv. Make sure the script is version 1.2 or newer.

**"Goodreads failed: sign in at goodreads.com first."**
Sign in to goodreads.com in the same browser, open any Goodreads page once, then come back and press **Sync now**.

**"Kindle failed: sign in at read.amazon.com first."**
Sign in at read.amazon.com in the same browser, then press **Sync now**. If Tampermonkey asked about connecting to amazon.com and you blocked it, allow it in the Tampermonkey dashboard under the script's **Settings → XHR Security**.

**"Goodreads failed: …" in the status line.**
Goodreads may be slow or may have changed its pages. Press **Sync now** again. If it keeps failing, use the Goodreads CSV export in **Settings → Import a file** instead.

**Every book shows as Unread.**
That's expected from the Kindle list on its own. Amazon doesn't share reading progress there. Sync Goodreads or mark books by hand.

**A book I've read is still on the Shelf of Shame.**
It didn't match between Kindle and Goodreads. Set its status in the table and it stays that way.

**The example library won't go away.**
Click **Start empty** or import something. The example books are never saved.

---

## Known limits

- The Kindle sync uses the same unofficial library list that Amazon's own Kindle website uses. Amazon can change it without notice. If it breaks, the Goodreads sync and the file imports still work.
- Kindle reading progress isn't available from Amazon's library list.
- Page counts and prices are estimates unless Goodreads, an Amazon orders file, or you provide them.
- The first genre, page count and price scan reads about one book a second, so big libraries take a while the first time (roughly 10 minutes per 600 books). It resumes where it left off if interrupted.
- Book covers aren't shown.
- The sync script works in desktop browsers only. On phones, use file import.

---

## Files in this repo

| File | What it is |
| --- | --- |
| `index.html` | The website version, served at bookshelf.kirbee213.tv |
| `BookshelfCalc/index.html` | The same page, for use at a `/BookshelfCalc` path |
| `kindle-library-calculator.user.js` | The Tampermonkey sync script |
| `CNAME` | Tells GitHub Pages to use bookshelf.kirbee213.tv |
| `README.md` | This file |
