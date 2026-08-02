# Category Management (CRUD) for Favorite Cafe

Provide full Category CRUD capability (Create, Read, Update, Enable/Disable, Delete) in the Admin Portal, and dynamically synchronize the filter button bar on the customer website.

## User Review Required

> [!IMPORTANT]
> **Category Disabling**: When a category is disabled, its filter button will be hidden on the customer website (`index.html`), but existing dishes belonging to that category remain in the database for record keeping.

## Proposed Changes

### API & Database

#### [NEW] [categories.php](file:///c:/xampp/htdocs/favorite_cafe/api/categories.php)
- Handle Category CRUD actions (`get`, `add`, `update`, `toggle`, `delete`).
- Create and auto-migrate the `categories` MySQL table (`id`, `name`, `slug`, `icon`, `is_active`, `sort_order`).
- Seed default categories (`Coffee`, `Tea`, `Smoothies`, `Shakes`, `Juices`, `Mains`, `Salads`, `Sides`).

#### [NEW] [categories.json](file:///c:/xampp/htdocs/favorite_cafe/api/categories.json)
- Static fallback JSON file for GitHub Pages or offline caching containing default categories.

---

### Admin Portal

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- Add a new **"Categories"** tab in sidebar navigation under Menu Management.
- Add a Category Management section with an interactive table/cards showing Icon, Category Name, Slug, Status (Active/Disabled), Dish Count, and Action buttons (Edit, Enable/Disable, Delete).
- Add **"Add New Category"** and **"Edit Category"** modal popups.

#### [MODIFY] [admin.js](file:///c:/xampp/htdocs/favorite_cafe/js/admin.js)
- Implement `loadCategoriesAdmin()`, `saveCategory()`, `editCategory()`, `toggleCategoryStatus()`, and `deleteCategory()`.
- Dynamically populate category select dropdowns in the Dish Creation modal.

---

### Customer Website

#### [MODIFY] [index.html](file:///c:/xampp/htdocs/favorite_cafe/index.html)
- Add unique ID container (`#categoryFilterBar`) to the menu filter button bar for dynamic JS rendering.

#### [MODIFY] [main.js](file:///c:/xampp/htdocs/favorite_cafe/js/main.js)
- Implement `loadDynamicCategories()` to fetch active categories from `api/categories.php` / `api/categories.json` / `localStorage` (`favcafe_categories`) and render active category filter buttons.

---

## Verification Plan

### Automated Verification
- Execute PHP CLI tests (`c:\xampp\php\php.exe api/categories.php?action=get`) to verify JSON API response structure.
- Verify JavaScript syntax with Node (`node -c js/admin.js` and `node -c js/main.js`).

### Manual Verification
- Test adding a new category (e.g. "Desserts" or "Mocktails") in `admin.html`.
- Test editing an existing category name/icon.
- Test toggling a category status to Disabled and verifying it immediately hides on `index.html`.
- Test Git push to `https://github.com/kayongest/favorite_cafe.git`.
