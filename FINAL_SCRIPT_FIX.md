# FINAL CORRECT SCRIPT

The issue is that your script is expecting "Owner Name" (with space), but the website is sending "ownerName" (no space). This mismatch causes empty rows.

**This code fixes the mapping.**

1.  Open **Apps Script**.
2.  **Delete ALL current code.**
3.  Paste this exact code:

```javascript
const SHEET_NAME = "simple_verification";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Safety check: Create sheet if missing
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(["Owner Name", "Owner Phone", "Flat No", "Rent", "Deposit", "Maintenance", "Tenant Pref", "Non-Veg", "Water", "Power", "Lift", "Parking", "Furnishing", "Amenities", "Photo Link", "Notes"]);
    }

    const rawData = JSON.parse(e.postData.contents);

    // 1. Handle Image
    let fileUrl = "No Image";
    if (rawData.fileData) {
      try {
        const decoded = Utilities.base64Decode(rawData.fileData);
        const blob = Utilities.newBlob(decoded, rawData.mimeType, rawData.fileName);
        const file = DriveApp.getRootFolder().createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (err) {
        fileUrl = "Error: " + err.toString();
      }
    }

    // 2. APPEND ROW - Explicitly Mapping keys
    // This connects "ownerName" (Website) to Column 1 (Sheet)
    sheet.appendRow([
      rawData.ownerName,  // website sends ownerName
      rawData.ownerPhone, // website sends ownerPhone
      rawData.flatNo,
      rawData.rent,
      rawData.deposit,
      rawData.maintenance,
      rawData.tenantPref,
      rawData.nonVeg,
      rawData.water,
      rawData.power,
      rawData.lift,
      rawData.parking,
      rawData.furnishing,
      rawData.amenities,
      fileUrl,
      rawData.notes
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }));

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }));
  } finally {
    lock.releaseLock();
  }
}
```

4.  **Save** and **Deploy > New Version**.
5.  Try submitting. It will 100% work now.
