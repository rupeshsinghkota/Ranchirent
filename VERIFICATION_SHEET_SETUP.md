# Verification Sheet Setup

Since this is a detailed internal process, we will create a separate **"RanchiRent Admin"** sheet.

### Step 1: Create New Sheet
1.  Go to **[Google Sheets](https://sheets.new)**.
2.  Name it: `RanchiRent Verification Database`.
3.  (Optional) Rename the tab at the bottom to `VerificationData`.

### Step 2: Add the Automation Script
1.  Go to **Extensions** > **Apps Script**.
2.  Paste the code below. This code captures all the detailed amenity data we discussed.

```javascript
/*
  RanchiRent Property Verification System
  Stores detailed on-site verification data.
*/

const SHEET_NAME = "VerificationData"; // Make sure this matches your tab name

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
  }

  // Detailed Headers for Verification
  const headers = [
    // 1. Meta Data
    "Timestamp",
    "Verifier Name",
    "Status", // Verified, Rejected, Follow-up

    // 2. Owner & Legal
    "Owner Name",
    "Owner Phone",
    "ID Proof Seen?", // Yes/No
    "Electricity Bill Match?", // Yes/No

    // 3. Property Basics
    "Property Address",
    "Google Maps Link",
    "Flat / House No",
    "Floor Number",
    "Total Floors",
    "Facing Direction",
    "Building Age (Approx)",

    // 4. Specs & Financials
    "Configuration", // 1BHK, 2BHK...
    "Carpet Area (sqft)",
    "Final Rent",
    "Maintenance Amount",
    "Deposit Amount",
    "Lock-in Period",

    // 5. Utilities (The Real Check)
    "Water Source", // Municipal / Borewell
    "Water Timing", // 24x7 / Timed
    "Power Backup", // Generator / Inverter / None
    "Lift Available", // Yes / No
    "Parking Type", // Covered / Open / Bike Only

    // 6. Interiors
    "Furnishing Level", // Full / Semi / None
    "Bedrooms",
    "Bathrooms",
    "Balconies",
    "Kitchen Type", // Modular / Normal

    // 7. Restrictions
    "Tenant Preference", // Family / Bachelor / Any
    "Non-Veg Allowed?",
    "Pets Allowed?",
    "Gate Closing Time",

    // 8. Media & Notes
    "Photo Folder Link",
    "Verifier Notes"
  ];

  // Set Headers in First Row
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  
  // Styling
  range.setFontWeight("bold");
  range.setBackground("#e6f3ff"); // Light blue header
  sheet.setFrozenRows(1);
}

// Standard data receiver for when we build the Admin Form
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const data = JSON.parse(e.postData.contents);
    data.Timestamp = new Date(); // Auto-timestamp

    const newRow = headers.map(header => {
      // Handle simple values or defaults
      return data[header] || "";
    });

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 3: Run Setup
1.  Select `setup` from the dropdown at the top.
2.  Click **Run**.
3.  Grant permissions.
4.  Check your Google Sheet — all the columns (Amenities, Water, Power, etc.) should be created automatically.

### Step 4: Connecting it
If you want to build a **"Verifier App"** (a private page on your website only visible to you) to fill this out on your phone:
1.  Deploy this script as a Web App (Exec as: Me, Access: Anyone).
2.  Send me the **Web App URL**.
