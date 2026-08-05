# Implementation Plan - Demo Accounts Cleanup & Admin Menu CRUD System

Remove all hardcoded demo accounts, maintain real user accounts, and implement a full **Menu CRUD System** (Create, Read, Update, Delete) in the Admin Dashboard with real-time sync to the main restaurant website.

## 1. Demo Accounts Cleanup
- Remove hardcoded demo seed accounts (`customer@favoritecafe.com`, `eric@favoritecafe.com`, `raul@favoritecafe.com`) from `js/main.js`, `js/admin.js`, and `api/auth.php`. 
- Maintain real user accounts created via registration in MySQL `users` table and `localStorage`.
- Update login verification so only real registered accounts can sign in.

---

## 2. Menu CRUD System (Create, Read, Update, Delete)

### MySQL `menu_items` Table Schema
```sql
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(150) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT 5.0,
  `reviews_count` int(11) DEFAULT 12,
  `calories` int(11) DEFAULT 350,
  `prep_time` int(11) DEFAULT 15,
  `description` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT 'Popular',
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Backend PHP API (`api/menu.php`)
- `action=get`: Fetches menu items list.
- `action=add`: Inserts new dish record.
- `action=update`: Updates title, category, price, prep time, calories, description, tags, and image.
- `action=delete`: Deletes dish record by ID.
- `action=toggle`: Switches stock availability (`is_available`).

### Admin Dashboard UI (`admin.html` & `js/admin.js`)
- **Menu Management Tab (`#tab-menu`)**:
  - `+ Add New Dish` button opening `#menuItemModal`.
  - Dynamic Menu Cards Grid displaying dish thumbnail, category pill, title, price, stock toggle, **Edit** button, and **Delete** button.
  - Interactive Modal for Adding & Editing dish details.

### Main Customer Website Sync (`index.html` & `js/main.js`)
- `renderCustomerMenu()`: Dynamically fetches and renders menu items in `#menu` grid so newly created or edited dishes immediately appear to customers for ordering!

---

## Proposed File Changes

### [NEW Files]

#### [NEW] [api/menu.php](file:///c:/xampp/htdocs/restaurante/api/menu.php)
- PHP API endpoint for Menu CRUD operations against MySQL database.

---

### [Modified Files]

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html)
- Add Add/Edit Menu Item Modal (`#menuItemModal`).
- Update Menu & Stock section (`#tab-menu`) to feature full CRUD controls.

#### [MODIFY] [js/admin.js](file:///c:/xampp/htdocs/restaurante/js/admin.js)
- Add Menu CRUD functions: `loadAdminMenu()`, `openAddMenuModal()`, `openEditMenuModal()`, `saveMenuItem()`, `deleteMenuItem()`, `toggleMenuItemStock()`.

#### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Remove hardcoded demo accounts.
- Implement dynamic menu rendering for customer site (`renderCustomerMenu()`).

---

## Verification Plan

### Automated / Code Verification
- Inspect syntax across `api/menu.php`, `admin.html`, `js/admin.js`, and `js/main.js`.

### Manual Verification
1. **Demo Account Removal Test**: Verify no pre-populated demo users exist. Register a real account, sign in, and confirm only registered accounts are authenticated.
2. **Create Menu Item Test**: In Admin Dashboard under "Menu & Stock", click `+ Add New Item`, fill details (e.g. `Kigali Special Grilled Wings`, `$15.99`), click Save. Verify dish appears on Admin grid with success Toast.
3. **Customer Site Sync Test**: Go to main site (`index.html`) and verify the newly added dish `Kigali Special Grilled Wings` appears in the Menu grid and can be added to the Cart!
4. **Update & Delete Test**: Edit dish price in Admin and test deleting a dish. Verify changes sync immediately.
