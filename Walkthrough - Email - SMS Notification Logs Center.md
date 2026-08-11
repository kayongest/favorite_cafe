# Walkthrough - Email / SMS Notification Logs Center

The **Notification & Dispatch Logs Center** (`#notificationLogModal`) is now live across both the customer site ([index.html](file:///c:/xampp/htdocs/restaurante/index.html)) and the management portal ([admin.html](file:///c:/xampp/htdocs/restaurante/admin.html))!

---

## 🔔 Real-Time Notification & Dispatch Log Features

1. **Top Header Bell Icon**:
   - Features a live unread counter badge (`#notificationCountBadge` / `#adminNotifyDot`) on the topbar.
   - Clicking the bell opens the Notification Drawer / Modal.

2. **Automated Real-Time Logging Triggers**:
   - 📲 **Order Checkout & Payment**: Logs SMS & Email alerts when orders are submitted or approved via MoMo PIN.
   - 📲 **Kitchen Status Updates**: Logs SMS alerts to customer phones whenever chefs advance order statuses (`Preparing` ➔ `Ready` ➔ `Completed`).
   - 📧 **Table Reservations**: Logs Email booking tickets when customers book tables or admin changes reservation status.
   - 🔔 **Live Table Progress**: Logs floor staff alerts when tables advance dining stages or become cleared/vacant.

3. **Category Filtering & On-Demand Testing**:
   - Filter pills (`All Logs`, `SMS Alerts`, `Email Tickets`).
   - Interactive **`+ Send Test Alert`** button to trigger and test live dispatch logging on demand.
