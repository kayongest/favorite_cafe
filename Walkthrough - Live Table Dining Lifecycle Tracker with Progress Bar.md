# Walkthrough - Live Table Dining Lifecycle Tracker with Progress Bar

We have successfully implemented the **Live Table Dining Progress Tracker** across the platform!

---

## 📊 5-Stage Live Progress Bar Lifecycle

Each table transitions dynamically through 5 visual stages:

1. 🔵 **1. Seated (20% Progress - Blue `bg-primary`)**
   - Customer arrived, greeted & seated. Menus and water provided.
2. 🟡 **2. Cooking / Serving (45% Progress - Amber `bg-warning`)**
   - Order sent to kitchen; chefs cooking, appetizers & mains being served.
3. 🟠 **3. Dining & Eating (70% Progress - Info `bg-info`)**
   - Customers actively eating & enjoying their meal. Live elapsed timer running (e.g. `Timer: 38 min`).
4. 🔴 **4. Bill / Payment (90% Progress - Red `bg-danger`)**
   - Bill requested or payment being processed (RWF Mobile Money / Card / Cash).
5. 🟢 **5. Cleared & Vacant (100% Progress - Green `bg-success`)**
   - Customers departed; table cleaned, sanitized, and ready for the next walk-in or reservation!

---

## 🖥️ Key Interface Enhancements

### 1. Admin Dashboard Table Progress Tracker (`admin.html`)
- **New Sidebar Tab**: **Table Progress** (`data-tab="tables"`) displaying active table counters (`4 Active`).
- **Interactive Table Grid**: Live visual cards for Table #1 through Table #8 featuring:
  - Table number & seating zone badge (Main Hall, Terrace Outdoor, VIP Lounge, Garden Gazebo).
  - Customer name & party size.
  - Live animated striped progress bar (`progress-bar progress-bar-striped progress-bar-animated`).
  - Stage indicator badge & description.
  - Action button: `▶ Next Stage` (advances stage automatically) or `🛋️ Seat New Guests`.

---

## Files Updated

- [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html): Added "Table Progress" sidebar menu item, badge counter, stage legend bar, and `#liveTablesProgressGrid` container.
- [css/admin.css](file:///c:/xampp/htdocs/restaurante/css/admin.css): Added `.table-tracker-card`, animated `.progress-bar` rules, and status styling.
- [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js): Added `loadAdminTables()`, `renderAdminTablesTracker()`, `advanceTableStage()`, and persistent stage updates.
