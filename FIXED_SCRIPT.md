# Fixed "Self-Healing" Script

The error happens because the Script cannot find the "simple_verification" tab. This version **fixes itself** by creating the tab automatically if it is missing.

### Instructions
1.  Go to **Apps Script**.
2.  Replace **everything** with this code.
3.  **Deploy** > **New Version** > **Deploy**. (You don't need to change the URL).

```javascript
/* 
  FIXED Verification Script
  - Automatically creates the sheet if missing.
  - Prevents "Null" errors.
*/

const SHEET_NAME = "simple_verification";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);

    // 🛠️ SELF-HEALING: If sheet is missing, create it automatically!
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Add Headers
      sheet.appendRow([
        "Owner Name", "Owner Phone", "Flat No", "Rent", "Deposit", "Maintenance", 
        "Tenant Pref", "Non-Veg?", "Water Source", "Power Backup", "Lift", 
        "Parking", "Furnishing", "Amenities", "Photo Link", "Notes"
      ]);
      sheet.setFrozenRows(1);
    }
    
    // Parse the data
    const rawData = JSON.parse(e.postData.contents);
    
    // 1. Handle Image Upload
    let fileUrl = "No Image";
    if (rawData.fileData && rawData.fileName) {
      try {
        const decoded = Utilities.base64Decode(rawData.fileData);
        const blob = Utilities.newBlob(decoded, rawData.mimeType, rawData.fileName);
        const file = DriveApp.getRootFolder().createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (imageError) {
        fileUrl = "Image Error: " + imageError.toString();
      }
    }

    // 2. Save Data
    sheet.appendRow([
      rawData.ownerName,
      rawData.ownerPhone,
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
      rawData.notes || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return the actual error to the website so we can see it
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```
