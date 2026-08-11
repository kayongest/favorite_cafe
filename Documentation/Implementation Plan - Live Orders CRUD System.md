# Implementation Plan - Live Orders CRUD System

Provide complete CRUD (Create, Read, Update, Delete) capabilities for Live Orders in the Favorite Cafe Admin Dashboard (`admin.html`), backed by a hybrid backend API (`api/orders.php`) and persistent `localStorage` synchronization.

## User Review Required

> [!IMPORTANT]
> - **Live Orders CRUD Modals**: Admins will be able to create manual walk-in / phone orders, inspect comprehensive order details, edit order items/totals/customer info, and purge canceled or test orders directly from the dashboard.
> - **Real-Time Overview Sync**: Creating, updating, or deleting orders automatically updates all dashboard KPIs (Total Revenue, Active Orders, Kitchen Preparing counts) in real-time.

## Proposed Changes

---

### Backend Layer

#### [NEW] [orders.php](file:///c:/xampp/htdocs/favorite_cafe/api/orders.php)
- Implements `GET`, `POST` (create), `PUT/POST` (update), and `DELETE` endpoints for orders.
- Automatically creates `orders` table in MySQL if connected, or syncs with `api/orders.json` for file-based fallback.
- Supports filtering by status and search queries.

#### [NEW] [orders.json](file:///c:/xampp/htdocs/favorite_cafe/api/orders.json)
- Pre-seeded initial order data (e.g. MSH-1329, MSH-1972, MSH-8542) for file-DB fallback.

---

### Admin Dashboard UI

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- Add **`+ New Live Order`** primary button to the Live Orders Dispatch Board header (`#tab-orders`).
- Update table actions header in `#fullOrdersDispatchTbody` to accommodate View (`👁️`), Edit (`✏️`), Delete (`🗑️`), and Receipt (`🧾`) controls.
- Append **Create / Edit Live Order Modal** (`#orderModal`).
- Append **View Order Details Modal** (`#viewOrderModal`).
- Append **Delete Order Confirmation Modal** (`#deleteOrderModal`).

---

### JavaScript Application Logic

#### [MODIFY] [admin.js](file:///c:/xampp/htdocs/favorite_cafe/js/admin.js)
- Update `loadAdminOrders()` and `saveAdminOrders()` to fetch/persist orders via `api/orders.php` while keeping `localStorage` synchronized.
- Add `openCreateOrderModal()`: clear form fields, set modal title to "Create New Live Order".
- Add `openEditOrderModal(orderId)`: pre-fill order details (customer name, phone, address/table, service type, status, payment method, summary, total) and open modal.
- Add `saveLiveOrderForm()`: validate input, generate order ID (`MSH-XXXX`) for new orders or update existing order, persist data, refresh table & stats, display success toast.
- Add `openViewOrderModal(orderId)`: render modal with complete breakdown (items list, pricing, customer metadata, service option, live status badge).
- Add `promptDeleteOrder(orderId)` and `confirmDeleteLiveOrder()`: handle order deletion with double-confirmation modal, update stats, and notify user.
- Update `renderFullOrdersDispatchBoard()`: add action buttons for View, Edit, Delete, and Receipt in each order row.

---

## Verification Plan

### Automated & API Verification
- Test `GET c:\xampp\htdocs\favorite_cafe\api\orders.php?action=get` response via PHP CLI or web request to verify valid JSON output.

### Manual Verification
1. **Create Order (C)**:
   - Click `+ New Live Order` in `admin.html`.
   - Fill in customer name, phone, service type, table/address, status, items, and total.
   - Click "Save Order" -> Verify new order appears in the dispatch board table and revenue/order stats update.
2. **Read Order Details (R)**:
   - Click the **View (eye icon)** button on an order row.
   - Verify modal opens with complete formatted order summary, customer info, and items.
3. **Update Order (U)**:
   - Change order status via the row status dropdown -> Verify status pill updates instantly.
   - Click **Edit (pencil icon)** on an order row -> Change customer name or total amount -> Save and verify table updates.
4. **Delete Order (D)**:
   - Click **Delete (trash icon)** on an order row -> Confirm deletion -> Verify order is removed from table and stats update accordingly.
