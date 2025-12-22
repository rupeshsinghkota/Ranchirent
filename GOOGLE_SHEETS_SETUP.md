# Google Sheets Integration Setup

For your website to save data to a Google Sheet, we need to create a simple "Receiver" script. Please follow these steps exactly.

### Step 1: Create the Sheet and Script
1.  Go to **[Google Sheets](https://sheets.new)** and create a new blank spreadsheet.
2.  Name it: `RanchiRent Leads`
3.  In the menu, go to **Extensions** > **Apps Script**.
4.  Delete any code in the `Code.gs` file and paste the following code:

```javascript
/*
  RanchiRent Lead Capture Script
  Handles both "Landlord Listing" and "Tenant Booking" types.
*/

const SHEET_NAME = "Sheet1";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    // Parse the incoming data
    // We expect JSON data sent from the website
    const data = JSON.parse(e.postData.contents);

    // Add Metadata (Timestamp)
    data.Timestamp = new Date();

    const newRow = headers.map(function(header) {
      return header === 'Timestamp' ? new Date() : data[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock();
  }
}

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = doc.getSheetByName(SHEET_NAME);

  // Set up the headers nicely
  const headers = [
    "Timestamp", 
    "Type",  // "Landlord" or "Tenant"
    "Name", 
    "Phone", 
    "Email", 
    "Location", // Where they want/have the flat
    "Details", // Bedroom count or notes
    "Status"   // "New" (Default)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}
```

### Step 2: Run Setup
1.  In the Apps Script editor, you will see a function dropdown (usually says `doPost`). Change it to `setup`.
2.  Click the **Run** (▶) button.
3.  It will ask for permission. Click **Review Permissions** -> Choose your account -> **Advanced** -> **Go to (Unsafe)** -> **Allow**.
    *   *Note: It says "Unsafe" because you are the developer. It is perfectly safe because it's your own code.*
4.  Once it runs, go back to your Google Sheet. You should see the headers (Timestamp, Type, Name...) created for you.

### Step 3: Deploy (The Most Important Step)
1.  Click the blue **Deploy** button (top right) -> **New deployment**.
2.  Click the **Gear Icon** (Select type) -> **Web app**.
3.  **Description**: `RanchiRent v1`
4.  **Execute as**: `Me` (your email).
5.  **Who has access**: **Anyone** (This is crucial! It allows your website visitors to submit forms).
6.  Click **Deploy**.
7.  Copy the **Web App URL** (It starts with `https://script.google.com/macros/s/...`).

### Step 4: Send me the URL
Paste the URL in the chat, and I will connect your website forms to it.
