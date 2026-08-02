# Implementation Plan - Receipt QR Code, Mobile Money Gateway & Email/SMS Notification Logs

Enhance the receipt printing with EBM QR verification codes, upgrade the Mobile Money gateway with MTN/Airtel operator selection & USSD PIN simulator, and launch a system-wide Email/SMS Notification Log Center.

---

## 1. Feature Specifications

### 🧾 A. Thermal Receipt Printing with QR Code
- **RRA EBM QR Code Verification**:
  - Render an authentic E-Tax QR Code on the printable receipt modal (`#receiptModal` & `#adminReceiptModal`).
  - Displays Invoice Number, TIN: `102938475`, SDC ID, and verification link.
  - Itemized RWF breakdown with 18% VAT calculation.
  - `@media print` optimized formatting for thermal receipt printers (80mm / A4).

### 📲 B. Mobile Money (MTN MoMo vs Airtel Money) Gateway
- **Dual Operator Selection**:
  - Operator choice: **MTN Mobile Money** (Yellow `#ffcc00`) vs **Airtel Money** (Red `#ff0000`).
- **Interactive USSD Push Simulator (`#momoUssdModal`)**:
  - Displays USSD phone prompt screen (`*182#` for MTN / `*182*8#` for Airtel).
  - Includes interactive 4-digit PIN input simulator (`* * * *`).
  - Generates unique transaction reference (e.g., `TXN-MOMO-849201`).

### 🔔 C. Email & SMS Notification Center Log
- **System Notification Feed Modal (`#notificationLogModal`)**:
  - Header bell icon button with live unread badge counter.
  - Timeline log feed recording all dispatched messages:
    - 📲 `[SMS]` Order confirmations & live delivery updates to customer phone.
    - 📧 `[Email]` Table booking tickets & electronic PDF invoices.
    - 🔔 `[Kitchen Alert]` Real-time status updates when chefs mark orders cooking/ready.
  - Filter logs by type (`All`, `SMS Logs`, `Email Logs`, `System Alerts`).

---

## Proposed Changes

### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Add EBM QR Code to `#receiptModal`.
- Upgrade `#momoUssdModal` with MTN/Airtel brand toggles & PIN pad simulation.
- Add Notification Bell button & `#notificationLogModal`.

### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Add Notification Bell trigger in topbar opening `#notificationLogModal`.
- Add QR Code to Admin receipt printer view.

### [MODIFY] [css/style.css](file:///c:/xampp/htdocs/restaurante/css/style.css)
- Add styles for receipt QR code, operator pills (MTN Yellow / Airtel Red), PIN pad simulator, and notification feed items.

### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Add Notification logger helper `logNotification(type, recipient, message, title)`.
- Trigger automatic SMS/Email log creation during checkout, table booking, payment, and order timeline updates.
- Connect MoMo PIN input validation and receipt QR generation.

---

## Verification Plan

### Manual Verification
1. **Receipt QR Code Test**: Place an order, click "Print Receipt", verify QR code is rendered and visible in print preview.
2. **Mobile Money Operator Test**: Select MTN MoMo vs Airtel Money, enter phone number, test PIN simulator popup, approve payment.
3. **Notification Log Test**: Click the Notification Bell in header, verify log history records all sent SMS & Email alerts.
