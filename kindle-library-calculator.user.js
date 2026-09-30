// ==UserScript==
// @name         Kindle Library Calculator
// @namespace    kindle-library-calculator
// @version      1.0
// @description  Library value, reading time and a pile of shame for your Kindle books, kept in sync with your Goodreads shelves.
// @match        https://www.goodreads.com/*
// @match        https://read.amazon.com/kindle-library*
// @match        https://read.amazon.co.uk/kindle-library*
// @match        https://read.amazon.ca/kindle-library*
// @match        https://read.amazon.com.au/kindle-library*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
'use strict';
const CALC_URL = 'https://www.goodreads.com/kindle-calculator';
const onKindle = /^read\.amazon\./.test(location.hostname);
const onCalc = location.hostname === 'www.goodreads.com' && location.pathname.replace(/\/$/, '') === '/kindle-calculator';

function badge(html) {
  GM_addStyle(`#klc-badge{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#1b1e20;color:#f2f2ee;font:600 13px/1.4 system-ui,sans-serif;padding:10px 14px;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.25);max-width:320px}#klc-badge a{color:#9fb0ff;text-decoration:underline}#klc-badge button{all:unset;cursor:pointer;margin-left:10px;opacity:.6}`);
  let el = document.getElementById('klc-badge');
  if (!el) { el = document.createElement('div'); el.id = 'klc-badge'; document.body.appendChild(el); }
  el.innerHTML = html + '<button aria-label="Close">×</button>';
  el.querySelector('button').onclick = () => el.remove();
}

// ---- 1. On the Kindle library page: quietly read the library list and cache it for the calculator ----
if (onKindle) {
  (async () => {
    const last = JSON.parse(GM_getValue('kindle', 'null') || 'null');
    if (last && Date.now() - last.time < 10 * 60 * 1000) { badge(`Kindle library synced (${last.items.length} books). <a href="${CALC_URL}">Open calculator</a>`); return; }
    badge('Syncing your Kindle library…');
    const items = []; let token = '';
    try {
      for (let page = 0; page < 400; page++) {
        const r = await fetch('/kindle-library/search?query=&libraryType=BOOKS&sortType=recency&querySize=50' + (token ? '&paginationToken=' + encodeURIComponent(token) : ''), {credentials:'include'});
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        for (const b of j.itemsList || []) items.push({asin:b.asin, title:b.title, authors:b.authors, percentageRead:b.percentageRead, originType:b.originType, resourceType:b.resourceType});
        badge(`Syncing your Kindle library… ${items.length} books`);
        if (!j.paginationToken) break;
        token = j.paginationToken;
      }
      GM_setValue('kindle', JSON.stringify({time: Date.now(), items}));
      badge(`Kindle library synced: ${items.length} books. <a href="${CALC_URL}">Open calculator</a>`);
    } catch (e) {
      badge(`Couldn't read your Kindle library (${e.message}). Reload the page to try again.`);
    }
  })();
  return;
}

// Remember the signed-in Goodreads user id (read from the site header) for the calculator
const me = document.querySelector('header a[href*="/user/show/"], nav a[href*="/user/show/"], a[href*="/user/show/"]');
const meId = me && (me.getAttribute('href').match(/\/user\/show\/(\d+)/) || [])[1];
if (meId) GM_setValue('grUser', meId);

// ---- 2. Anywhere else on Goodreads: a small link to the calculator ----
if (!onCalc) {
  GM_addStyle(`#klc-open{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#1b1e20;color:#f2f2ee!important;font:600 13px/1 system-ui,sans-serif;padding:10px 14px;border-radius:8px;text-decoration:none!important;box-shadow:0 4px 18px rgba(0,0,0,.25)}#klc-open:hover{background:#27408b}`);
  const a = document.createElement('a'); a.id = 'klc-open'; a.href = CALC_URL; a.textContent = "Shelf of Shame";
  document.body.appendChild(a);
  return;
}

// ---- 3. goodreads.com/kindle-calculator: replace Goodreads' "not found" page with the calculator ----
document.title = 'Kindle Library Calculator';
document.querySelectorAll('link[rel="stylesheet"], style').forEach(n => n.remove());
const font = document.createElement('link'); font.rel = 'stylesheet';
font.href = 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,800&family=JetBrains+Mono:wght@400;600&display=swap';
document.head.appendChild(font);
document.body.removeAttribute('class');
document.body.removeAttribute('style');
document.body.innerHTML = `<div class="wrap">
  <header class="top">
    <div class="brand">
      <h1>Kindle Library Calculator</h1>
      <div class="store demo" id="store"><i></i><span>Example library</span></div>
      <div class="store" id="sync"><span>Not synced yet</span></div>
    </div>
    <div class="actions">
      <button class="btn primary" id="btnSync">Sync now</button>
      <button class="btn" id="btnImport">Import file</button>
      <button class="btn" id="btnAdd">Add book</button>
      <button class="btn" id="btnSettings">Settings</button>
      <button class="btn" id="btnExport">Back up</button>
    </div>
  </header>

  <div class="banner" id="demoBanner">
    <p><strong>This is an example library</strong> of public-domain classics so you can see how it works. Syncing your Goodreads shelves replaces it. Visit read.amazon.com/kindle-library once so your Kindle books get picked up too.</p>
    <div class="row"><button class="btn primary" id="bannerImport">Sync now</button><button class="btn" id="bannerEmpty">Start empty</button></div>
  </div>

  <section class="tiles" aria-label="Library summary">
    <div class="tile"><h3>Books</h3><div class="big" id="tBooks">0</div><div class="sub" id="tBooksSub"></div></div>
    <div class="tile"><h3>Library value</h3><button type="button" class="reveal" id="revealValue" aria-pressed="false"><span class="big" id="tValue">$0</span><span class="sub" id="tValueSub"></span><span class="hint" id="revealHint">Click to reveal</span></button></div>
    <div class="tile"><h3>Time to read it all</h3><div class="big" id="tHours">0 h</div><div class="sub" id="tHoursSub"></div></div>
    <div class="tile shame"><h3>Unread</h3><div class="big" id="tUnread">0%</div><div class="sub" id="tUnreadSub"></div></div>
  </section>

  <section class="pile" aria-labelledby="pileH">
    <div>
      <div class="pile-head"><h3>Shelf of Shame</h3><h2 class="pile-title" id="pileH">0 unread books</h2></div>
      <div id="stack"></div>
    </div>
    <div class="pile-facts">
      <p class="verdict" id="verdict"></p>
      <div>
        <div class="meter" id="meter" aria-hidden="true"></div>
        <div class="legend" id="meterLegend" style="margin-top:8px"></div>
      </div>
      <div class="facts">
        <div class="fact"><button type="button" class="reveal" data-reveal><span class="v" id="fValue">$0</span></button><span class="l">spent on books you haven't opened</span></div>
        <div class="fact"><span class="v" id="fHours">0 h</span><span class="l">of reading sitting on the shelf</span></div>
        <div class="fact"><span class="v" id="fClear">—</span><span class="l" id="fClearL">shelf cleared at your pace</span></div>
        <div class="fact"><span class="v" id="fOldest">—</span><span class="l" id="fOldestL">oldest unread book</span></div>
        <div class="fact"><span class="v" id="fReading">0</span><span class="l">started but not finished</span></div>
        <div class="fact"><span class="v" id="fRate">—</span><span class="l">bought vs finished, last 12 months</span></div>
      </div>
    </div>
  </section>

  <section class="grid3">
    <div class="card"><h3>By status</h3><div class="statlist" id="statusList"></div></div>
    <div class="card"><h3>Books added per year</h3><div class="bars" id="years"></div><div class="legend" id="yearLegend"></div></div>
    <div class="card"><h3>Most-owned authors</h3><div class="authors" id="authors"></div></div>
  </section>

  <section class="shelf" aria-labelledby="shelfH">
    <div class="toolbar">
      <h2 id="shelfH">Your library</h2>
      <input type="search" id="q" placeholder="Search title or author" aria-label="Search">
    </div>
    <div class="chips" id="chips"></div>
    <div class="tablewrap">
      <table>
        <thead><tr>
          <th><button data-k="title">Title</button></th>
          <th><button data-k="status">Status</button></th>
          <th><button data-k="progress">Progress</button></th>
          <th class="r"><button data-k="pages">Pages</button></th>
          <th class="r"><button data-k="price">Price</button></th>
          <th><button data-k="date">Added</button></th>
          <th><button data-k="rating">Rating</button></th>
        </tr></thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
    <button class="btn showmore" id="showMore" hidden>Show more</button>
  </section>
</div>

<!-- Import -->
<dialog id="dlgImport">
  <form class="dlg" method="dialog" id="importForm">
    <div class="dlg-head"><h2>Import your books</h2><button class="x" value="cancel" aria-label="Close">×</button></div>
    <div class="tabs" role="tablist" id="impTabs">
      <button type="button" class="tab" role="tab" data-t="kindle" aria-selected="true">Kindle library</button>
      <button type="button" class="tab" role="tab" data-t="goodreads" aria-selected="false">Goodreads</button>
      <button type="button" class="tab" role="tab" data-t="amazon" aria-selected="false">Amazon orders</button>
      <button type="button" class="tab" role="tab" data-t="csv" aria-selected="false">Any CSV / backup</button>
    </div>
    <div data-p="kindle">
      <ol class="steps">
        <li>On a computer, open <strong>read.amazon.com/kindle-library</strong> in Chrome, Edge or Firefox and sign in.</li>
        <li>Open the developer console (F12, then the Console tab). Paste the script below and press Enter.</li>
        <li>It walks your whole library, copies the result and saves <span class="num">kindle-library.json</span>. Paste it below or drop the file in.</li>
      </ol>
      <div class="code" style="margin-top:12px"><pre id="snippet"></pre><button type="button" class="btn small" id="copySnippet">Copy script</button></div>
      <p class="note" style="margin-top:8px">The script only reads your own library list, including how far you've read each book, which is how unread books are found automatically. It uses an unofficial Amazon page, so if it stops working, use the Goodreads or CSV route.</p>
      <p class="note" style="margin-top:8px"><strong>Purchase dates from the Kindle app:</strong> if you use Kindle for PC, drop in <span class="num">KindleSyncMetadataCache.xml</span> from <span class="num">%LOCALAPPDATA%\\Amazon\\Kindle\\Cache</span> (paste that into the File Explorer address bar). It adds the date you bought each book.</p>
    </div>
    <div data-p="goodreads" hidden>
      <ol class="steps">
        <li>On goodreads.com go to <strong>My Books → Import and export → Export library</strong>.</li>
        <li>Download the CSV and drop it here. Shelves map to status: to-read is unread, currently-reading is reading, read is finished.</li>
      </ol>
      <label class="check" style="margin-top:10px"><input type="checkbox" id="grKindleOnly"> Only import Kindle editions</label>
    </div>
    <div data-p="amazon" hidden>
      <ol class="steps">
        <li>Request your data at <strong>amazon.com/hz/privacy-central/data-requests</strong> (choose Kindle / Digital orders).</li>
        <li>When the email arrives, unzip it and find the digital orders CSV (for example <span class="num">Digital Items.csv</span>).</li>
        <li>Drop it here. Prices and purchase dates get matched onto books you already imported by ASIN or title.</li>
      </ol>
    </div>
    <div data-p="csv" hidden>
      <p class="note" style="font-size:.88rem">Any CSV with a header row works. Recognised columns: <span class="num">title, author, asin, pages, price, date, status, progress, rating, source</span>. Status can be unread, reading, finished or abandoned. A backup file from this page also goes here.</p>
    </div>
    <div class="drop" id="drop">Drop a .json, .csv or .xml file here, or <label style="color:var(--accent);cursor:pointer;text-decoration:underline">choose a file<input type="file" id="file" accept=".json,.csv,.txt,.xml,text/csv,application/json,text/xml" hidden></label></div>
    <textarea id="paste" placeholder="…or paste the copied data here"></textarea>
    <label class="check"><input type="checkbox" id="replace"> Replace my current library instead of merging</label>
    <div class="dlg-foot"><span class="result" id="impResult"></span><button type="button" class="btn primary" id="doImport">Import</button></div>
  </form>
</dialog>

<!-- Edit -->
<dialog id="dlgEdit">
  <form class="dlg" id="editForm">
    <div class="dlg-head"><h2 id="editH">Edit book</h2><button type="button" class="x" id="editClose" aria-label="Close">×</button></div>
    <div class="form">
      <label class="full">Title<input type="text" id="eTitle" required></label>
      <label>Author<input type="text" id="eAuthor"></label>
      <label>ASIN<input type="text" id="eAsin"></label>
      <label>Status<select id="eStatus"><option value="unread">Unread</option><option value="reading">Reading</option><option value="finished">Finished</option><option value="abandoned">Gave up</option></select></label>
      <label>Progress %<input type="number" id="eProgress" min="0" max="100" step="1"></label>
      <label>Pages<input type="number" id="ePages" min="0" step="1" placeholder="unknown"></label>
      <label>Price paid<input type="number" id="ePrice" min="0" step="0.01" placeholder="unknown"></label>
      <label>Added on<input type="date" id="eDate"></label>
      <label>How you got it<select id="eSource"><option value="purchase">Bought</option><option value="free">Free</option><option value="ku">Kindle Unlimited</option><option value="prime">Prime Reading</option><option value="sample">Sample</option><option value="other">Borrowed / other</option></select></label>
      <label>Rating<select id="eRating"><option value="0">No rating</option><option value="1">★</option><option value="2">★★</option><option value="3">★★★</option><option value="4">★★★★</option><option value="5">★★★★★</option></select></label>
    </div>
    <div class="dlg-foot">
      <div class="row"><button type="button" class="btn danger" id="eDelete">Delete</button><span class="result err" id="eConfirm"></span></div>
      <button type="submit" class="btn primary">Save</button>
    </div>
  </form>
</dialog>

<!-- Settings -->
<dialog id="dlgSettings">
  <form class="dlg" id="setForm">
    <div class="dlg-head"><h2>Settings</h2><button type="button" class="x" id="setClose" aria-label="Close">×</button></div>
    <div class="form">
      <label>Pages to assume when unknown<input type="number" id="sPages" min="1"></label>
      <label>Price to assume when unknown<input type="number" id="sPrice" min="0" step="0.01"></label>
      <label>Minutes per page<input type="number" id="sMin" min="0.2" step="0.1"></label>
      <label>Pages you read per day<input type="number" id="sDay" min="1"></label>
      <label>Currency<select id="sCur"><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option><option>JPY</option><option>INR</option><option>BRL</option><option>MXN</option></select></label>
      <label>Finished when progress reaches %<input type="number" id="sDone" min="50" max="100"></label>
      <label class="check full"><input type="checkbox" id="sBorrowed"> Count Kindle Unlimited, Prime and borrowed books</label>
      <label class="check full"><input type="checkbox" id="sSamples"> Count samples</label>
      <label class="check full"><input type="checkbox" id="sGrAll"> Include Goodreads books that aren't in my Kindle library</label>
    </div>
    <p class="note">Kindle doesn't report page counts or prices, so unknown values use the numbers above. Values you enter per book always win. About one minute per page is typical for adult fiction.</p>
    <div class="dlg-foot"><div class="row"><button type="button" class="btn danger" id="wipe">Delete all books</button><span class="result err" id="wipeConfirm"></span></div><button type="submit" class="btn primary">Save</button></div>
  </form>
</dialog>

<div id="toast" role="status" aria-live="polite"></div>

`;
GM_addStyle(`
/* Layout: e-paper ledger — summary strip, the pile itself as the centerpiece, breakdowns, then the full shelf table. */
:root{
  --bg:#eceeea; --paper:#f7f8f5; --ink:#1b1e20; --muted:#5d6560; --rule:#cfd4ce;
  --accent:#27408b; --accent-soft:#dde3f4; --shame:#a3322a; --shame-soft:#f3dedb;
  --ok:#2f6b45; --warn:#9a6a12;
  --cloth-1:#6b3a3a; --cloth-2:#2e4a5c; --cloth-3:#5a5a2e; --cloth-4:#3b3551; --cloth-5:#7a5230; --cloth-6:#2f4f3f; --spine-ink:#f2efe6; --wood:#8a5a36; --wood-dark:#5e3b22; --wood-back:#d9cbb8;
  --display:"Literata", Georgia, "Times New Roman", serif;
  --body:"Literata", Georgia, serif;
  --mono:"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#121517; --paper:#1a1e21; --ink:#e7e8e3; --muted:#9aa29c; --rule:#2d3336;
  --accent:#9fb0ff; --accent-soft:#232c4a; --shame:#f08a7e; --shame-soft:#3a2220;
  --ok:#7fc89a; --warn:#e2b458;
  --cloth-1:#8a4a4a; --cloth-2:#3d6278; --cloth-3:#77773c; --cloth-4:#524a70; --cloth-5:#946642; --cloth-6:#3e6853; --spine-ink:#f6f3ea; --wood:#6b4529; --wood-dark:#40291a; --wood-back:#231c17;
  color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#121517; --paper:#1a1e21; --ink:#e7e8e3; --muted:#9aa29c; --rule:#2d3336;
  --accent:#9fb0ff; --accent-soft:#232c4a; --shame:#f08a7e; --shame-soft:#3a2220;
  --ok:#7fc89a; --warn:#e2b458;
  --cloth-1:#8a4a4a; --cloth-2:#3d6278; --cloth-3:#77773c; --cloth-4:#524a70; --cloth-5:#946642; --cloth-6:#3e6853; --spine-ink:#f6f3ea; --wood:#6b4529; --wood-dark:#40291a; --wood-back:#231c17;
  color-scheme:dark}
*{box-sizing:border-box}
[hidden]{display:none!important}
body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.5;padding-inline:16px;padding-block:0 48px}
.wrap{max-width:1140px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1,h2,h3{font-family:var(--display);text-wrap:balance;margin:0;line-height:1.15}
h1{font-size:1.7rem;font-weight:800;letter-spacing:-.01em}
h2{font-size:1.25rem;font-weight:800}
h3{font-size:.78rem;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-family:var(--mono)}
.num{font-family:var(--mono);font-variant-numeric:tabular-nums}
.muted{color:var(--muted)}
button,select,input,textarea{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{border:1px solid var(--rule);background:var(--paper);padding:7px 14px;border-radius:6px;font-size:.9rem;font-weight:600}
.btn:hover{border-color:var(--ink)}
.btn.primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.btn.primary:hover{opacity:.88}
.btn.danger{color:var(--shame)}
.btn.small{padding:4px 10px;font-size:.8rem}

/* header */
header.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--rule);padding-block:14px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.brand{display:flex;flex-direction:column;gap:2px}
.store{font-family:var(--mono);font-size:.74rem;color:var(--muted);display:flex;align-items:center;gap:6px}
.store i{width:7px;height:7px;border-radius:50%;background:var(--muted);display:inline-block}
.store.db i{background:var(--ok)} .store.local i{background:var(--warn)} .store.demo i{background:var(--accent)}
.actions{display:flex;flex-wrap:wrap;gap:8px}

.banner{background:var(--accent-soft);border:1px solid var(--accent);border-radius:8px;padding:12px 16px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.banner p{margin:0;max-width:70ch}

/* summary */
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:10px;overflow:hidden}
.tile{background:var(--paper);padding:16px 18px;display:flex;flex-direction:column;gap:4px;min-width:0}
.tile .big{font-family:var(--mono);font-size:1.75rem;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.1;overflow-wrap:anywhere}
.tile .sub{font-size:.82rem;color:var(--muted)}
.tile.shame .big{color:var(--shame)}
.reveal{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:4px;border-radius:4px}
.reveal:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
.masked{letter-spacing:.12em;color:var(--muted)}
.hint{font-size:.75rem;color:var(--accent);font-family:var(--mono)}

/* pile */
.pile{display:grid;grid-template-columns:1fr;gap:24px;background:var(--paper);border:1px solid var(--rule);border-radius:10px;padding:24px}
.pile-head{display:flex;flex-direction:column;gap:6px}
.pile-title{font-size:2rem;color:var(--shame)}
.bookcase{--row:176px;background:var(--wood-back);border:10px solid var(--wood);border-top-width:12px;border-radius:4px;padding:0 10px;font-size:0;line-height:var(--row);min-height:calc(var(--row) + 12px);
  background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--row) - 12px),var(--wood) calc(var(--row) - 12px),var(--wood) calc(var(--row) - 3px),var(--wood-dark) calc(var(--row) - 3px),var(--wood-dark) var(--row));margin-top:12px}
.spine{display:inline-block;vertical-align:bottom;margin-bottom:12px;height:var(--h);width:var(--w);background:var(--c);color:var(--spine-ink);border-radius:2px 2px 1px 1px;writing-mode:vertical-rl;text-orientation:mixed;font-size:.68rem;font-family:var(--mono);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:10px 0;text-align:left;
  box-shadow:inset 0 9px 0 -6px rgba(255,255,255,.22),inset 0 -9px 0 -6px rgba(255,255,255,.22),inset 3px 0 0 rgba(255,255,255,.08),inset -3px 0 0 rgba(0,0,0,.2);transform:rotate(var(--r));transform-origin:bottom right}
.more{font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:8px;text-align:right}
.pile-empty{padding:40px 0;text-align:center;color:var(--ok);font-weight:600;font-size:.95rem;line-height:1.5}
.pile-facts{display:flex;flex-direction:column;gap:18px;min-width:0}
.meter{height:14px;border-radius:7px;background:var(--rule);overflow:hidden;display:flex}
.meter i{display:block;height:100%}
.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 18px}
.fact{display:flex;flex-direction:column;gap:2px;border-top:1px solid var(--rule);padding-top:8px;min-width:0}
.fact .v{font-family:var(--mono);font-size:1.2rem;font-weight:600;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.fact .l{font-size:.8rem;color:var(--muted)}
.verdict{font-size:1.02rem;margin:0;max-width:60ch}
.verdict strong{color:var(--shame)}

/* breakdown */
.grid3{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr);gap:20px}
.card{background:var(--paper);border:1px solid var(--rule);border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:14px;min-width:0}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.8rem}
.legend span{display:inline-flex;gap:6px;align-items:center}
.legend i{width:10px;height:10px;border-radius:2px;display:inline-block}
.statlist{display:flex;flex-direction:column;gap:6px;font-size:.88rem}
.statlist div{display:flex;justify-content:space-between;gap:8px}
.bars{display:flex;align-items:flex-end;gap:6px;height:170px;padding-top:18px;overflow-x:auto}
.bar{flex:1 0 26px;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;min-width:26px}
.bar .col{width:100%;display:flex;flex-direction:column-reverse;border-radius:3px 3px 0 0;overflow:hidden}
.bar .col i{display:block;width:100%}
.bar .n{font-family:var(--mono);font-size:.68rem;color:var(--muted)}
.bar .y{font-family:var(--mono);font-size:.68rem;color:var(--muted)}
.authors{display:flex;flex-direction:column;gap:8px;font-size:.88rem}
.arow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;align-items:center}
.arow .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.arow .track{grid-column:1/-1;height:5px;background:var(--rule);border-radius:3px;overflow:hidden;display:flex}

/* table */
.shelf{display:flex;flex-direction:column;gap:14px}
.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--rule);background:var(--paper);border-radius:999px;padding:4px 12px;font-size:.82rem}
.chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.chip .c{font-family:var(--mono);opacity:.7;margin-left:4px}
input[type=search],input[type=text],input[type=number],input[type=date],select,textarea{background:var(--paper);border:1px solid var(--rule);border-radius:6px;padding:7px 10px;min-width:0}
#q{width:260px;max-width:100%}
.tablewrap{overflow-x:auto;border:1px solid var(--rule);border-radius:10px;background:var(--paper)}
table{border-collapse:collapse;width:100%;min-width:760px;font-size:.88rem}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--rule);vertical-align:middle}
th{font-family:var(--mono);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;white-space:nowrap;background:var(--paper);position:sticky;top:0}
th button{background:none;border:0;padding:0;font:inherit;color:inherit;text-transform:inherit;letter-spacing:inherit}
th button[data-dir]::after{content:" ↓"} th button[data-dir="1"]::after{content:" ↑"}
td.r,th.r{text-align:right}
tbody tr:hover{background:var(--bg)}
.t-title{font-weight:600;cursor:pointer}
.t-title:hover{text-decoration:underline}
.t-author{color:var(--muted);font-size:.82rem}
.pill{font-family:var(--mono);font-size:.7rem;border-radius:4px;padding:1px 6px;border:1px solid var(--rule);color:var(--muted);margin-left:6px;white-space:nowrap}
.st{border-radius:5px;padding:3px 6px;font-size:.8rem;border:1px solid var(--rule)}
.st.unread{color:var(--shame);background:var(--shame-soft);border-color:transparent}
.st.finished{color:var(--ok)}
.prog{display:flex;align-items:center;gap:8px;min-width:110px}
.prog .track{flex:1;height:5px;background:var(--rule);border-radius:3px;overflow:hidden}
.prog .track i{display:block;height:100%;background:var(--accent)}
.stars{color:var(--warn);letter-spacing:1px;white-space:nowrap}
.est{color:var(--muted);font-style:italic}
.showmore{align-self:center}
.empty-shelf{padding:36px;text-align:center;color:var(--muted)}

/* dialogs */
dialog{border:1px solid var(--rule);border-radius:12px;background:var(--paper);color:var(--ink);padding:0;width:min(680px,calc(100vw - 32px));max-height:calc(100vh - 48px)}
dialog::backdrop{background:rgba(10,12,14,.5)}
.dlg{display:flex;flex-direction:column;gap:16px;padding:22px}
.dlg-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
.x{background:none;border:0;font-size:1.4rem;line-height:1;color:var(--muted)}
.tabs{display:flex;flex-wrap:wrap;gap:4px;border-bottom:1px solid var(--rule)}
.tab{background:none;border:0;border-bottom:2px solid transparent;padding:8px 10px;font-size:.88rem;color:var(--muted);font-weight:600}
.tab[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--accent)}
.steps{margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:6px;font-size:.9rem}
.code{position:relative;background:var(--bg);border:1px solid var(--rule);border-radius:8px}
.code pre{margin:0;padding:12px;font-family:var(--mono);font-size:.72rem;max-height:130px;overflow:auto;white-space:pre-wrap;word-break:break-all}
.code .btn{position:absolute;top:8px;right:8px}
textarea{width:100%;min-height:110px;font-family:var(--mono);font-size:.78rem;resize:vertical}
.drop{border:1.5px dashed var(--rule);border-radius:8px;padding:14px;text-align:center;font-size:.88rem;color:var(--muted)}
.drop.over{border-color:var(--accent);color:var(--accent)}
.row{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.form label{display:flex;flex-direction:column;gap:4px;font-size:.8rem;color:var(--muted);min-width:0}
.form label.full{grid-column:1/-1}
.form input,.form select,.form textarea{color:var(--ink);font-size:.92rem}
.check{display:flex;gap:8px;align-items:center;font-size:.88rem}
.note{font-size:.8rem;color:var(--muted);margin:0}
.dlg-foot{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center}
.result{font-size:.88rem;min-height:1.3em}
.result.err{color:var(--shame)}

#toast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:9px 16px;border-radius:8px;font-size:.88rem;opacity:0;pointer-events:none;transition:opacity .2s}
#toast.show{opacity:1}

@media (max-width:900px){.grid3{grid-template-columns:1fr}.pile{grid-template-columns:1fr}}
@media (max-width:640px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.tile .big{font-size:1.35rem}h1{font-size:1.35rem}.form{grid-template-columns:1fr}.facts{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`);


const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---------- example library (not saved, clearly labelled) ----------
const DEMO = [
  ['Moby-Dick','Herman Melville',635,2.99,'2016-11-02','unread',0,'purchase'],
  ['Middlemarch','George Eliot',880,0,'2017-03-14','unread',0,'free'],
  ['War and Peace','Leo Tolstoy',1296,3.99,'2015-01-20','reading',22,'purchase'],
  ['Pride and Prejudice','Jane Austen',432,0,'2015-06-01','finished',100,'free',5],
  ['Frankenstein','Mary Shelley',280,0.99,'2018-10-29','finished',100,'purchase',4],
  ['The Count of Monte Cristo','Alexandre Dumas',1276,1.99,'2019-08-11','unread',3,'purchase'],
  ['Crime and Punishment','Fyodor Dostoevsky',565,2.49,'2020-02-17','unread',0,'purchase'],
  ['The Brothers Karamazov','Fyodor Dostoevsky',824,2.99,'2021-05-09','unread',0,'purchase'],
  ['Great Expectations','Charles Dickens',505,0,'2020-12-24','finished',100,'free',4],
  ['Bleak House','Charles Dickens',1017,0.99,'2022-01-06','unread',0,'purchase'],
  ['Dracula','Bram Stoker',418,0,'2022-10-15','finished',100,'free',4],
  ['Anna Karenina','Leo Tolstoy',864,2.99,'2023-04-02','abandoned',41,'purchase'],
  ['Jane Eyre','Charlotte Brontë',532,0,'2023-09-19','reading',64,'free'],
  ['The Odyssey','Homer',541,1.99,'2024-07-07','unread',0,'purchase'],
  ['Don Quixote','Miguel de Cervantes',1072,3.49,'2024-12-01','unread',0,'purchase'],
  ['The Picture of Dorian Gray','Oscar Wilde',254,0,'2025-03-30','finished',100,'ku',5],
  ['Ulysses','James Joyce',730,1.99,'2025-08-18','unread',0,'purchase'],
  ['Little Women','Louisa May Alcott',759,0,'2026-02-11','unread',0,'free'],
  ['Walden','Henry David Thoreau',352,0.99,'2026-06-23','unread',0,'purchase'],
  ['Emma','Jane Austen',474,0,'2026-08-30','reading',12,'sample'],
].map((r,i) => ({id:'demo'+i, title:r[0], author:r[1], pages:r[2], price:r[3], date:r[4], status:r[5], progress:r[6], source:r[7], rating:r[8]||0, asin:''}));

const DEFAULTS = {defPages:320, defPrice:7.99, minPerPage:1.1, pagesPerDay:30, currency:'USD', doneAt:90, borrowed:false, samples:false, grAll:false};
const S = {showMoney:false, books: DEMO.map(b => ({...b})), settings:{...DEFAULTS}, demo:true, mode:'demo', filter:'all', q:'', sort:{k:'date', dir:-1}, limit:150};

// ---------- persistence ----------
let db = null, col = null, saved = {}, saveTimer = null, savedMeta = '';
const LS = 'kindle-calc-v1';
const lsGet = () => { try { return JSON.parse(GM_getValue(LS, 'null')); } catch { return null; } };
const lsSet = v => { try { GM_setValue(LS, JSON.stringify(v)); return true; } catch { return false; } };

async function initStore() {
  try {
    if (window.pageHost?.use) {
      db = await window.pageHost.use('db');
      const user = db ? await window.pageHost.use('user') : null;
      const id = user ? await user.id() : null;
      const canWrite = user ? await user.can('data.write') : null;
      if (db && id && canWrite !== false) {
        col = db.collection('data/users/' + id);
        const snap = await col.get();
        const docs = {}; snap.docs.forEach(d => docs[d.id] = d.data());
        if (docs.meta?.settings) S.settings = {...DEFAULTS, ...docs.meta.settings};
        savedMeta = JSON.stringify(docs.meta || {});
        const chunks = Object.keys(docs).filter(k => /^c\d+$/.test(k)).sort((a,b) => +a.slice(1) - +b.slice(1));
        const books = [];
        chunks.forEach(k => { saved[k] = JSON.stringify(docs[k].books || []); books.push(...(docs[k].books || [])); });
        S.mode = 'db';
        if (books.length || docs.meta?.started) { S.books = books; S.demo = false; }
        renderAll(); return;
      }
    }
  } catch (e) { console.warn('db unavailable', e); db = null; col = null; }
  const local = lsGet();
  S.mode = 'local';
  if (local) { S.books = local.books || []; S.settings = {...DEFAULTS, ...(local.settings || {})}; S.demo = false; }
  renderAll();
}

function scheduleSave() {
  if (S.demo) return;
  setStore('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 700);
}
async function persist() {
  if (S.demo) return;
  if (S.mode === 'db' && col) {
    try {
      const CH = 400, want = {};
      for (let i = 0; i * CH < S.books.length; i++) want['c' + i] = S.books.slice(i * CH, (i + 1) * CH);
      for (const k of Object.keys(want)) {
        const j = JSON.stringify(want[k]);
        if (saved[k] !== j) { await col.doc(k).set({books: want[k]}); saved[k] = j; }
      }
      for (const k of Object.keys(saved)) if (!want[k]) { await col.doc(k).delete(); delete saved[k]; }
      const meta = {settings: S.settings, started: true, count: S.books.length};
      const mj = JSON.stringify(meta);
      if (mj !== savedMeta) { await col.doc('meta').set(meta); savedMeta = mj; }
      setStore();
    } catch (e) {
      console.warn(e);
      if (e?.code === 'invalid_argument') { S.mode = 'local'; col = null; lsSet({books: S.books, settings: S.settings}); setStore(); return; }
      setStore('error', e?.code === 'invalid_argument' ? 'Read-only here: ask the owner for Contributor access' : 'Could not save — changes kept on this page');
    }
  } else {
    lsSet({books: S.books, settings: S.settings});
    setStore();
  }
}
function setStore(state, msg) {
  const el = $('#store'), sp = el.querySelector('span');
  el.className = 'store ' + (S.demo ? 'demo' : S.mode);
  if (S.demo) sp.textContent = 'Example library · not saved';
  else if (state === 'saving') sp.textContent = 'Saving…';
  else if (state === 'error') { sp.textContent = msg; el.className = 'store local'; }
  else sp.textContent = S.mode === 'db' ? `Saved to your online account · ${S.books.length} books` : 'Saved in this browser only';
  $('#demoBanner').hidden = !S.demo;
}
function leaveDemo(clear) {
  if (!S.demo) return;
  S.demo = false;
  if (clear) S.books = [];
}

// ---------- helpers ----------
const fmtMoney = v => { try { return new Intl.NumberFormat(undefined, {style:'currency', currency:S.settings.currency, maximumFractionDigits: v >= 1000 ? 0 : 2}).format(v); } catch { return '$' + v.toFixed(2); } };
const fmtInt = v => Math.round(v).toLocaleString();
const fmtHours = h => h < 1 ? Math.round(h * 60) + ' min' : fmtInt(h) + ' h';
const counted = b => {
  if (b.source === 'sample' && !S.settings.samples) return false;
  if ((b.source === 'ku' || b.source === 'prime' || b.source === 'other') && !S.settings.borrowed) return false;
  return true;
};
const pagesOf = b => b.pages > 0 ? b.pages : S.settings.defPages;
const valueOf = b => b.source === 'purchase' ? (b.price != null && b.price !== '' ? +b.price : S.settings.defPrice) : (+b.price || 0);
const hoursFor = p => p * S.settings.minPerPage / 60;
const remainingPages = b => b.status === 'unread' ? pagesOf(b) : b.status === 'reading' ? pagesOf(b) * (1 - (b.progress || 0) / 100) : 0;
const STATUS = {unread:'Unread', reading:'Reading', finished:'Finished', abandoned:'Gave up'};
const STATUS_COLOR = {finished:'var(--ok)', reading:'var(--accent)', unread:'var(--shame)', abandoned:'var(--muted)'};
const SOURCE = {purchase:'', free:'free', ku:'KU', prime:'Prime', sample:'sample', other:'borrowed'};
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const yearsAgo = d => { const ms = Date.now() - new Date(d).getTime(); return ms / 3.156e10; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function statusFromProgress(p) {
  if (p == null || isNaN(p)) return null;
  if (p >= S.settings.doneAt) return 'finished';
  if (p > 0) return 'reading';
  return 'unread';
}

// ---------- rendering ----------
function renderAll() { setStore(); renderStats(); renderShelf(); }

function renderStats() {
  const bs = S.books.filter(counted);
  const n = bs.length;
  const by = {unread:[], reading:[], finished:[], abandoned:[]};
  bs.forEach(b => (by[b.status] || by.unread).push(b));
  const value = bs.reduce((a,b) => a + valueOf(b), 0);
  const estPrice = bs.filter(b => b.source === 'purchase' && (b.price == null || b.price === '')).length;
  const estPages = bs.filter(b => !(b.pages > 0)).length;
  const allPages = bs.reduce((a,b) => a + pagesOf(b), 0);
  const leftPages = bs.reduce((a,b) => a + remainingPages(b), 0);
  const pile = by.unread;
  const pilePages = pile.reduce((a,b) => a + pagesOf(b), 0);
  const pileValue = pile.reduce((a,b) => a + valueOf(b), 0);
  const pct = n ? pile.length / n * 100 : 0;

  $('#tBooks').textContent = fmtInt(n);
  const hidden = S.books.length - n;
  $('#tBooksSub').textContent = `${fmtInt(by.finished.length)} finished` + (hidden ? ` · ${hidden} not counted` : '');
  const mask = v => S.showMoney ? fmtMoney(v) : '••••••';
  $('#tValue').textContent = mask(value);
  $('#tValue').classList.toggle('masked', !S.showMoney);
  $('#tValueSub').textContent = !S.showMoney ? 'Hidden' : estPrice ? `${fmtInt(estPrice)} prices estimated` : 'all prices known';
  $('#revealHint').textContent = S.showMoney ? 'Click to hide' : 'Click to reveal';
  $('#revealValue').setAttribute('aria-pressed', S.showMoney);
  $('#tHours').textContent = fmtHours(hoursFor(allPages));
  $('#tHoursSub').textContent = `${fmtInt(allPages)} pages · ${fmtHours(hoursFor(leftPages))} left`;
  $('#tUnread').textContent = Math.round(pct) + '%';
  $('#tUnreadSub').textContent = `${fmtInt(pile.length)} of ${fmtInt(n)} books never opened`;

  // pile
  $('#pileH').textContent = `${fmtInt(pile.length)} unread book${pile.length === 1 ? '' : 's'}`;
  const stack = $('#stack');
  if (!pile.length) {
    stack.innerHTML = n ? '<div class="pile-empty">The shelf is empty. Every book has been opened.</div>' : '<div class="pile-empty muted">Import your library to fill the shelf.</div>';
  } else {
    const shown = [...pile].sort((a,b) => (a.date || '9').localeCompare(b.date || '9')).slice(0, 72);
    const cloth = n => `var(--cloth-${n % 6 + 1})`;
    let html = '<div class="bookcase">' + shown.map((b, i) => {
      const h = hash(b.id + b.title), p = pagesOf(b);
      const w = Math.round(Math.max(18, Math.min(46, 12 + p / 22)));
      const ht = 112 + (h % 46);
      const r = (h % 23 === 0 && i > 0) ? -4 : 0;
      return `<span class="spine" style="--h:${ht}px;--w:${w}px;--r:${r}deg;--c:${cloth(h)}" title="${esc(b.title)} — ${esc(b.author)} · ${p} pages">${esc(b.title)}</span>`;
    }).join('') + '</div>';
    if (pile.length > shown.length) html += `<div class="more">+ ${fmtInt(pile.length - shown.length)} more that didn't fit on the shelf</div>`;
    stack.innerHTML = html;
  }
  $('#fValue').textContent = mask(pileValue); $('#fValue').classList.toggle('masked', !S.showMoney);
  $('#fHours').textContent = fmtHours(hoursFor(pilePages));
  const days = leftPages / Math.max(1, S.settings.pagesPerDay);
  if (leftPages > 0) {
    const d = new Date(Date.now() + days * 864e5);
    $('#fClear').textContent = d.toLocaleDateString(undefined, {month:'short', year:'numeric'});
    $('#fClearL').textContent = `everything read at ${S.settings.pagesPerDay} pages a day (${days > 730 ? (days/365).toFixed(1) + ' years' : fmtInt(days) + ' days'}), if you stop buying`;
  } else { $('#fClear').textContent = 'Done'; $('#fClearL').textContent = 'nothing left to read'; }
  const dated = pile.filter(b => b.date).sort((a,b) => a.date.localeCompare(b.date));
  if (dated.length) {
    const o = dated[0], y = yearsAgo(o.date);
    $('#fOldest').textContent = y >= 1 ? y.toFixed(1) + ' yrs' : Math.round(y * 12) + ' mo';
    $('#fOldestL').textContent = `waiting: ${o.title}`;
  } else { $('#fOldest').textContent = '—'; $('#fOldestL').textContent = 'oldest unread book'; }
  $('#fReading').textContent = fmtInt(by.reading.length);
  const yr = Date.now() - 3.156e10;
  const boughtYr = bs.filter(b => b.date && new Date(b.date) >= yr).length;
  const doneYr = bs.filter(b => b.status === 'finished' && b.date && new Date(b.date) >= yr).length;
  $('#fRate').textContent = `${boughtYr} : ${doneYr}`;
  $('#fRate').nextElementSibling.textContent = 'added vs finished of those, last 12 months';

  const verdict = !n ? 'Nothing here yet.' :
    pct >= 60 ? `You've read less than half of what you own. <strong>${Math.round(pct)}%</strong> of your library has never been opened.` :
    pct >= 35 ? `A well-stocked shelf. <strong>${Math.round(pct)}%</strong> unread, about ${fmtHours(hoursFor(pilePages))} of reading waiting for you.` :
    pct > 0 ? `Mostly under control. Only <strong>${Math.round(pct)}%</strong> of your library is unread.` :
    'A clean conscience. You have read or started everything you own.';
  $('#verdict').innerHTML = verdict + (estPages ? ` <span class="muted" style="font-size:.85rem">(${fmtInt(estPages)} books use the default page count.)</span>` : '');

  const order = ['finished','reading','abandoned','unread'];
  $('#meter').innerHTML = order.map(k => n ? `<i style="width:${by[k].length / n * 100}%;background:${STATUS_COLOR[k]}"></i>` : '').join('');
  $('#meterLegend').innerHTML = order.map(k => `<span><i style="background:${STATUS_COLOR[k]}"></i>${STATUS[k]} <span class="num muted">${by[k].length}</span></span>`).join('');

  // status list
  $('#statusList').innerHTML = order.map(k => {
    const pg = by[k].reduce((a,b) => a + pagesOf(b), 0);
    return `<div><span><span class="legend"><span><i style="background:${STATUS_COLOR[k]}"></i>${STATUS[k]}</span></span></span><span class="num">${fmtInt(by[k].length)} · ${fmtInt(pg)} p</span></div>`;
  }).join('') + `<div style="border-top:1px solid var(--rule);padding-top:6px"><span>Spent (known prices)</span><span class="num">${mask(bs.reduce((a,b) => a + (+b.price || 0), 0))}</span></div>` +
    `<div><span>Free, KU and Prime</span><span class="num">${fmtInt(S.books.filter(b => b.source !== 'purchase').length)}</span></div>` +
    `<div><span>Average rating</span><span class="num">${(() => { const r = bs.filter(b => b.rating > 0); return r.length ? (r.reduce((a,b) => a + b.rating, 0) / r.length).toFixed(1) + ' ★' : '—'; })()}</span></div>`;

  // years
  const yrs = {};
  bs.forEach(b => { if (!b.date) return; const y = b.date.slice(0,4); (yrs[y] ||= {finished:0, reading:0, unread:0, abandoned:0})[b.status]++; });
  const keys = Object.keys(yrs).sort().slice(-14);
  const max = Math.max(1, ...keys.map(y => Object.values(yrs[y]).reduce((a,b) => a + b, 0)));
  $('#years').innerHTML = keys.length ? keys.map(y => {
    const t = Object.values(yrs[y]).reduce((a,b) => a + b, 0);
    const segs = order.map(k => yrs[y][k] ? `<i style="height:${yrs[y][k] / t * 100}%;background:${STATUS_COLOR[k]}"></i>` : '').join('');
    return `<div class="bar" title="${y}: ${t} books, ${yrs[y].unread} unread"><span class="n">${t}</span><div class="col" style="height:${t / max * 100}%">${segs}</div><span class="y">'${y.slice(2)}</span></div>`;
  }).join('') : '<p class="muted" style="align-self:center">No purchase dates yet.</p>';
  $('#yearLegend').innerHTML = order.map(k => `<span><i style="background:${STATUS_COLOR[k]}"></i>${STATUS[k]}</span>`).join('');

  // authors
  const au = {};
  bs.forEach(b => { const a = b.author || 'Unknown'; (au[a] ||= {n:0, unread:0}); au[a].n++; if (b.status === 'unread') au[a].unread++; });
  const top = Object.entries(au).sort((a,b) => b[1].n - a[1].n || b[1].unread - a[1].unread).slice(0, 8);
  const amax = top[0]?.[1].n || 1;
  $('#authors').innerHTML = top.length ? top.map(([a, v]) => `<div class="arow"><span class="name">${esc(a)}</span><span class="num muted">${v.n}${v.unread ? ` · <span style="color:var(--shame)">${v.unread} unread</span>` : ''}</span><div class="track"><i style="width:${(v.n - v.unread) / amax * 100}%;background:var(--ink)"></i><i style="width:${v.unread / amax * 100}%;background:var(--shame)"></i></div></div>`).join('') : '<p class="muted">No authors yet.</p>';
}

function renderShelf() {
  const counts = {all:S.books.length, unread:0, reading:0, finished:0, abandoned:0};
  S.books.forEach(b => counts[b.status] = (counts[b.status] || 0) + 1);
  const labels = {all:'All', unread:'Shelf of Shame', reading:'Reading', finished:'Finished', abandoned:'Gave up'};
  $('#chips').innerHTML = Object.keys(labels).map(k => `<button class="chip" data-f="${k}" aria-pressed="${S.filter === k}">${labels[k]}<span class="c">${counts[k] || 0}</span></button>`).join('');

  const q = S.q.trim().toLowerCase();
  let list = S.books.filter(b => (S.filter === 'all' || b.status === S.filter) && (!q || (b.title + ' ' + b.author).toLowerCase().includes(q)));
  const {k, dir} = S.sort;
  const rank = {unread:0, reading:1, abandoned:2, finished:3};
  list.sort((a, b) => {
    let x = a[k], y = b[k];
    if (k === 'status') { x = rank[a.status]; y = rank[b.status]; }
    if (k === 'title') { x = (a.title || '').toLowerCase(); y = (b.title || '').toLowerCase(); }
    if (x == null || x === '') return 1; if (y == null || y === '') return -1;
    return (x < y ? -1 : x > y ? 1 : 0) * dir;
  });
  document.querySelectorAll('th button').forEach(b => { if (b.dataset.k === k) b.dataset.dir = dir; else delete b.dataset.dir; });
  const shown = list.slice(0, S.limit);
  $('#rows').innerHTML = shown.length ? shown.map(b => {
    const src = SOURCE[b.source] ? `<span class="pill">${SOURCE[b.source]}</span>` : '';
    const pr = b.price != null && b.price !== '' ? fmtMoney(+b.price) : (b.source === 'purchase' ? `<span class="est">~${fmtMoney(S.settings.defPrice)}</span>` : '—');
    const pg = b.pages > 0 ? fmtInt(b.pages) : `<span class="est">~${S.settings.defPages}</span>`;
    return `<tr data-id="${esc(b.id)}">
      <td style="min-width:220px"><div class="t-title" data-edit="${esc(b.id)}" tabindex="0">${esc(b.title)}${src}</div><div class="t-author">${esc(b.author || '')}</div></td>
      <td><select class="st ${b.status}" data-st="${esc(b.id)}" aria-label="Status">${Object.entries(STATUS).map(([v,l]) => `<option value="${v}"${v === b.status ? ' selected' : ''}>${l}</option>`).join('')}</select></td>
      <td><div class="prog"><div class="track"><i style="width:${b.progress || 0}%"></i></div><span class="num muted" style="font-size:.75rem">${Math.round(b.progress || 0)}%</span></div></td>
      <td class="r num">${pg}</td>
      <td class="r num">${pr}</td>
      <td class="num muted" style="white-space:nowrap">${b.date || '—'}</td>
      <td class="stars">${b.rating ? '★'.repeat(b.rating) : '<span class="muted">—</span>'}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="7" class="empty-shelf">${S.books.length ? 'No books match.' : 'No books yet. Use <strong>Import library</strong> or <strong>Add book</strong>.'}</td></tr>`;
  $('#showMore').hidden = list.length <= S.limit;
  $('#showMore').textContent = `Show more (${fmtInt(list.length - S.limit)} left)`;
}

const toggleMoney = () => { S.showMoney = !S.showMoney; renderStats(); };
$('#revealValue').onclick = toggleMoney;
document.querySelectorAll('[data-reveal]').forEach(b => b.onclick = toggleMoney);

// ---------- shelf interactions ----------
$('#chips').addEventListener('click', e => { const c = e.target.closest('[data-f]'); if (!c) return; S.filter = c.dataset.f; S.limit = 150; renderShelf(); });
$('#q').addEventListener('input', e => { S.q = e.target.value; S.limit = 150; renderShelf(); });
document.querySelector('thead').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b) return; const k = b.dataset.k; S.sort = {k, dir: S.sort.k === k ? -S.sort.dir : (k === 'title' ? 1 : -1)}; renderShelf(); });
$('#showMore').addEventListener('click', () => { S.limit += 300; renderShelf(); });
$('#rows').addEventListener('change', e => {
  const id = e.target.dataset.st; if (!id) return;
  const b = S.books.find(x => x.id === id); if (!b) return;
  b.status = e.target.value; b.lock = true;
  if (b.status === 'finished') b.progress = 100;
  if (b.status === 'unread') b.progress = 0;
  leaveDemoForEdit(); renderAll(); scheduleSave();
});
$('#rows').addEventListener('click', e => { const t = e.target.closest('[data-edit]'); if (t) openEdit(t.dataset.edit); });
$('#rows').addEventListener('keydown', e => { const t = e.target.closest('[data-edit]'); if (t && e.key === 'Enter') openEdit(t.dataset.edit); });
function leaveDemoForEdit() { /* edits to the example library stay on this page only */ }

// ---------- edit dialog ----------
let editing = null, delArmed = false;
function openEdit(id) {
  editing = id ? S.books.find(b => b.id === id) : null;
  const b = editing || {status:'unread', progress:0, source:'purchase', rating:0, date:new Date().toISOString().slice(0,10)};
  $('#editH').textContent = editing ? 'Edit book' : 'Add a book';
  $('#eTitle').value = b.title || ''; $('#eAuthor').value = b.author || ''; $('#eAsin').value = b.asin || '';
  $('#eStatus').value = b.status; $('#eProgress').value = Math.round(b.progress || 0);
  $('#ePages').value = b.pages || ''; $('#ePrice').value = b.price ?? ''; $('#eDate').value = b.date || '';
  $('#eSource').value = b.source || 'purchase'; $('#eRating').value = b.rating || 0;
  $('#eDelete').hidden = !editing; delArmed = false; $('#eConfirm').textContent = '';
  $('#dlgEdit').showModal();
}
$('#editClose').onclick = () => $('#dlgEdit').close();
$('#eStatus').addEventListener('change', e => { if (e.target.value === 'finished') $('#eProgress').value = 100; if (e.target.value === 'unread') $('#eProgress').value = 0; });
$('#editForm').addEventListener('submit', e => {
  e.preventDefault();
  const num = v => v === '' ? null : +v;
  const data = {
    title: $('#eTitle').value.trim(), author: $('#eAuthor').value.trim(), asin: $('#eAsin').value.trim(),
    status: $('#eStatus').value, progress: Math.max(0, Math.min(100, +$('#eProgress').value || 0)),
    pages: num($('#ePages').value), price: num($('#ePrice').value), date: $('#eDate').value || '',
    source: $('#eSource').value, rating: +$('#eRating').value, lock: true,
  };
  if (!data.title) return;
  if (editing) Object.assign(editing, data);
  else { leaveDemo(true); S.books.unshift({id: uid(), ...data}); }
  $('#dlgEdit').close(); renderAll(); scheduleSave(); toast(editing ? 'Saved' : 'Book added');
});
$('#eDelete').onclick = () => {
  if (!delArmed) { delArmed = true; $('#eConfirm').textContent = 'Click Delete again to remove it'; return; }
  S.books = S.books.filter(b => b !== editing);
  $('#dlgEdit').close(); renderAll(); scheduleSave(); toast('Book deleted');
};
$('#btnAdd').onclick = () => openEdit(null);

// ---------- settings ----------
let wipeArmed = false;
$('#btnSettings').onclick = () => {
  const s = S.settings;
  $('#sPages').value = s.defPages; $('#sPrice').value = s.defPrice; $('#sMin').value = s.minPerPage; $('#sDay').value = s.pagesPerDay;
  $('#sCur').value = s.currency; $('#sDone').value = s.doneAt; $('#sBorrowed').checked = s.borrowed; $('#sSamples').checked = s.samples; $('#sGrAll').checked = !!s.grAll;
  wipeArmed = false; $('#wipeConfirm').textContent = '';
  $('#dlgSettings').showModal();
};
$('#setClose').onclick = () => $('#dlgSettings').close();
$('#setForm').addEventListener('submit', e => {
  e.preventDefault();
  S.settings = {
    defPages: Math.max(1, +$('#sPages').value || DEFAULTS.defPages), defPrice: Math.max(0, +$('#sPrice').value || 0),
    minPerPage: Math.max(0.2, +$('#sMin').value || DEFAULTS.minPerPage), pagesPerDay: Math.max(1, +$('#sDay').value || DEFAULTS.pagesPerDay),
    currency: $('#sCur').value, doneAt: Math.min(100, Math.max(50, +$('#sDone').value || 90)),
    borrowed: $('#sBorrowed').checked, samples: $('#sSamples').checked, grAll: $('#sGrAll').checked,
  };
  $('#dlgSettings').close(); renderAll(); scheduleSave(); toast('Settings saved');
});
$('#wipe').onclick = () => {
  if (!wipeArmed) { wipeArmed = true; $('#wipeConfirm').textContent = 'Click again to delete every book'; return; }
  leaveDemo(true); S.books = []; $('#dlgSettings').close(); renderAll(); scheduleSave(); toast('Library cleared');
};

// ---------- import ----------
const SNIPPET = `(async () => {
  const items = []; let token = '';
  for (let page = 0; page < 400; page++) {
    const url = '/kindle-library/search?query=&libraryType=BOOKS&sortType=recency&querySize=50' + (token ? '&paginationToken=' + encodeURIComponent(token) : '');
    const r = await fetch(url, { credentials: 'include' });
    if (!r.ok) { console.warn('Stopped: HTTP ' + r.status); break; }
    const j = await r.json();
    items.push(...(j.itemsList || []));
    console.log('Fetched ' + items.length + ' books…');
    if (!j.paginationToken) break;
    token = j.paginationToken;
  }
  const text = JSON.stringify({ source: 'kindle-cloud-reader', exported: new Date().toISOString(), items });
  try { copy(text); console.log('Copied to clipboard.'); } catch (e) {}
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = 'kindle-library.json'; document.body.appendChild(a); a.click(); a.remove();
  console.log('Done: ' + items.length + ' books. Paste into the calculator or drop in kindle-library.json.');
})();`;
$('#snippet').textContent = SNIPPET;
$('#copySnippet').onclick = async () => {
  try { await navigator.clipboard.writeText(SNIPPET); toast('Script copied'); }
  catch { const r = document.createRange(); r.selectNodeContents($('#snippet')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Press Ctrl+C / Cmd+C to copy'); }
};
$('#impTabs').addEventListener('click', e => {
  const t = e.target.closest('[data-t]'); if (!t) return;
  document.querySelectorAll('#impTabs .tab').forEach(b => b.setAttribute('aria-selected', b === t));
  document.querySelectorAll('[data-p]').forEach(p => p.hidden = p.dataset.p !== t.dataset.t);
});
const openImport = () => { $('#impResult').textContent = ''; $('#impResult').className = 'result'; $('#replace').checked = false; $('#dlgImport').showModal(); };
$('#btnImport').onclick = openImport; $('#bannerImport').onclick = () => syncAll();
$('#btnSync').onclick = () => syncAll();
$('#bannerEmpty').onclick = () => { leaveDemo(true); renderAll(); scheduleSave(); };

const drop = $('#drop');
['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) readFile(f); });
$('#file').addEventListener('change', e => { const f = e.target.files[0]; if (f) readFile(f); e.target.value = ''; });
function readFile(f) { const r = new FileReader(); r.onload = () => { $('#paste').value = r.result; $('#impResult').className = 'result'; $('#impResult').textContent = `Loaded ${f.name}. Press Import.`; }; r.readAsText(f); }

function parseCSV(text) {
  const rows = []; let row = [], cur = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}
const cleanAuthor = a => {
  if (!a) return '';
  if (Array.isArray(a)) a = a[0] || '';
  if (typeof a === 'object') a = a.name || a.author || '';
  a = String(a).split(/\s*[:;]\s*/).filter(Boolean)[0] || '';
  a = a.trim();
  const parts = a.split(',');
  if (parts.length === 2 && parts[1].trim()) a = parts[1].trim() + ' ' + parts[0].trim();
  return a.replace(/\s+/g, ' ');
};
const toDate = v => {
  if (v == null || v === '') return '';
  if (typeof v === 'number' || /^\d{10,13}$/.test(v)) { const n = +v; const d = new Date(n < 1e12 ? n * 1000 : n); return isNaN(d) ? '' : d.toISOString().slice(0,10); }
  const s = String(v).trim().replace(/\//g, '-');
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(s)) { const [y,m,d] = s.split(/[-T ]/); return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`; }
  const d = new Date(v); return isNaN(d) ? '' : d.toISOString().slice(0,10);
};
const toNum = v => { if (v == null || v === '') return null; const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? null : n; };
const mapSource = (origin, res) => {
  const o = String(origin || '').toUpperCase(), r = String(res || '').toUpperCase();
  if (r.includes('SAMPLE') || o.includes('SAMPLE')) return 'sample';
  if (o.includes('KINDLE_UNLIMITED') || o === 'KU') return 'ku';
  if (o.includes('PRIME')) return 'prime';
  if (o.includes('LEND') || o.includes('LIBRARY') || o.includes('RENT') || o.includes('SHARE')) return 'other';
  if (o.includes('FREE')) return 'free';
  return 'purchase';
};

function fromKindle(items) {
  return items.map(b => {
    const p = b.percentageRead ?? b.percentRead ?? b.readingProgress;
    const progress = p == null ? null : Math.max(0, Math.min(100, +p <= 1 && +p > 0 && !Number.isInteger(+p) ? +p * 100 : +p));
    return {
      asin: b.asin || '', title: String(b.title || '').trim(), author: cleanAuthor(b.authors || b.author),
      progress, status: statusFromProgress(progress), source: mapSource(b.originType || b.origin, b.resourceType),
      date: toDate(b.acquiredTime ?? b.acquiredDate ?? b.acquisitionDate ?? b.purchaseDate ?? ''),
    };
  }).filter(b => b.title);
}
function fromRows(rows, kind) {
  const head = rows[0].map(h => h.trim().toLowerCase());
  const col = (...names) => { for (const n of names) { const i = head.indexOf(n); if (i >= 0) return i; } for (const n of names) { const i = head.findIndex(h => h.includes(n)); if (i >= 0) return i; } return -1; };
  const c = {
    title: col('title', 'productname', 'product name', 'item name', 'name'),
    author: col('author', 'authors', 'contributor', 'creator'),
    asin: col('asin'), pages: col('number of pages', 'pages', 'page count'),
    price: col('price paid', 'ourprice', 'our price', 'unit price', 'price', 'item total', 'listprice'),
    date: col('date added', 'orderdate', 'order date', 'purchase date', 'acquired', 'date'),
    shelf: col('exclusive shelf', 'status', 'shelf'), progress: col('progress', 'percent'),
    rating: col('my rating', 'rating'), source: col('source', 'origin'),
    binding: col('binding'), cat: col('productcategory', 'product category', 'productgroup', 'product group', 'category'),
  };
  if (c.title < 0) throw new Error('No title column found. The first row must be column names.');
  const grKindle = $('#grKindleOnly').checked;
  const out = [];
  for (const r of rows.slice(1)) {
    const g = i => i >= 0 ? (r[i] ?? '').trim() : '';
    if (grKindle && c.binding >= 0 && !/kindle/i.test(g(c.binding))) continue;
    if (c.cat >= 0 && g(c.cat) && !/book|kindle|ebook|digital_text|abis_ebooks/i.test(g(c.cat))) continue;
    const title = g(c.title).replace(/^="?|"$/g, ''); if (!title) continue;
    const shelf = g(c.shelf).toLowerCase();
    let status = null;
    if (/to-read|unread|want|tbr|not started/.test(shelf)) status = 'unread';
    else if (/currently|reading|started/.test(shelf)) status = 'reading';
    else if (/abandon|dnf|gave up|did-not-finish/.test(shelf)) status = 'abandoned';
    else if (/^read$|finished|done|complete/.test(shelf)) status = 'finished';
    const progress = toNum(g(c.progress));
    if (!status && progress != null) status = statusFromProgress(progress);
    const rating = toNum(g(c.rating));
    const src = g(c.source);
    out.push({
      title, author: cleanAuthor(g(c.author)), asin: g(c.asin), pages: toNum(g(c.pages)) || null,
      price: toNum(g(c.price)), date: toDate(g(c.date)), status, progress: progress ?? (status === 'finished' ? 100 : status === 'unread' ? 0 : null),
      rating: rating ? Math.round(Math.min(5, rating)) : 0, source: src ? (['purchase','free','ku','prime','sample','other'].includes(src.toLowerCase()) ? src.toLowerCase() : mapSource(src)) : null,
      shelfSet: status != null,
    });
  }
  return out;
}
function parseInput(text) {
  text = text.trim();
  if (!text) throw new Error('Paste some data or choose a file first.');
  if (text[0] === '<') {
    const x = new DOMParser().parseFromString(text, 'text/xml');
    const xt = (el, n) => (el.getElementsByTagName(n)[0]?.textContent || '').trim();
    const metas = [...x.getElementsByTagName('meta_data')];
    if (!metas.length) throw new Error('That XML file has no Kindle books in it. Use KindleSyncMetadataCache.xml from the Kindle app.');
    const books = metas.filter(m => !/PDOC/i.test(xt(m, 'cde_contenttype'))).map(m => ({
      asin: xt(m, 'ASIN'), title: xt(m, 'title'), author: cleanAuthor(xt(m, 'author')),
      date: toDate(xt(m, 'purchase_date')), status: null, progress: null, source: null,
    })).filter(b => b.title);
    return {books, kind:'kindleapp'};
  }
  if (text[0] === '{' || text[0] === '[') {
    const j = JSON.parse(text);
    if (Array.isArray(j)) return j[0]?.asin !== undefined || j[0]?.percentageRead !== undefined ? {books: fromKindle(j), kind:'kindle'} : {books: j, kind:'backup'};
    if (j.items || j.itemsList) return {books: fromKindle(j.items || j.itemsList), kind:'kindle'};
    if (j.books) return {books: j.books, kind:'backup', settings: j.settings};
    throw new Error('That JSON does not look like a Kindle export or a backup.');
  }
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error('The CSV needs a header row and at least one book.');
  return {books: fromRows(rows), kind:'csv'};
}
const normTitle = t => String(t || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, '').split(/[:—]| - /)[0].replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]/g, '');
const surname = a => { const w = String(a || '').toLowerCase().replace(/[^a-z ]/g, '').trim().split(/\s+/); return w[w.length - 1] || ''; };

function merge(incoming, replace, kind, addNew = true) {
  if (replace) S.books = [];
  const byAsin = new Map(), byKey = new Map(), byTitle = new Map();
  const index = b => {
    if (b.asin) byAsin.set(b.asin.toUpperCase(), b);
    byKey.set(normTitle(b.title) + '|' + surname(b.author), b);
    const t = normTitle(b.title); byTitle.set(t, byTitle.has(t) && byTitle.get(t) !== b ? 'dup' : b);
  };
  S.books.forEach(index);
  let added = 0, updated = 0;
  for (const inc of incoming) {
    if (kind === 'backup') { const nb = {...inc, id: inc.id || uid()}; const m = (nb.asin && byAsin.get(nb.asin.toUpperCase())) || byKey.get(normTitle(nb.title) + '|' + surname(nb.author)); if (m) { Object.assign(m, nb, {id: m.id}); updated++; } else { S.books.push(nb); index(nb); added++; } continue; }
    let m = (inc.asin && byAsin.get(inc.asin.toUpperCase())) || byKey.get(normTitle(inc.title) + '|' + surname(inc.author));
    if (!m && (!inc.author || true)) { const t = byTitle.get(normTitle(inc.title)); if (t && t !== 'dup' && (!inc.author || !t.author || surname(t.author) === surname(inc.author))) m = t; }
    if (!m && !addNew) continue;
    if (m) {
      for (const f of ['asin','author','pages','date','isbn']) if ((m[f] == null || m[f] === '') && inc[f]) m[f] = inc[f];
      if ((m.price == null || m.price === '') && inc.price != null) m.price = inc.price;
      if (inc.source && (m.source == null || kind === 'kindle')) m.source = inc.source;
      if (inc.rating) m.rating = inc.rating;
      if (!m.lock) {
        if (inc.progress != null && kind === 'kindle') m.progress = inc.progress;
        if (inc.status) m.status = inc.status;
        if (kind === 'goodreads' && inc.progress != null && (inc.status !== 'reading' || !m.progress)) m.progress = inc.progress;
      }
      updated++;
    } else {
      const b = {
        id: uid(), title: inc.title, author: inc.author || '', asin: inc.asin || '', pages: inc.pages || null,
        price: inc.price ?? null, date: inc.date || '', status: inc.status || 'unread', progress: inc.progress ?? 0,
        rating: inc.rating || 0, source: inc.source || 'purchase',
      };
      S.books.push(b); index(b); added++;
    }
  }
  return {added, updated};
}
$('#doImport').onclick = () => {
  const res = $('#impResult');
  try {
    const {books, kind, settings} = parseInput($('#paste').value);
    if (!books.length) throw new Error('No books found in that data.');
    const wasDemo = S.demo;
    leaveDemo(true);
    if (settings && kind === 'backup') S.settings = {...DEFAULTS, ...settings};
    const {added, updated} = merge(books, $('#replace').checked || wasDemo, kind);
    $('#paste').value = '';
    $('#dlgImport').close();
    renderAll(); scheduleSave();
    toast(`Imported: ${added} added, ${updated} updated`);
  } catch (e) { res.className = 'result err'; res.textContent = e.message || String(e); }
};

// ---------- live sync: Goodreads shelves + Kindle library cached by the read.amazon.com half ----------
const GR_SHELVES = {'to-read':'unread', 'currently-reading':'reading', 'read':'finished'};
let syncing = false;
function setSync(msg, kind) { const el = $('#sync'); el.className = 'store ' + (kind || ''); el.querySelector('span').textContent = msg; }

async function grUserId() {
  const link = document.querySelector('a[href*="/user/show/"]');
  const fromLink = link && (link.getAttribute('href').match(/\/user\/show\/(\d+)/) || [])[1];
  if (fromLink) { GM_setValue('grUser', fromLink); return fromLink; }
  const saved = GM_getValue('grUser', '');
  if (saved) return saved;
  const r = await fetch('/review/list', {credentials:'include'});
  const m = r.url.match(/\/review\/list\/(\d+)/);
  if (!m) throw new Error('Sign in to Goodreads first, then press Sync now.');
  GM_setValue('grUser', m[1]);
  return m[1];
}
const tag = (el, name) => (el.getElementsByTagName(name)[0]?.textContent || '').trim();
const grDate = s => { const d = s ? new Date(s) : null; return d && !isNaN(d) ? d.toISOString().slice(0,10) : ''; };

async function fetchShelfRss(id, shelf) {
  const out = [], seen = new Set();
  for (let page = 1; page <= 80; page++) {
    const r = await fetch(`/review/list_rss/${id}?shelf=${encodeURIComponent(shelf)}&page=${page}`, {credentials:'include'});
    if (!r.ok) throw new Error('rss ' + r.status);
    const x = new DOMParser().parseFromString(await r.text(), 'text/xml');
    if (x.querySelector('parsererror') || !x.querySelector('channel')) throw new Error('rss unavailable');
    const items = [...x.getElementsByTagName('item')];
    let fresh = 0;
    for (const it of items) {
      const bid = tag(it, 'book_id') || tag(it, 'guid');
      if (seen.has(bid)) continue; seen.add(bid); fresh++;
      out.push({
        grId: bid, title: tag(it, 'title'), author: cleanAuthor(tag(it, 'author_name')),
        isbn: tag(it, 'isbn'), pages: toNum(tag(it, 'num_pages')) || null,
        rating: Math.round(toNum(tag(it, 'user_rating')) || 0),
        date: grDate(tag(it, 'user_date_added')), readAt: grDate(tag(it, 'user_read_at')),
      });
    }
    if (!fresh) break;
  }
  return out;
}
async function fetchShelfHtml(id, shelf) {
  const out = [], seen = new Set();
  for (let page = 1; page <= 80; page++) {
    const r = await fetch(`/review/list/${id}?shelf=${encodeURIComponent(shelf)}&per_page=100&page=${page}&view=table`, {credentials:'include'});
    if (!r.ok) throw new Error('Goodreads returned ' + r.status + ' for your ' + shelf + ' shelf.');
    const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
    const rows = [...doc.querySelectorAll('tr.review, tr.bookalike')];
    let fresh = 0;
    for (const row of rows) {
      const a = row.querySelector('td.field.title a');
      if (!a) continue;
      const key = a.getAttribute('href');
      if (seen.has(key)) continue; seen.add(key); fresh++;
      const val = c => (row.querySelector(`td.field.${c} .value`)?.textContent || '').replace(/\s+/g, ' ').trim();
      out.push({
        grId: key, title: (a.getAttribute('title') || a.textContent).trim(),
        author: cleanAuthor(row.querySelector('td.field.author a')?.textContent || ''),
        isbn: val('isbn'), pages: toNum(val('num_pages')) || null,
        rating: row.querySelectorAll('td.field.rating .staticStar.p10').length,
        date: grDate(val('date_added')), readAt: grDate(val('date_read')),
      });
    }
    if (!fresh) break;
  }
  return out;
}
async function fetchGoodreads() {
  const id = await grUserId();
  const all = [];
  let useHtml = false;
  for (const [shelf, status] of Object.entries(GR_SHELVES)) {
    setSync(`Reading your Goodreads "${shelf}" shelf…`);
    let books;
    if (!useHtml) { try { books = await fetchShelfRss(id, shelf); } catch { useHtml = true; } }
    if (useHtml) books = await fetchShelfHtml(id, shelf);
    books.forEach(b => all.push({...b, status, progress: status === 'finished' ? 100 : status === 'unread' ? 0 : null, source: null}));
  }
  return all;
}

async function syncAll() {
  if (syncing) return; syncing = true;
  $('#btnSync').disabled = true;
  try {
    let gr = [], grErr = '';
    try { gr = await fetchGoodreads(); } catch (e) { grErr = e.message || String(e); }
    let kindle = null; try { kindle = JSON.parse(GM_getValue('kindle', 'null')); } catch {}
    const kItems = kindle?.items || [];
    if (!gr.length && !kItems.length) { setSync(grErr || 'Nothing to sync yet. Add books on Goodreads or visit your Kindle library.', 'local'); return; }
    leaveDemo(true);
    if (kItems.length) merge(fromKindle(kItems), false, 'kindle');
    const addGr = !kItems.length || S.settings.grAll;
    const res = merge(gr, false, 'goodreads', addGr);
    renderAll(); scheduleSave();
    const when = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    const kTxt = kItems.length ? `Kindle ${kItems.length} books (from ${new Date(kindle.time).toLocaleDateString()})` : 'Kindle not synced yet: visit read.amazon.com/kindle-library';
    setSync(grErr ? `Goodreads failed: ${grErr} · ${kTxt}` : `Synced ${when} · Goodreads ${gr.length} books, ${res.updated} matched · ${kTxt}`, grErr ? 'local' : 'db');
  } finally { syncing = false; $('#btnSync').disabled = false; }
}

// ---------- export ----------
$('#btnExport').onclick = async () => {
  const data = JSON.stringify({app:'kindle-library-calculator', exported:new Date().toISOString(), settings:S.settings, books:S.books}, null, 1);
  const name = `kindle-library-${new Date().toISOString().slice(0,10)}.json`;
  try {
    const dl = window.pageHost?.use ? await window.pageHost.use('downloads') : null;
    if (dl) { await dl.save({filename:name, data}); toast('Backup saved'); return; }
  } catch (e) { if (e?.code === 'declined') return; }
  try { const u = URL.createObjectURL(new Blob([data], {type:'application/json'})); const l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000); toast('Backup downloaded'); return; } catch {}
  try { await navigator.clipboard.writeText(data); toast('Backup copied to clipboard'); } catch { toast('Downloads are not available here'); }
};

let tt;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); }

renderAll();
initStore().then(() => syncAll());

})();
