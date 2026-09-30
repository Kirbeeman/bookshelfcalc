# Kindle Library Calculator

A SteamDB-style calculator for your Kindle library. It shows how many books you own, what they're worth, how long it would take to read them all, and a **Shelf of Shame** of everything you bought but never opened.

**The main way to use it** is a free browser add-on script that syncs itself from your Goodreads shelves and your Kindle library. There's nothing to download, export or upload: install it once, then just open the calculator.

If you can't install browser add-ons (or you're on a phone), there's also a website version at **https://bookshelf.kirbee213.tv** where you import a file instead.

Your books are stored only in your own browser. Nothing is sent to a server, and nobody else who visits the site can see your library.

---

## Contents

- [What it shows](#what-it-shows)
- [Two ways to use it](#two-ways-to-use-it)
- [Main way: automatic sync (Tampermonkey)](#main-way-automatic-sync-tampermonkey)
- [What happens after you install the script](#what-happens-after-you-install-the-script)
- [Alternative: the website (file import)](#alternative-the-website-file-import)
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
| **Shelf of Shame** | Your unread books drawn as spines on a bookcase. Thicker books get wider spines. Hover a spine to see the title, author and page count. |
| **Shame stats** | Money spent on unread books, hours of reading waiting on the shelf, the date you'd finish everything at your daily pace, your oldest unread book, and books added vs. finished in the last 12 months. |
| **Breakdowns** | Books by status, books added per year, and your most-owned authors with how many of theirs are unread. |
| **Your library** | A searchable, sortable table of every book. Change a status right in the table, or click a title to edit it. |

Statuses are **Unread**, **Reading**, **Finished** and **Gave up**. Only **Unread** books go on the Shelf of Shame.

---

## Two ways to use it

| | **Automatic sync (recommended)** | Website |
| --- | --- | --- |
| Install anything? | Tampermonkey browser extension, once | No |
| How books get in | Syncs by itself from Goodreads and your Kindle library | You export and import files |
| Read status | Pulled from your Goodreads shelves every time you open it | From a Goodreads CSV, or set by hand |
| Where it lives | goodreads.com/kindle-calculator | bookshelf.kirbee213.tv |
| Works on phones | No (desktop browsers only) | Yes |

Use the automatic sync if you can. Use the website on a phone, or if you'd rather not install an extension.

---

## Main way: automatic sync (Tampermonkey)

Everything below happens without any files. You never export, download or upload anything.

### Install (one time)

1. Install **Tampermonkey** from your browser's extension store (Chrome Web Store, Edge Add-ons or Firefox Add-ons).
2. **Chrome and Edge only:** go to `chrome://extensions` (or `edge://extensions`), click **Details** on Tampermonkey and turn on **Allow User Scripts**. On older versions, turn on **Developer mode** at the top right of the extensions page instead. Without this, the script installs but never runs.
3. Open [`kindle-library-calculator.user.js`](kindle-library-calculator.user.js) in this repo and click **Raw**. Tampermonkey opens an install page. Click **Install**.

You can also copy the file's contents, open the Tampermonkey dashboard, click the **+** tab, paste and press **Ctrl+S**.

### Updating

Repeat step 3 with the new version. Your books and settings are kept.

---

## What happens after you install the script

The script only runs on two sites: **goodreads.com** and **read.amazon.com/kindle-library**. It does nothing anywhere else.

### 1. Visit your Kindle library once

Go to **https://read.amazon.com/kindle-library** while signed in.

- A small dark box appears in the bottom-right corner: **"Syncing your Kindle library… 150 books"**.
- It reads your full library list in pages of 50. It only reads, and never changes anything in your Amazon account.
- When it's done the box says **"Kindle library synced: 597 books. Open calculator"**.
- The list is saved inside Tampermonkey so the calculator can use it later.
- If you come back within 10 minutes, it reuses the last sync instead of fetching again.

Do this again whenever you've bought new books. UK, Canada and Australia Kindle sites work too.

### 2. Open the calculator

Click **Open calculator** in that box, click the **Shelf of Shame** button that now sits in the bottom-right corner of every Goodreads page, or go straight to:

**https://www.goodreads.com/kindle-calculator**

That address is normally a Goodreads "page not found" page. The script replaces it with the calculator.

### 3. It syncs automatically

As soon as the calculator opens, it:

1. **Finds your Goodreads account** from the site header (you need to be signed in).
2. **Reads three shelves**: to-read, currently-reading and read. The status line under the title shows progress, for example *Reading your Goodreads "read" shelf…*
3. **Loads the Kindle list** saved in step 1.
4. **Matches the two** (see the next section) and updates the numbers, charts and Shelf of Shame.
5. **Saves everything** in Tampermonkey's storage for next time.

When it's finished the status line reads something like:

> Synced 11:20 AM · Goodreads 412 books, 380 matched · Kindle 597 books (from 9/30/2026)

Press **Sync now** at any time to pull the latest shelves again.

### Day to day

1. After you buy Kindle books, visit **read.amazon.com/kindle-library** once so the new ones are picked up.
2. Open **goodreads.com/kindle-calculator** or click the **Shelf of Shame** button on any Goodreads page. It syncs your shelves automatically.

That's it. Mark books as read on Goodreads the way you normally would, and the calculator follows along.

### What you end up with

- **Your Kindle books** are the library. That's what you own.
- **Goodreads** supplies what you've done with them: status, rating and page count.
- **Kindle books with no Goodreads match** stay Unread and sit on the Shelf of Shame.
- **Goodreads-only books** (paper copies, library loans) are left out, unless you turn on *Include Goodreads books that aren't in my Kindle library* in Settings.
- **No Kindle list yet?** Your Goodreads books are used as the whole library instead.

---

## Alternative: the website (file import)

Use this version on a phone, or if you don't want to install Tampermonkey. A regular website isn't allowed to read your Amazon or Goodreads account, so here you bring your books in as files.

Open **https://bookshelf.kirbee213.tv**. You'll see an example library of public-domain classics first. It disappears as soon as you import your own books or click **Start empty**.

Click **Import library** and choose a tab:

### Kindle library (console script)

Gets the list of every Kindle book you own.

1. On a computer, open **https://read.amazon.com/kindle-library** and sign in.
2. Press **F12** and click the **Console** tab.
3. In the calculator's Import window, click **Copy script**, paste it into the console and press **Enter**.
   - Chrome may ask you to type `allow pasting` first. Type it, press Enter, then paste again.
4. The console counts up as it reads your library ("Fetched 50 books… 100 books…"). When it finishes it:
   - copies the data to your clipboard, and
   - downloads **kindle-library.json** to your Downloads folder.
5. Back in the calculator, paste into the box (or drop in the file) and click **Import**.

> Amazon's library list does **not** include how far you've read, so every Kindle book comes in as Unread. Import your Goodreads shelves on top (below) or mark books by hand to fix that.

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

Any spreadsheet saved as CSV works if the first row has column names. Recognised columns: `title`, `author`, `asin`, `pages`, `price`, `date`, `status`, `progress`, `rating`, `source`. Backup files from the **Back up** button go here too.

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
| Pages you read per day | 30 | Used to work out when you'd clear the shelf. |
| Currency | USD | How money is displayed. |
| Finished when progress reaches % | 90 | Kindle books rarely hit 100% because of back matter. |
| Count Kindle Unlimited, Prime and borrowed books | Off | Borrowed books aren't yours, so they're left out of totals by default. |
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

## Backing up and moving to another computer

Your library lives in the browser you used. Clearing browser data, switching browsers or changing computers starts you over. To keep it:

1. Click **Back up**. A file like `kindle-library-2026-09-30.json` downloads.
2. On the other computer or browser, open the calculator, click **Import**, choose **Any CSV / backup** and drop in the file.

The automatic-sync version and the website store data separately. A backup from one imports into the other.

---

## Troubleshooting

**Nothing happens on Goodreads or Amazon after installing the script.**
Turn on **Allow User Scripts** (or Developer mode) for Tampermonkey in Chrome/Edge, then reload the page. Check that the Tampermonkey icon shows the script as enabled.

**"Sign in to Goodreads first, then press Sync now."**
Sign in to goodreads.com, open any Goodreads page once, then go back to the calculator and press **Sync now**.

**"Goodreads failed: …" in the status line.**
Goodreads may be slow or may have changed its pages. Press **Sync now** again. If it keeps failing, use the Goodreads CSV export in **Import file** instead.

**"Couldn't read your Kindle library (HTTP 401/403)."**
Your Amazon sign-in has expired. Sign in at read.amazon.com and reload the Kindle library page.

**Every book shows as Unread.**
That's expected from the Kindle list on its own. Amazon doesn't share reading progress there. Sync Goodreads or mark books by hand.

**A book I've read is still on the Shelf of Shame.**
It didn't match between Kindle and Goodreads. Set its status in the table and it stays that way.

**The console script says `allow pasting`.**
Chrome's safety check. Type `allow pasting`, press Enter, then paste the script again.

**The example library won't go away.**
Click **Start empty** or import something. The example books are never saved.

---

## Known limits

- The Kindle sync uses the same unofficial library list that Amazon's own Kindle website uses. Amazon can change it without notice. If it breaks, the Goodreads sync and the file imports still work.
- Kindle reading progress isn't available from Amazon's library list.
- Page counts and prices are estimates unless Goodreads, an Amazon orders file, or you provide them.
- Book covers aren't shown.
- The Tampermonkey version works in desktop browsers only.

---

## Files in this repo

| File | What it is |
| --- | --- |
| `index.html` | The website version, served at bookshelf.kirbee213.tv |
| `BookshelfCalc/index.html` | The same page, for use at a `/BookshelfCalc` path |
| `kindle-library-calculator.user.js` | The Tampermonkey version with Goodreads and Kindle sync |
| `CNAME` | Tells GitHub Pages to use bookshelf.kirbee213.tv |
| `README.md` | This file |
