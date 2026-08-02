# Implementation Plan - Fully Functioning Table Seating & Lifecycle Stage Controller

Ensure that clicking **"🛋️ Seat New Guests"** on any vacant table (Stage 5) opens an interactive seating dialog allowing staff to assign guests, set party size, and start the live dining timer immediately at **Stage 1: Seated (20% - Blue)**, with real-time progress bar transitions and live timer updates.

---

## 5-Stage Functioning Lifecycle

```
[Vacant (100% Green)] 
    ↓ (Click "Seat New Guests" -> Assign Name & Party Size)
[Stage 1: Seated (20% Blue)] ➔ Timer starts (0 min)
    ↓ (Click "▶ Next Stage")
[Stage 2: Cooking / Serving (45% Amber)]
    ↓ (Click "▶ Next Stage")
[Stage 3: Dining & Eating (70% Info Cyan)] ➔ Live elapsed timer running
    ↓ (Click "▶ Next Stage")
[Stage 4: Bill / Payment (90% Red)]
    ↓ (Click "🧹 Clear Table")
[Stage 5: Cleared & Vacant (100% Green)] ➔ Table sanitized & free for next guests
```

---

## Proposed Changes

### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Add **Seat Guest Modal (`#seatGuestModal`)**:
  - Modal with form inputs for Table Name, Customer/Party Name, and Guest Count.
  - "Confirm & Seat Guests" button.

### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Update `advanceTableStage(tableId)`:
  - When table is at Stage 5, trigger `openSeatGuestModal(tableId)`.
  - Add `confirmSeatGuestSubmit(e)` to record guest name, start time (`Date.now()`), set stage to 1 (Seated - 20% Blue), and save state.
- Add live 10-second ticker interval (`setInterval`) to update elapsed dining timers automatically.

---

## Verification Plan

### Manual Verification
1. **Seat Guests Test**: Find any vacant table (e.g. Table #6 at 100% Green), click "🛋️ Seat New Guests". Verify `#seatGuestModal` pops up. Enter name "Alice Smith", select "3 Guests", click "Confirm & Seat". Verify table transforms to **Stage 1: Seated (20% Blue)** with timer `1 min`.
2. **Stage Progression Test**: Click "▶ Next Stage" sequentially and verify stage transitions:
   - 20% Blue (Seated) ➔ 45% Amber (Cooking) ➔ 70% Cyan (Dining) ➔ 90% Red (Bill) ➔ 100% Green (Cleared).
3. **Live Timer Check**: Observe elapsed duration counter incrementing automatically.
