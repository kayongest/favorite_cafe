# Implementation Plan - Live Table Dining Lifecycle Tracker with Progress Bar

Track dine-in table progress in real-time from the moment guests are **Seated** ➔ **Ordering / Cooking** ➔ **Eating / Dining** ➔ **Bill / Payment** ➔ **Table Cleared & Vacant**.

---

## Key Features & Stage Breakdown

### 1. The 5 Table Dining Lifecycle Stages

| Stage | Progress | Status Color | Description |
| :--- | :--- | :--- | :--- |
| **1. Seated** | `20%` | 🔵 Blue (`bg-primary`) | Guest arrived & seated at table. Water & menus served. |
| **2. Cooking / Serving** | `45%` | 🟡 Amber (`bg-warning`) | Order placed in kitchen; appetizers/mains being prepared & served. |
| **3. Dining / Eating** | `70%` | 🟠 Orange (`bg-info`) | Guests enjoying their meal. Elapsed duration timer running. |
| **4. Bill Requested** | `90%` | 🔴 Red (`bg-danger`) | Bill requested or payment processed (RWF Mobile Money / Card). |
| **5. Cleared & Vacant** | `100%` | 🟢 Green (`bg-success`) | Guests left, table bused & sanitized. Ready for next reservation! |

---

## Architecture & Visual Layouts

### A. Admin Dashboard Table Tracker (`admin.html`)
- **New Section / Widget under "Live Orders" & "Reservations"**:
  - **Live Table Status Grid**: Interactive cards representing active tables (e.g. Table #1 to Table #12).
  - Each Table Card features:
    - Table Number & Seating Zone (Terrace / Main Dining / VIP).
    - Customer Name & Party Size.
    - **Live Progress Bar**: `progress-bar-striped progress-bar-animated` showing exact stage percentage & color.
    - Live Elapsed Duration Counter (e.g., `Timer: 34 mins elapsed`).
    - Quick Stage Control Buttons: `▶ Next Stage` (Seated ➔ Cooking ➔ Dining ➔ Bill ➔ Clear Table).

### B. Customer Dine-In Timeline Tracker (`index.html`)
- In **My Orders / Timeline Modal**:
  - For Dine-In orders, displays an active stage stepper & progress bar showing table dining status.

---

## Proposed Changes

### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Add a **Live Table Dining Tracker Grid** section in the Reservations & Orders view.
- Add progress bar table cards and quick stage advance controls.

### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Enhance `#timelineModal` stepper to display progress bar for Dine-In table status.

### [MODIFY] [css/admin.css](file:///c:/xampp/htdocs/restaurante/css/admin.css)
- Add styles for Table Tracker cards, animated progress bars, stage badges, and duration timers.

### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Add Table state management (`favoritecafe_tables`), stage transitions, live duration calculation, and automatic progress bar percentage rendering.

### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Sync Dine-In table progress bar in customer timeline modal.

---

## Verification Plan

### Automated / Code Verification
- Validate JS syntax for table lifecycle state transitions.

### Manual Verification
1. **Admin Table Progress Test**: Open `admin.html`, view Table Progress Grid, click `▶ Next Stage` on a table. Verify progress bar advances from 20% ➔ 45% ➔ 70% ➔ 90% ➔ 100% (Cleared).
2. **Timer & Color Verification**: Check that progress bar colors and stage labels update dynamically.
3. **Customer View Sync**: Verify customer timeline modal displays the corresponding table progress.
