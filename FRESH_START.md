# Fresh Start: Verification System 2.0

We are deleting the old approach and starting fresh. 

### Step 1: Create a NEW Google Sheet
1.  Go to `sheets.new` to create a brand new blank spreadsheet.
2.  Name it **"RanchiRent Verification 2.0"**.
3.  **Do not rename the tab**. Leave it as "Sheet1".

### Step 2: The New Script
1.  Extensions > **Apps Script**.
2.  **Delete everything**.
3.  Paste this **Simplified Code**:

```javascript
// 5. SERVE DATA TO WEBSITE (GET Request)
function doGet(e) {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = doc.getSheets()[0];
  const rows = sheet.getDataRange().getValues();
  
  // Headers: ["Owner", "Phone", "Address", "Location", "Rent", "Deposit", "Type", "Furnishing", "Tenant Pref", "Amenities", "Image", "Timestamp"]
  // Index:    0        1        2          3           4       5          6       7             8              9            10       11
  
  const properties = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    properties.push({
      id: i,
      location: row[3],
      rent: row[4],
      deposit: row[5],
      type: row[6],           // New
      furnishing: row[7],     // New
      tenantPref: row[8],     // New (Maybe useful for filtering later)
      amenities: row[9],
      image: row[10] || "https://placehold.co/600x400?text=No+Image"
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(properties))
    .setMimeType(ContentService.MimeType.JSON);
}

// FRESH START SCRIPT v2.0
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheets()[0]; 

    // 2. Setup Headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Owner", "Phone", "Address", "Location", "Rent", "Deposit", "Type", "Furnishing", "Tenant Pref", "Amenities", "Image", "Timestamp"]);
    }

    const data = JSON.parse(e.postData.contents);
    
    // 3. Handle Images (Expecting Array of ImgBB URLs)
    // Since frontend sends [url1, url2], we just join them.
    let finalImageString = "No Image";
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        finalImageString = data.images.join(",");
    }    
    
    // 4. Save
    sheet.appendRow([
      data.owner, data.phone, data.address, data.location, data.rent, data.deposit, 
      data.type, data.furnishing, data.tenantPref, // New
      data.amenities, finalImageString, new Date() // Store Joined URLs
    ]);

    return ContentService.createTextOutput(JSON.stringify({result: "success"}));

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: err.toString()}));
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Deploy (Critical)
1.  **Deploy** > **New Deployment**.
2.  Select type: **Web app**.
3.  Description: `Fresh Start`.
4.  Execute as: **Me**.
5.  Who has access: **Anyone** (✅ Crucial).
6.  Click **Deploy**.
7.  **COPY THE NEW URL.**

### Step 4: Tell Me
Paste the **New Web App URL** in the chat, and I will update your website code immediately.
