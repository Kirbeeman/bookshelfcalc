# Kindle Library Calculator: User guide

Everything the calculator does, and how. For setup, see the [README](README.md). For what changed recently, see the [changelog](CHANGELOG.md).

## Contents

- [The page at a glance](#the-page-at-a-glance)
- [The Shelf of Shame](#the-shelf-of-shame)
- [Statuses, stalled books and DNF](#statuses-stalled-books-and-dnf)
- [Genres](#genres)
- [How syncing works](#how-syncing-works)
- [How Kindle and Goodreads books are matched](#how-kindle-and-goodreads-books-are-matched)
- [Without the script: file import](#without-the-script-file-import)
- [Your library table](#your-library-table)
- [Settings](#settings)
- [Backing up and moving to another computer](#backing-up-and-moving-to-another-computer)
- [Troubleshooting](#troubleshooting)
- [Known limits](#known-limits)

---

## The page at a glance

| Part | What it shows |
| --- | --- |
| **Sync** | A box under the title showing each sync step with its own progress bar. Click it to fold it to one line; it folds itself after a clean sync. |
| **Books** | How many books you own and how many you've finished. Point at "not counted" to see which books are left out of totals (shared, borrowed, Kindle Unlimited, samples). |
| **Library value** | Hidden until you click it. Point at the line under it to see where the total comes from: prices you paid, today's Kindle prices, guesses, and free books. |
| **Time to read it all** | Hours of reading left, with a small table: whole library, still to read, and how long that takes at your pace. |
| **Unread** | The percent of your library you've never opened. |
| **Shelf of Shame** | Your unread books as spines on a bookcase (see below). |
| **Shame stats** | Money spent on unread books, reading hours on the shelf, the date you'd finish at your pace, your oldest unread book and how long it has waited, and books added vs. finished in the last 12 months. |
| **By status** | Books and pages for each status, plus spending, free/KU/Prime books and your average rating. |
| **Books added per year** | Bars by purchase year, split by status. Unusually big years are cut off so the rest stay readable (the number above is exact). Below it, rings show the reading-status split; point at a year to see that year's. |
| **Most-owned authors** | Your top authors and how many of their books are unread. |
| **Your library** | Every book in a searchable, sortable table. |

**Reading pace.** The Slow, Average and Fast buttons (35, 55 and 90 pages a day) change the finish date and "at your pace" figures. Any other number can be typed in Settings.

---

## The Shelf of Shame

- Up to **100 unread books** drawn as spines. Thicker books get wider spines. Point at a spine for its title, author, pages and genre.
- **Just bought:** books bought in the last 5 days are outlined in gold and placed first, with a *new* tag in the library table.
- **Spine color:** switch between **Default** (mixed book-cloth colors) and **By genre**. By genre turns the shelf into a chart: the spines are split between genres in proportion to your unread books, with a key underneath.
- **Piles:** now and then two or three books lie flat in a small pile, spines out. Just-bought books always stand upright.
- **Decorations:** whatever space is left on the last shelf gets a bookend and a few knick-knacks that match your theme (plants, a vase with a flower, book stacks and a little box, or pumpkins and potions). More space means more of them. With Default spine colors, a small one also sits between books every couple of dozen spines.

---

## Statuses, stalled books and DNF

Statuses are **Unread**, **Reading**, **Finished** and **DNF** (Did Not Finish). Only Unread books go on the shelf.

A book marked **Reading** for more than a year is **stalled**: it gets a *stalled 1 yr+* tag, its own filter under Your library, and a link in the shame stats. Mark each one Finished, or DNF if you've given up. The clock starts when you set a book to Reading; books that were already Reading count from their purchase date.

---

## Genres

Genres are Amazon's own, read from each book's Amazon page by the sync script:

- The genre is the main category in the book's Kindle Store trail (like *Kindle eBooks › Romance › Paranormal*). When that only says *Literature & Fiction* (Amazon's catch-all), a more specific genre further down the trail or in the book's best-seller lists is used.
- Amazon files Fantasy and Science Fiction together; the calculator separates them using the next step of the trail.
- **Second genre:** when Amazon also lists a book under another genre, it gets a second one. A Fantasy book listed under *Fantasy Romance* is **Fantasy + Romance**. In **By genre** mode the second genre shows as two bands in its color across the spine.
- **Tags:** every category Amazon lists the book under (like *Fantasy Romance* or *Epic Fantasy*) shows as a tag under the title in Your library.
- **Point at a spine** to see both genres and the first few tags.
- These get their own color: Romance, Fantasy, Science Fiction, Mystery, Thriller & Suspense, Horror, Erotica, Literature & Fiction, Teen & Young Adult, Comics, Manga & Graphic Novels, Humor & Entertainment, Cookbooks, Food & Wine, Self-Help and History. Everything else is **Other** but keeps its real name (point at Other in the key).
- To fix a genre, click the book's title and pick a **Genre** and **Second genre** (or None). Your choices are never overwritten.

---

## How syncing works

The script uses your existing sign-ins in the same browser. It only reads; it never changes anything in your Amazon or Goodreads account. The first time, Tampermonkey may ask to let it connect to goodreads.com and amazon.com: choose **Always allow**.

Each sync:

1. **Goodreads** (optional): your to-read, currently-reading and read shelves.
2. **Kindle library** from read.amazon.com, reused for up to 6 hours (**Sync now** always gets a fresh copy). If the Kindle reader isn't signed in, your books come from Amazon's Content & Devices list instead, and a tip says how to add the Kindle reader.
3. **Purchase dates** from Amazon's Content & Devices page (once a day, or on **Sync now**). Kindle's own **Mark as read** counts as Finished.
4. **Prices paid** (before tax) from your order pages: up to 150 orders per sync, one at a time with a short pause, so big libraries fill in over a few syncs. If Amazon pushes back, it stops and continues next time. Shared, free and Kindle Unlimited books have no order to read.
5. **Book details**, in the background, about one book a second (unread first): genre, second genre and tags, page count (when you don't already have one) and today's Kindle price (for books without a price paid; rechecked monthly, shown as **now $5.99**).

Library value uses: price you paid → today's Kindle price → the guess from Settings.

> **The first scan of a big library takes a while:** roughly 10 minutes per 600 books. You can keep using the page, and if you close it the scan picks up where it left off. After that, only new books are read.

**What you end up with:** your Kindle books are the library. Goodreads adds status, rating and page count. Kindle books with no Goodreads match stay Unread. Goodreads-only books (paper copies, library loans) are left out unless you turn on *Include Goodreads books that aren't in my Kindle library* in Settings.

**Extras:** a Shelf of Shame button appears on Goodreads pages, and visiting read.amazon.com/kindle-library refreshes the Kindle list right away (UK, Canada and Australia sites work too).

---

## How Kindle and Goodreads books are matched

Each Goodreads book is compared with your Kindle books by:

1. **ASIN**, when both have one.
2. **Title and the author's last name.** Series tags like *(Stormlight Archive, #1)*, subtitles, a leading *The/A/An* and punctuation are ignored, and *"Sanderson, Brandon"* becomes *Brandon Sanderson*.
3. **Title alone**, if only one book has that title and the authors don't conflict.

If a book you've read stays Unread, its title or author is probably very different on the two sites. Set the status by hand; it stays that way.

---

## Without the script: file import

For phones, or if you'd rather not install anything. Open **Settings → Import a file** and pick a tab:

- **Goodreads:** on goodreads.com, **My Books → Import and export → Export library**, then drop the CSV in. Shelves become statuses; ratings, page counts and dates come across. Tick *Only import Kindle editions* to skip paper books.
- **Amazon orders:** request your data at amazon.com/hz/privacy-central/data-requests (Kindle / digital orders). When it arrives (days or weeks), drop in the digital orders CSV to add prices and purchase dates.
- **Any CSV or a backup:** any CSV with a header row. Recognised columns: `title`, `author`, `asin`, `pages`, `price`, `date`, `status`, `progress`, `rating`, `source`.

Imports **merge** into your library; tick *Replace my current library* to start fresh. The example library disappears once you import or click **Start empty**.

---

## Your library table

- **Search** by title or author, **sort** by any column, and **filter** with the buttons above the table (Shelf of Shame, Reading, Finished, DNF, Stalled, Not counted).
- Each book shows its genres and tags under the title. **Click a tag**, or pick one from the **All tags** dropdown, to see only those books; click it again to clear.
- **Change a status** with the dropdown. **Click a title** to edit everything about a book, or delete it. **Add book** adds one by hand.
- Anything you set by hand is **locked**: syncs and imports never overwrite it.
- **Export spreadsheet** downloads an Excel file of every book with filters on every column. It's a copy to look at; to move your library, use a backup.

---

## Settings

- **Theme:** Default (follows your device's light/dark mode), Cozy (warm, lamp-lit library), Zon (online bookstore), Halloween, or Light (always light).
- **Sync script and updates:** shows your script version, an **Update** button when one is waiting, and **What's new**.

| Setting | Default | What it does |
| --- | --- | --- |
| Pages to assume when unknown | 320 | Used until Amazon, Goodreads or you supply a page count. |
| Price to assume when unknown | $7.99 | Used for value when no price is known. Shown as `~$7.99`. |
| Minutes per page | 1.1 | Drives every reading-time figure. |
| Pages you read per day | 55 | Your pace; also set by the Slow/Average/Fast buttons. |
| Currency | USD | How money is shown. |
| Finished when progress reaches % | 90 | Kindle books rarely reach 100% because of back matter. |
| Count Kindle Unlimited, Prime, borrowed and family-shared books | Off | Books you didn't buy are left out of totals unless this is on. |
| Show shared and borrowed books on their own tab | Off | Splits Your library into **My books** and **Shared & borrowed**. Totals don't change. |
| Count samples | Off | Samples are left out unless this is on. |
| Include Goodreads books that aren't in my Kindle library | Off | Adds Goodreads-only books to the library. |

- **Files and backups:** **Import a file** and **Back up library**.
- **Delete all books** clears your library (click twice to confirm).

---

## Backing up and moving to another computer

Your library lives in the browser you used. Clearing browser data, or using another browser or computer, starts empty. To move it:

1. **Settings → Back up library** downloads a file like `kindle-library-2026-10-02.json`.
2. On the other browser: **Settings → Import a file → Any CSV / backup**, and drop the file in.

---

## Troubleshooting

**The site doesn't find the script.** Check that **Allow User Scripts** (or Developer mode) is on for Tampermonkey, and that the script is switched on in Tampermonkey's menu. Then reload. **Settings → Set up sync** walks through it again.

**"Update needed" won't go away.** Press **Update** in the Tampermonkey tab that opened, then come back. If no tab opened: Tampermonkey icon → **Utilities** → **Check for userscript updates**, then reload.

**"Amazon wants your password again for Content & Devices."** Amazon asks for your password again on its Content & Devices page every so often, even while the rest of amazon.com shows you signed in. Follow the link in the message, sign in if it asks, then press **Retry**. Purchase dates and prices paid both come from that page.

**Kindle library says to sign in to read.amazon.com.** The Kindle reader has its own sign-in. Open read.amazon.com once in the same browser, sign in, then press **Sync now**. Your books still load from Content & Devices in the meantime.

**"Sign in to amazon.com."** Sign in at amazon.com in the same browser, then **Retry**. If you blocked Tampermonkey from connecting to amazon.com, allow it under the script's **Settings → XHR Security** in the Tampermonkey dashboard.

**Goodreads shows "not linked".** That's optional. Sign in to goodreads.com in the same browser if you want your read shelf included.

**"…is having trouble right now."** Amazon or Goodreads was briefly unavailable. Nothing to fix; it's picked up next sync, or press **Retry**.

**A book I've read is on the Shelf of Shame.** It didn't match between Kindle and Goodreads, or you haven't marked it read anywhere. Set its status by hand.

**The example library won't go away.** Click **Start empty** or import something. Example books are never saved.

---

## Known limits

- The Kindle sync uses the same unofficial lists Amazon's own websites use. Amazon can change them without notice; if that happens, file import still works.
- Page counts and prices are estimates unless Amazon, Goodreads or you provide them.
- Book covers aren't shown.
- The sync script needs a computer browser. On phones, use file import.
