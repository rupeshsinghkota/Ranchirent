# How to Start Ads for Customers (Tenants)

Based on your current setup, you are ready to start **Facebook/Instagram Ads** immediately because your Pixel (`1774875569893560`) is already configured in the code.

For **Google Ads**, you first need to generate your Measurement ID and replace the placeholders.

---

## 🟢 Option 1: Facebook/Instagram Ads (Fastest Start)

This is best for generating a high volume of inquiries quickly.

### **Step 1: Prerequisites**
*   [x] **Pixel Installed**: Your Pixel ID `1774875569893560` is live on the site.
*   [x] **Ad Creatives**: You have `StressFree`, `Trust`, `Urgency` images in your `ad_creatives` folder.
*   [x] **Lead Tracking**: We have already set up tracking for "Call Now" and "WhatsApp" buttons.

### **Step 2: Campaign Setup (Ads Manager)**
1.  Go to **[Facebook Ads Manager](https://adsmanager.facebook.com/)**.
2.  Click **Create** (Green Button).
3.  **Objective**: Select **Leads** (or "Sales" if you want to optimize for conversions).
4.  **Conversion Location**: Select **Website**.
5.  **Performance Goal**: Select **Maximize number of conversions**.
6.  **Pixel**: Select your pixel (`1774875569893560`) and choose **Contact** or **Lead** as the event.

### **Step 3: Audience Targeting**
*   **Location**: Ranchi, Jharkhand (+10-25 km radius).
*   **Age**: 22 - 45 (Working professionals and young families).
*   **Interests**:
    *   *Real Estate*
    *   *Apartment*
    *   *Flat hunting*
    *   *Property finder*

### **Step 4: Ad Setup**
*   **Format**: Single Image or Carousel.
*   **Media**: Upload the images from your `ad_creatives` folder (e.g., `Ad_Creative_StressFree.png`).
*   **Primary Text**:
    > "Looking for a flat in Ranchi without the brokerage hassle? 🏠✨
    > Verified owners. Zero spam. 100% Genuine Listings.
    > Tap 'Learn More' to browse available 2BHK & 3BHK flats now!"
*   **Headline**: "Ranchi's #1 Verified Flat Rental Platform"
*   **Button**: Learn More (Link to `https://ranchirent.in/listings`)

---

## 🔴 Option 2: Google Ads (High Intent)

This is reliable for people specifically searching "flats for rent in Ranchi".

### **Step 1: Fix Tracking Code**
You currently have placeholders in `components/Analytics.tsx`. You need to:
1.  Create a Google Ads Account.
2.  Get your **Measurement ID** (starts with `G-`) and **Conversion ID** (starts with `AW-`).
3.  Replace the `G-XXXXXXXXXX` and `AW-XXXXXXXXXX` in `components/Analytics.tsx`.

### **Step 2: Campaign Setup**
1.  **Type**: Search Campaign.
2.  **Keywords**:
    *   "Flats for rent in Ranchi"
    *   "2BHK rent in Lalpur"
    *   "Room for rent near me"
3.  **Bidding**: Maximize Clicks (to start) -> switch to Maximize Conversions later.

---

## ⚡ Recommended Strategy: "The Traffic Blaster"

Since you are just starting, run a **Facebook Traffic Campaign** first to get people used to your brand.

1.  **Budget**: ₹500/day.
2.  **Optimization**: Landing Page Views.
3.  **Goal**: Get them to view properties. Once they visit, your "Floating Contact Buttons" (WhatsApp/Call) will capture them.
