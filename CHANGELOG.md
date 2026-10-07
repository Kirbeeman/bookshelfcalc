# Shelf of Shame changelog

Newest first. The latest release is described in full; earlier ones are listed by title.

---

## v2.1.1.0 (latest)

**Signed code, and a truer, tidier shelf**

Security:
- **Signed code.** The phone sync bookmark and the sync script now only run code signed with Daniel's signing key, and only if every byte matches what was signed. Someone who broke into the website or its GitHub repository still couldn't make either one run their own code. Set up the phone bookmark once more (**Settings › Set up the bookmark**); the old one keeps working for now and shows a note asking you to. The sync script updates once more through Tampermonkey and from then on fetches signed updates by itself.
- Every page carries a **Content Security Policy**, so your browser only runs the Shelf of Shame's own code and Google's sign-in, and only connects to this site, Google Fonts and Google Drive.
- A one-time notice explains the change the first time you open this version.

The shelf and the numbers:
- On a computer, the bookcase holds **up to 100 unread books on at most 3 shelves**, with thinner spines when it needs them and room kept for the bookend and decorations.
- **Truer numbers:** shares near 0% or 100% keep a decimal (99.5%, never a rounded-up 100%), dictionaries that came with a Kindle and books returned to Amazon are left out of the totals, and the oldest-unread card never names a dictionary.
- New wording when you've barely started your library ("You've barely cracked a spine"), or not started it at all.
- Status dots in the same **green, yellow and red** in every theme, the Google Drive problem line reads "There is a problem with the sync. Tap to retry.", and the year chart loses the little arrows that looked like 1s.
- A **getting-started guide for every device** at bookshelf.kirbee213.tv/help.

---

## Earlier versions

- **v2.0** Shelf of Shame, phones, Google Drive and truer numbers
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
