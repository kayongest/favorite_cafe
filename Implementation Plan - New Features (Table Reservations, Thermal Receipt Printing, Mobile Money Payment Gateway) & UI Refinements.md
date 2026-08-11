# Implementation Plan - New Features (Table Reservations, Thermal Receipt Printing, Mobile Money Payment Gateway) & UI Refinements

This plan outlines the testing verification, addition of high-impact new features (Table Reservations, Thermal Receipt Printing, Mobile Money Payment Gateway, and Order Status Notifications), followed by overall UI layout and styling refinements.

---

## 1. Test / Launch Status
- **Localhost HTTP Status**: Confirmed Apache server on XAMPP active at `http://localhost/restaurante/index.html` and `http://localhost/restaurante/admin.html`.
- **PHP Syntax & Endpoints**: All backend scripts (`api/db.php`, `api/auth.php`, `api/menu.php`, `api/upload.php`) pass syntax validation.

---

## 2. New Features To Implement

### A. Table Reservation System
- **Customer Side (`index.html`)**:
  - Interactive Table Reservation modal triggered from header "Book A Table" button or section CTA.
  - Form fields: Reservation Date, Time Slot, Party Size (Guests 1-12+), Seating Area (Main Dining, Terrace/Patio, VIP Lounge), Customer Name, Phone (MTN/Airtel RWF format), and Special Notes.
  - Instant booking confirmation ticket with unique Reservation Code (e.g., `#RES-8492`).
- **Admin Side (`admin.html`)**:
  - New **📅 Table Reservations** tab in the sidebar menu.
  - Table displaying pending/confirmed reservations with filter controls, search, and status advance (`Confirm`, `Seat Customer`, `Cancel`).

### B. Thermal Receipt Printing System
- **Customer & Admin Side (`index.html` & `admin.html`)**:
  - Clean **Print Receipt** action button on completed order cards and order detail modals.
  - Generates a styled, printable receipt (Invoice #, Customer details, RWF itemized list, Tax summary, Payment method, QR code preview).
  - Triggers native print preview (`window.print()`) with print-optimized CSS (`@media print`).

### C. Mobile Money (MTN MoMo & Airtel Money) Payment Gateway Simulation
- **Checkout Modal (`index.html`)**:
  - Payment options during checkout: **MTN Mobile Money**, **Airtel Money**, **Cash on Delivery**, **Card**.
  - For MoMo / Airtel: Prompt for Phone Number (`078X XXX XXX` / `073X XXX XXX`).
  - Interactive USSD push simulation popup ("*182# Payment Request Sent to Phone - Confirm PIN*") with progress spinner and instant payment verification.

### D. Automated Email & SMS Notification Logs
- **System-wide Toast & Notification Feed**:
  - Simulated SMS/Email notification logs sent to customer upon order placement, kitchen status update, and table booking confirmation.

---

## 3. UI Refinements & Polish

- **`index.html` Refinements**:
  - Enhanced glassmorphism for modal dialogs and navigation bar.
  - Added quick-access floating Table Reservation button next to Cart widget.
  - Improved typography, badge contrast, and micro-animations on menu item cards.
- **`admin.html` Refinements**:
  - Added new Reservation counter KPI card.
  - Polished live order ticket badges, receipt preview modal, and table layout responsiveness.

---

## Proposed File Changes

### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Add Table Reservation modal markup, Mobile Money checkout step, and receipt modal container.

### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Add "Reservations" sidebar item & tab view, Print Receipt actions on orders table, and receipt printing modal.

### [MODIFY] [css/style.css](file:///c:/xampp/htdocs/restaurante/css/style.css)
- Add styling for Table Reservation modal, Mobile Money USSD push modal, print receipt layout (`@media print`), and UI refinements.

### [MODIFY] [css/admin.css](file:///c:/xampp/htdocs/restaurante/css/admin.css)
- Add styling for Admin Reservations tab, reservation cards, and receipt view.

### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Implement Table Reservation submission logic, MoMo USSD push timer simulation, receipt generation, and print triggering.

### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Implement Admin Table Reservation management (view, filter, status change) and Admin receipt printer logic.

---

## Verification Plan

### Automated Tests
- Syntax check on modified JavaScript and CSS files.
- `C:\xampp\php\php.exe -l` on backend scripts.

### Manual Verification
1. **Table Reservation Test**: Open `index.html`, click "Book A Table", complete form, submit, verify confirmation ticket modal, then open `admin.html` to confirm it appears under "Reservations".
2. **Mobile Money Checkout Test**: Add items to cart, proceed to checkout, select MTN MoMo, enter phone number, observe USSD push simulation popup, confirm payment.
3. **Receipt Print Test**: Click "Print Receipt" on any completed order in `index.html` or `admin.html` and verify receipt formatting.
