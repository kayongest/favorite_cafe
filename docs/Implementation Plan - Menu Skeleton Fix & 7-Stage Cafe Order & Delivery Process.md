# Implementation Plan - Menu Skeleton Fix & 7-Stage Cafe Order & Delivery Process

This plan covers two key enhancements:
1. **Fixing Infinite Menu Skeleton Loading** while preserving initial skeleton animations on slow connections.
2. **Implementing the 7-Stage Core Order & Delivery Workflow** across the Customer interface, Staff/Kitchen Admin portal, and Order API.

---

## 1. Core Workflow (7 Stages)

Every order will transition through these 7 clear stages:

| Stage # | Stage Name | Action By | Status Shown to Customer | Admin / Staff Transition Action |
|---|---|---|---|---|
| **1** | Order Placed | Customer | `Order Received` | Initial state when customer submits cart |
| **2** | Order Confirmed | Cashier / Staff | `Confirmed – Preparing Soon` | Click **Confirm Order** |
| **3** | Preparing | Kitchen / Chef | `Being Prepared` | Click **Start Preparing** |
| **4** | Ready | Kitchen / Expeditor | `Ready` | Click **Mark Ready** |
| **5** | Out for Delivery | Driver / Dispatcher | `On the Way` | Click **Send Out (On the Way)** |
| **6** | Delivered | Driver / Customer | `Delivered` | Click **Mark Delivered** |
| **7** | Closed | System / Admin | `Closed (Receipt & Feedback)` | Click **Close Order & Request Rating** |

---

## Proposed Changes

### Component 1: Menu Skeleton Loading Fix

#### [MODIFY] [menu.php](file:///c:/xampp/htdocs/favorite_cafe/api/menu.php)
- Auto-seed from `api/menu.json` if MySQL table `menu_items` is empty (`count($items) === 0`) so the API always returns data.

#### [MODIFY] [main.js](file:///c:/xampp/htdocs/favorite_cafe/js/main.js)
- Keep skeleton card placeholders visible during active data fetching for slow networks.
- In `loadDynamicCustomerMenu()`, fall back to `menu.json` or cached items if DB payload is empty.
- In `renderCustomerMenuItems()`, replace skeleton cards with dish cards when loaded, or with a friendly empty state message if no dishes match a category.

---

### Component 2: 7-Stage Order & Delivery Workflow

#### [MODIFY] [orders.php](file:///c:/xampp/htdocs/favorite_cafe/api/orders.php)
- Support default status `Order Received` on new order creation.
- Add backend endpoint action `update_status` supporting the 7 standard stages (`Order Received`, `Confirmed – Preparing Soon`, `Being Prepared`, `Ready`, `On the Way`, `Delivered`, `Closed`).

#### [MODIFY] [main.js](file:///c:/xampp/htdocs/favorite_cafe/js/main.js)
- Update default order creation status to `Order Received`.
- Update the customer **My Orders Timeline Modal** (`renderTimelineStepProgress` & timeline stepper) to render 7 step progression bars corresponding to the 7 stages:
  1. `Order Received`
  2. `Confirmed – Preparing Soon`
  3. `Being Prepared`
  4. `Ready`
  5. `On the Way` (or `Ready for Pickup / Table`)
  6. `Delivered`
  7. `Closed (Enjoy & Rate Us)`
- Add rating/feedback prompt for orders in the `Closed` stage.

#### [MODIFY] [index.html](file:///c:/xampp/htdocs/favorite_cafe/index.html) & [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- Update the Admin / Kitchen order table action buttons to advance orders step-by-step through the 7 stages with visual status badges:
  - `Order Received` -> **[Confirm Order]**
  - `Confirmed – Preparing Soon` -> **[Start Preparing]**
  - `Being Prepared` -> **[Mark Ready]**
  - `Ready` -> **[Send Out (On the Way)]**
  - `On the Way` -> **[Mark Delivered]**
  - `Delivered` -> **[Close Order]**
  - `Closed` -> **[Done / Archived]**

---

## Verification Plan

### Automated / CLI Verification
- Test `C:\xampp\php\php.exe c:\xampp\htdocs\favorite_cafe\api\menu.php` to verify menu item output.
- Test `C:\xampp\php\php.exe c:\xampp\htdocs\favorite_cafe\api\orders.php` to verify order status transitions.

### Manual Customer & Admin Workflow Verification
1. Place an order on customer site `index.html`. Verify initial status displays **"Order Received"** (Stage 1).
2. Open Admin Panel/Modal, click **Confirm Order** -> verify customer timeline updates live to **"Confirmed – Preparing Soon"** (Stage 2).
3. Click **Start Preparing** -> verify status updates to **"Being Prepared"** (Stage 3).
4. Click **Mark Ready** -> status updates to **"Ready"** (Stage 4).
5. Click **Send Out** -> status updates to **"On the Way"** (Stage 5).
6. Click **Mark Delivered** -> status updates to **"Delivered"** (Stage 6).
7. Click **Close Order** -> status updates to **"Closed"** and displays rating/feedback link (Stage 7).
