# Implementation Plan - Standalone Full-Page Admin Dashboard (`admin.html`)

Create a state-of-the-art, full-page Admin Dashboard page (`admin.html`) inspired by modern restaurant management systems (like Costic Dashboard) that opens seamlessly in a new browser tab upon Admin sign in.

## Key Features & Layout Architecture

### 1. Modern Dashboard Layout & Navigation
- **Sidebar Navigation** (Dark Theme `#442406` with accent color highlights):
  - Brand branding (`Favorite Cafe Admin`)
  - Navigation Sections:
    - 📊 **Overview**: KPI stat cards, sales overview, recent orders table, top dishes.
    - 📦 **Live Orders**: Real-time kitchen & delivery management board with status filters (`All`, `Preparing`, `Ready`, `Delivered`).
    - 🍔 **Menu & Inventory**: Stock availability toggles, item pricing, item status controls.
    - 📈 **Analytics & Reports**: Visual revenue breakdown, top selling categories, export tools.
    - ⚙️ **Settings**: Restaurant operating hours, delivery radius, staff access.
- **Top Bar**:
  - Global dashboard search bar
  - Real-time digital clock badge
  - Notifications bell with live alert indicator
  - Quick "Export Report" & "Refresh Kitchen" action buttons
  - Admin Staff profile menu with "Exit to Restaurant" & "Logout" actions.

### 2. High-Impact Dashboard Widgets
- **4 KPI Summary Cards**:
  - Today's Revenue ($1,840.50 +14%)
  - Total Orders (128 orders)
  - Kitchen Preparing (12 active orders)
  - Avg. Prep & Delivery Speed (22 mins)
- **Interactive Live Orders Table**:
  - Columns: Order ID, Customer Details, Items, Service Type (Delivery/Takeaway/Dine-In), Total Price, Status Badge, Quick Status Advance button (`Mark Cooking`, `Mark Ready`, `Complete`).
  - Search & filter inputs to filter orders instantly.
- **Kitchen Live Status Grid**:
  - Visual tickets showing active kitchen prep orders with timers.
- **Top Dishes Showcase & Quick Stock Controls**:
  - Instant switches to toggle dish stock status (In Stock / Sold Out).

---

## Proposed New Files & Changes

### [NEW Files]

#### [NEW] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Full-page standalone Admin Dashboard markup.

#### [NEW] [css/admin.css](file:///c:/xampp/htdocs/restaurante/css/admin.css)
- Admin layout, sidebar styles, analytical stat cards, status badges, kitchen tickets, and responsive layout rules.

#### [NEW] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Admin dashboard script handling order status transitions, live search, inventory stock switches, and stats updates.

---

### [Modified Files]

#### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Update Admin Sign In modal button to open `admin.html` in a new browser tab (`window.open('admin.html', '_blank')`).

#### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Update `handleAdminLogin()` to launch `admin.html` in a new tab upon successful authentication.

---

## Verification Plan

### Automated / Code Verification
- Inspect syntax across `admin.html`, `css/admin.css`, and `js/admin.js`.

### Manual Verification
1. **Admin Login Navigation**: Click "Login / Account", select "Admin Portal" tab, click "Quick Demo Admin Login" or enter admin credentials. Verify `admin.html` opens in a new browser tab.
2. **Sidebar Navigation Test**: Click between sidebar tabs (Overview, Live Orders, Menu Stock, Analytics) to verify section toggling.
3. **Live Order Management Test**: Advance an order status from "Kitchen Preparing" to "Ready" to "Completed". Verify badge updates and stats sync in real-time.
4. **Stock Control Test**: Toggle menu item stock status switches and verify immediate visual feedback.
