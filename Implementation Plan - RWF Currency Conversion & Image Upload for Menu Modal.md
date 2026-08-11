# Implementation Plan - RWF Currency Conversion & Image Upload for Menu Modal

Convert all currency displays across the restaurant website and admin dashboard from USD ($) to **Rwandan Francs (RWF)**, and implement **Direct Image File Upload** with live preview in the Admin Menu Modal.

## Proposed Changes

### 1. Currency Conversion to RWF (Rwandan Francs)
- **Formatting Helper**: Implement `formatRWF(amount)` in JS (e.g. `5,500 RWF`).
- **Default Item Prices**:
  - Smash Burger: `5,500 RWF`
  - Margherita Royale Pizza: `7,500 RWF`
  - Nashville Hot Chicken: `6,500 RWF`
  - Truffle Mushroom Pasta: `9,000 RWF`
  - Chocolate Lava Cake: `3,500 RWF`
  - Mango Shake: `2,500 RWF`
- **UI Components Updated**:
  - Menu cards & detail popup modal.
  - Cart drawer subtotal, delivery fee, and total lines.
  - Checkout summary total.
  - My Orders history and timeline tracking modal.
  - Admin Dashboard revenue KPI cards, recent orders table, and menu pricing inputs.

---

### 2. Direct Image File Upload in Admin Menu Modal
- **PHP Upload Endpoint (`api/upload.php`)**:
  - Accepts `$_FILES['image']`.
  - Validates image mime types (`image/jpeg`, `image/png`, `image/webp`).
  - Saves file to `img/menu/` directory with a unique timestamped filename.
  - Returns `{ status: 'success', image_path: 'img/menu/dish_1722165000.jpg' }`.
- **Admin Modal UI (`admin.html`)**:
  - Replace plain text URL input with a file upload picker (`<input type="file" id="menuImageFile">`) and optional image URL fallback.
  - Add live image preview box (`#menuImagePreview`) showing the selected thumbnail instantly.
- **Admin JS Handler (`js/admin.js`)**:
  - Listens for file selection to render instant client-side preview (`FileReader`).
  - Uploads the image file via `fetch('api/upload.php')` before saving the dish to the database.

---

## Proposed File Changes

### [NEW Files]

#### [NEW] [api/upload.php](file:///c:/xampp/htdocs/restaurante/api/upload.php)
- PHP image upload handler saving uploaded files to `img/menu/`.

---

### [Modified Files]

#### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Update static price text to RWF format (`5,500 RWF`).

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Update menu modal to include file upload input and live image preview container.
- Update admin price labels to RWF.

#### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Update cart, checkout, orders, and dynamic menu renderer to format amounts as RWF.

#### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Update admin stats, table, and menu CRUD handlers to RWF currency and handle image file upload via `api/upload.php`.

#### [MODIFY] [api/menu.php](file:///c:/xampp/htdocs/restaurante/api/menu.php)
- Update default database seed prices to RWF values.

---

## Verification Plan

### Automated / Code Verification
- Test file upload endpoint `api/upload.php` and verify image creation in `img/menu/`.

### Manual Verification
1. **RWF Currency Test**: Inspect main menu, cart drawer, checkout modal, and orders tracking to confirm all prices are formatted as `5,500 RWF`.
2. **Image Upload Test**: In Admin Dashboard under "Menu & Stock", click `+ Add New Menu Item`, choose an image file from your computer, verify instant live preview, click Save, and verify the uploaded image displays on both Admin and Customer views!
