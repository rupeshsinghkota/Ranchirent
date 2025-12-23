# Hardcoded ID Script

Since the automatic connection isn't working, we will force the connection using the **Spreadsheet ID**. This guarantees the script writes to the exact file you are looking at.

### Step 1: Get your Spreadsheet ID
1.  Look at the URL of your Google Sheet.
2.  It looks like this: `https://docs.google.com/spreadsheets/d/`**`1aBcD_efG...`**`/edit...`
3.  Copy that long string of random letters/numbers between `/d/` and `/edit`.

### Step 2: Update the Script
Replace your code with this. **PASTE YOUR ID** in the first line.

```javascript
// PASTE YOUR SPREADSHEET ID HERE 👇
const SPREADSHEET_ID = "1TLcL77e8ly-tBUD5DTu0404VM7WTS7b-Ed3YHDIskPg";
const SHEET_NAME = "simple_verification";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // FORCE open the specific sheet
    const doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Auto-create Tab
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(["Owner Name", "Owner Phone", "Flat No", "Rent", "Deposit", "Maintenance", "Tenant Pref", "Non-Veg", "Water", "Power", "Lift", "Parking", "Furnishing", "Amenities", "Photo Link", "Notes"]);
    }

    const rawData = JSON.parse(e.postData.contents);

    // Image Handling
    let fileUrl = "No Image";
    if (rawData.fileData) {
      try {
        const decoded = Utilities.base64Decode(rawData.fileData);
        const blob = Utilities.newBlob(decoded, rawData.mimeType, rawData.fileName);
        const file = DriveApp.getRootFolder().createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (err) { fileUrl = "Error: " + err.toString(); }
    }

    sheet.appendRow([
      rawData.ownerName, rawData.ownerPhone, rawData.flatNo, rawData.rent, 
      rawData.deposit, rawData.maintenance, rawData.tenantPref, rawData.nonVeg, 
      rawData.water, rawData.power, rawData.lift, rawData.parking, 
      rawData.furnishing, rawData.amenities, fileUrl, rawData.notes
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }));

  } catch (e) {
    // LOG THE ERROR SO WE CAN SEE IT
    Logger.log("ERROR: " + e.toString()); 
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }));
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Deploy
1.  **Save**.
2.  **Deploy** > **New Version** > **Deploy**.
3.  Try submitting again.
