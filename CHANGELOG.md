# Shelf of Shame changelog

Newest first. The latest release is described in full; earlier ones are listed by title.

---

## v2.0 (latest)

**Shelf of Shame: phones, Google Drive and truer numbers**

Everything tested on the beta site goes live.

- **New name and look.** The calculator is now **Shelf of Shame**, with its own icon (a book with its price tag still on; a jack-o'-lantern book in the Halloween theme) and link previews when you share the site.
- **New theme: Fruit.** Frosted glass panels over a soft, colorful background, following your device's light or dark setting. iPhones, iPads and Macs start in Fruit until you pick a theme.
- **Phones and iPads, nothing to install.** A **Shelf sync** bookmark reads your books, purchase dates and prices on amazon.com and sends them to the page. One tap on **Set up the bookmark** copies it and walks you through saving it. A [getting-started guide](https://bookshelf.kirbee213.tv/help) covers every device, and there's a step-by-step [iPhone and iPad guide](https://bookshelf.kirbee213.tv/ioshelp).
- **Google Drive (optional).** Keep your library in one file in your own Drive, so your phone and computers show the same books. Changes made on each are merged book by book.
- **Truer numbers.** Computers now build your library from Amazon's Content & Devices list, like phones, so prices paid land on the right books. Dictionaries and user guides that came with your Kindle are left out (a Settings checkbox counts them), books with no order behind them count as free, and a book that was listed twice is folded into one.
- **Settings** shows which version of the app and the sync script you have, and closes when you click outside it.
- **Smaller things:** genres guessed from titles when Amazon has no page, a 15-book shelf on phones, faster on big libraries, cleaner titles (no more `&amp;`), and the oldest unread book named first.
- **The sync script also runs in Userscripts**, the free script app for iPhone, iPad and Mac, as well as Tampermonkey.

**This release needs a script update.** The page asks for it the first time you open it. If Tampermonkey then lists both "Kindle Library Calculator" and "Shelf of Shame", delete "Kindle Library Calculator". Your library on this site isn't touched. Libraries kept on the beta site stay there; to bring one over, connect Google Drive on both, or use **Back up library** and **Import a file**.

---

## Earlier versions

- **v1.52** Behind-the-scenes cleanup
- **v1.51** Version numbers in Settings, and click outside to close
- **v1.50** This year so far, and a clearer By status card
- **v1.49** No more candles on the shelf
- **v1.48** Clearer purchase-date sign-in, Settings dot, flower in the vase
- **v1.47** Second genres, tags and a new bookcase look
- **v1.46** Required script updates block the page until updated
- **v1.45** Optional "Shared & borrowed" tab under Your library
- **v1.44** Fantasy and Science Fiction as separate genres
- **v1.43** Sign-in step in setup; library loads from Content & Devices when the Kindle reader isn't signed in; Goodreads shown as optional; clearer oldest-unread figure
- **v1.42** Shelf decorations rest on the shelf; potion stands; softer candle glow
- **v1.41** Bookend and theme knick-knacks fill the empty end of the shelf
- **v1.40** Halloween theme; Zon looks more like an online bookstore
- **v1.39** Themes in Settings: Default, Cozy, Zon and Light
- **v1.38** "Time to read it all" as a small table, hours left first
- **v1.37** Amazon's own genres with sub-genres; paranormal romance no longer counted as Horror
- **v1.36** Sync box folds to one line, and folds itself after a clean sync
- **v1.35** Prices paid fill in faster: up to 150 orders per sync, paced
- **v1.34** Setup walkthrough, sync progress box, updates in Settings, Library value breakdown
- **v1.33** No console script; Import and Back up moved into Settings
- **v1.32** Just-bought books lead the shelf in genre mode too
- **v1.31** Reading-status rings under Books added per year
- **v1.30** Books per year as bars, with unusually tall years cut off
- **v1.29** Smoother "Books added per year" chart
- **v1.28** "Free, KU and Prime" label back in By status
- **v1.27** Clearer "By status" card
- **v1.26** The page says so when the sync script isn't running
- **v1.25** DNF status, and flags for books stalled over a year
- **v1.24** Note that the first genre scan takes a while on big libraries
- **v1.23** 100-book shelf; "By genre" turns the shelf into a proportional chart
- **v1.22** Genres and page counts from Amazon
- **v1.21** Hover explanation for "not counted" books
- **v1.20** Finish-date quip changes on each visit
- **v1.19** The site tells you when your sync script is out of date
- **v1.18** "Good, not perfect" note and a friendlier finish date
- **v1.17** Reading pace buttons: Slow, Average, Fast
- **v1.16** Chart and library counts agree
- **v1.15** Prices paid are kept and never looked up again
- **v1.14** Today's Kindle price for books without a known price paid
- **v1.13** Fix: prices not loading after updating from 1.9–1.11
- **v1.12** Real prices paid from Amazon order pages
- **v1.11** Export the library as a sortable spreadsheet
- **v1.10** Family Library books counted as shared, not bought
- **v1.9** Real purchase dates from Amazon's Content & Devices page
- **v1.8** Spine color option: Default or By genre
- **v1.7** Fix: oldest-unread figure ignores guessed dates
- **v1.6** Titles centered on the spines
- **v1.5** Example library shows the "just bought" highlight
- **v1.4** Books bought in the last 5 days highlighted on the shelf
- **v1.3** Read and unread shown in Books added per year
- **v1.2** Sync works without opening Goodreads or the Kindle site first
- **v1.1** Sync script updates itself; library kept between visits
- **v1.0** First release: calculator, Shelf of Shame, and Goodreads and Kindle sync
