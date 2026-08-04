# Implementation Plan - Staff Attribution Audit, Order Archiving & Active Kitchen Tickets

Enhance the **Live Orders CRUD system** with staff attribution tracking (Accepted By, Chef Prepared By, Served By), convert hard deletion to **Disable / Archive** for historical reporting, and update the Overview tab with dynamic **Active Kitchen Live Tickets** badges.

## User Review Required

> [!IMPORTANT]
> - **Disable / Archive vs Hard Delete**: Orders will no longer be purged from reporting. Instead, admins can disable/archive an order (`status: 'Disabled / Archived'`), keeping full financial records for reporting while hiding it from active kitchen workflows.
> - **Staff Attribution Audit**: Every order now records:
>   - **Accepted By**: Cashier/Staff who took the order.
>   - **Prepared By**: Chef who cooked the dish in the kitchen.
>   - **Served / Delivered By**: Waiter or driver who completed service.
> - **Overview Kitchen Tickets Widget**: Active kitchen live tickets in `#tab-overview` will highlight live preparing/ready orders and display badges (`badge-success sm` / `bg-success`) for completed orders.

## Proposed Changes

---

### Backend Layer

#### [MODIFY] [orders.php](file:///c:/xampp/htdocs/favorite_cafe/api/orders.php)
- Add columns `accepted_by`, `prepared_by`, `served_by`, `is_disabled` to the MySQL table and JSON fallback logic (`api/orders.json`).
- Support `action=disable` / `action=archive` to mark an order as disabled without removing it from reporting history.

#### [MODIFY] [orders.json](file:///c:/xampp/htdocs/favorite_cafe/api/orders.json)
- Update default order objects with initial staff attribution fields (`acceptedBy`, `preparedBy`, `servedBy`).

---

### Admin Dashboard UI

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- **Create / Edit Order Modal (`#orderModal`)**:
  - Add staff selection dropdowns for:
    - **Accepted By** (Cashier / Order Taker)
    - **Prepared By** (Chef / Kitchen Manager)
    - **Served / Delivered By** (Waiter / Floor Manager)
- **View Order Details Modal (`#viewOrderModal`)**:
  - Render an interactive **Staff Attribution Audit Card** showing Accepted By, Prepared By (Chef), and Served By.
  - Update action button from "Delete Order" to **"Disable / Archive Order"**.
- **Disable / Archive Confirmation Modal (`#archiveOrderModal`)**:
  - Confirm archiving an order while explaining that financial history will be preserved for reports.
- **Filter Pills**:
  - Add `Archived / Disabled` filter option in Live Orders Dispatch Board filter pills.

---

### JavaScript Logic

#### [MODIFY] [admin.js](file:///c:/xampp/htdocs/favorite_cafe/js/admin.js)
- Explicit functions for requirement (i):
  - `viewLiveOrder(orderId)`: Alias / helper for viewing order details.
  - `editLiveOrder(orderId)`: Alias / helper for editing order details.
  - `archiveDisableLiveOrder(orderId)`: Disables and archives order (`status = 'Disabled / Archived'`, `is_disabled = true`), persists data, and updates reporting & tables.
- Requirement (ii) Staff Attribution:
  - Populate staff dropdowns dynamically from `adminStaffList`.
  - Capture and save `acceptedBy`, `preparedBy`, `servedBy` when creating, editing, or advancing order status.
  - Display chef & server info in the View Order Modal and Kitchen Tickets.
- Requirement (iii) Overview Active Kitchen Tickets:
  - Update `renderKitchenGrid()`:
    - Display active kitchen orders with prep timer & quick action buttons.
    - Display completed orders with a `<span class="badge bg-success text-white small">Completed</span>` badge (`badge-success sm`).
    - Display disabled/archived orders with `<span class="badge bg-secondary text-white small">Archived</span>`.

---

## Verification Plan

### Automated & API Verification
- Run `C:\xampp\php\php.exe -l api/orders.php` to verify PHP syntax.
- Test `api/orders.php?action=get` via PHP CLI test script.

### Manual Verification
1. **Disable / Archive (i)**:
   - Click **Archive / Disable** on an order row -> Confirm prompt -> Order status changes to `Disabled / Archived` and disappears from active kitchen filter while staying preserved in dataset/reporting.
2. **Staff Attribution (ii)**:
   - Create or Edit an order -> Select Cashier, Chef, and Waiter -> Open View Details (`viewLiveOrder(id)`) -> Verify Accepted By, Prepared By, and Served By cards display accurately.
3. **Overview Active Kitchen Tickets (iii)**:
   - Switch to Overview tab -> Observe `#kitchenGrid` -> Verify active preparing orders display live actions, and completed orders feature `<span class="badge bg-success text-white">Completed</span>`.
