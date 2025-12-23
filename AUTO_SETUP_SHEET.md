# One-Click Sheet Setup

If you are tired of manual setup, just copy this code, paste it into your Script Editor, and click **Run**.

It will:
1.  Create the `simple_verification` tab automatically.
2.  Add all the correct headers (Owner Name, Rent, Photo Link, etc.).
3.  Fix any tab name issues.

### The Code

```javascript
function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "simple_verification"; // The name our code looks for
  let sheet = doc.getSheetByName(sheetName);

  // 1. Create the tab if it doesn't exist
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
  }
  
  // 2. Clear old headers and set NEW Correct Headers
  sheet.clear();
  const headers = [
      "Owner Name", 
      "Owner Phone", 
      "Flat No", 
      "Rent", 
      "Deposit", 
      "Maintenance", 
      "Tenant Pref", 
      "Non-Veg?", 
      "Water Source", 
      "Power Backup", 
      "Lift", 
      "Parking", 
      "Furnishing Details", 
      "Amenities", 
      "Photo Link", // The most important one
      "Notes"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.getRange(1, 1, 1, headers.length).setBackground("#d9ead3"); // Light green header
  
  Logger.log("SUCCESS: Tab 'simple_verification' is ready!");
}
```

### How to Run
1.  Paste this into your script editor (you can paste it below the `doPost` function).
2.  Select **`setup`** from the function dropdown at the top.
3.  Click **Run**.
4.  Go back to your Google Sheet — you will see the new tab ready to go!
