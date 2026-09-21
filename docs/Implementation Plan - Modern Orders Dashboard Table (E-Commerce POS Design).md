# Implementation Plan - Modern Orders Dashboard Table (E-Commerce POS Design)

Redesign the Admin Orders Table and Dispatch Board in `admin.html` and `js/admin.js` to match the clean, professional e-commerce order management interface shown in the reference design.

## User Review Required

> [!NOTE]
> The updated design introduces structured status pills for both **Payment Status** (`PAID ✓`, `PENDING 🕒`, `FAILED ✕`) and **Fulfilment Status** (`ORDER RECEIVED 📩`, `CONFIRMED 📋`, `PREPARING 🍳`, `READY 📦`, `ON THE WAY 🛵`, `DELIVERED 🏠`, `CLOSED ✓`), along with customer avatar initials, delivery type tags, date/time formatting, select checkboxes, and top filter pill counters.

## Proposed Changes

### Component 1: Admin Interface Layout (`admin.html`)

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- Add modern breadcrumb navigation (`Dashboard > Orders > Dispatch Board`).
- Update status filter tab bar with live order counts (e.g. `All (7)`, `Pending (1)`, `Preparing (2)`, `Ready (1)`, `Completed (3)`).
- Add modern toolbar containing:
  - Search input box with icon
  - Payment Status dropdown filter
  - Fulfilment Stage dropdown filter
  - `Export CSV` button & `+ Add Order` button.
- Update table headers to include:
  - `[ ]` Select All Checkbox
  - `ORDER`
  - `TOTAL`
  - `CUSTOMER`
  - `PAYMENT STATUS`
  - `FULFILMENT STATUS`
  - `DELIVERY TYPE`
  - `DATE & TIME`
  - `ACTIONS`

---

### Component 2: Admin JavaScript Controller (`js/admin.js`)

#### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/favorite_cafe/js/admin.js)
- Update `renderFullOrdersDispatchBoard()` and `renderOrdersTable()` to format row data according to the reference screenshot:
  - Row selection checkbox.
  - `#FC-XXXX` order badge with link styling.
  - Avatar image / gradient letter circle (`A`, `F`, `K`, `E`) + Customer Name + Phone.
  - Payment status pill (`PAID ✓` for MoMo/Card, `PENDING 🕒` for Cash on delivery).
  - Fulfilment status pill with matching colors & icons for all 7 lifecycle stages.
  - Delivery type tag (e.g. `Cash on delivery`, `Local delivery`, `Dine-in`, `Takeaway`).
  - Formatted date & time (`Sep 21, 3:30 PM`).
  - Action buttons (`1-Click Advance Button`, `Cancel`, `View`, `Edit`, `Print Receipt`, `Disable`).
- Add Export Orders to CSV helper function (`exportOrdersCsv()`).
- Update status counters dynamically on tab filter pills.

---

### Component 3: CSS Styling (`css/mobile_app.css` / `css/admin.css`)

#### [MODIFY] [css/mobile_app.css](file:///c:/xampp/htdocs/favorite_cafe/css/mobile_app.css)
- Add custom styles for reference status pills:
  - `.pill-payment-paid` (Green bg, dark green text, check icon)
  - `.pill-payment-pending` (Amber bg, dark orange text, clock icon)
  - `.pill-payment-failed` (Red bg, red text, times icon)
  - `.pill-fulfilment-*` (Distinct stage pill styling)
  - `.cust-avatar-circle` (Customer initials avatar styling)
  - `.table-checkbox` (Custom rounded checkboxes)

---

## Verification Plan

### Automated Tests
- Syntax verification via Node.js CLI:
  `node -c js/admin.js`
  `node -c js/main.js`

### Manual Verification
- Open `http://localhost/favorite_cafe/admin.html` in browser.
- Verify status filter pills count items accurately.
- Verify search & dropdown filters filter the order rows cleanly.
- Verify Payment Status pills and Fulfilment Status pills render icons & colors.
- Verify 1-click stage advance buttons correctly update statuses live across the 7 stages.
- Test CSV export functionality.
