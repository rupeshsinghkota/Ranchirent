e# Admin Verification System (With Image Upload)

This system allows you to verify properties from your website and automatically:
1.  **Save Details** to your Google Sheet.
2.  **Upload Photos** to a specific Google Drive Folder.
3.  **Save the Photo Link** in the sheet.

### Step 1: Update Your Google Apps Script
Go to your **Google Sheet** > **Extensions** > **Apps Script**.
Replace the **entire code** with this advanced version:

```javascript
/* 
  RanchiRent Verification System (v2)
  - Saves Data to Sheet
  - Saves Images to Google Drive
*/

const SHEET_NAME = "simple_verification"; // Changed to match your tab name
const GOOGLE_DRIVE_FOLDER_ID = ""; // LEAVE EMPTY to save in root, or paste a Folder ID

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);
    
    // Parse the data
    const rawData = JSON.parse(e.postData.contents);
    
    // 1. Handle Image Upload (If exists)
    let fileUrl = "No Image";
    if (rawData.fileData && rawData.fileName) {
      try {
        const decodedFile = Utilities.base64Decode(rawData.fileData);
        const blob = Utilities.newBlob(decodedFile, rawData.mimeType, rawData.fileName);
        
        // Save to Drive
        let folder;
        if (GOOGLE_DRIVE_FOLDER_ID) {
          folder = DriveApp.getFolderById(GOOGLE_DRIVE_FOLDER_ID);
        } else {
          folder = DriveApp.getRootFolder();
        }
        
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrl = file.getUrl();
      } catch (imageError) {
        fileUrl = "Error: " + imageError.toString();
      }
    }

    // 2. Prepare Row Data
    // We Map incoming keys to Headers roughly, or just append in order if we trust the simplified structure.
    // For Safety with your CSV import, we will append a new row mapping specific fields.
    
    const timestamp = new Date();
    
    // Order matches your "Simple Verification" CSV + Image Column at the end
    const newRow = [
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
      fileUrl, // The Image Link
      rawData.notes || ""
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'imageUrl': fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 2: Deploy Again
1.  Click **Deploy** > **Manage deployments**.
2.  Click the **Pencil Icon** (Edit) next to your current deployment.
3.  **Version**: Select **"New version"**. (Very Important!)
4.  Click **Deploy**.
5.  Copy the URL.
