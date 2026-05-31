# Connect the Membership Form to Google Sheets

The "Become a Member" form on the site collects:
**Full Name · Email · City in Germany · Phone Number · Profession**

Follow these steps to make submissions land in a Google Sheet.

---

## 1. Create the Google Sheet

1. Go to <https://sheets.new> and create a new sheet (name it e.g. *TDP Germany Members*).
2. In **row 1**, add these column headers exactly (order matters):

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Timestamp | Name | Email | City | Phone | Profession |

---

## 2. Add the Apps Script

1. In the sheet menu: **Extensions → Apps Script**.
2. Delete any sample code and paste this:

```javascript
// Paste your Sheet ID here (from the sheet URL, between /d/ and /edit):
// https://docs.google.com/spreadsheets/d/THIS_LONG_ID/edit
var SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

function doPost(e) { return save_(e); }
function doGet(e)  { return save_(e); } // lets you test in a browser

function save_(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.email || '',
      p.city || '',
      p.phone || '',
      p.profession || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click **Save** (disk icon).

---

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** TDP membership form
   - **Execute as:** *Me*
   - **Who has access:** **Anyone**
4. Click **Deploy**, then **Authorize access** and allow the permissions for your Google account.
5. Copy the **Web app URL** — it ends in `/exec`.

---

## 4. Paste the URL into the site

Open `js/main.js` and set the endpoint near the top of the membership-form section:

```javascript
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```

Save and reload the site. Submit a test entry — a new row should appear in the sheet.

---

### Notes
- The form uses `mode: 'no-cors'`, so the browser can't read the response — that's normal. The row is still written.
- Until the URL is set, the form shows a success message but does **not** store data (demo mode).
- To change the columns, update both the sheet header **and** the `appendRow([...])` order.
