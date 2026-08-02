# Admin Menu & Stock Enhancements Plan

Enhance the **Menu & Stock** section in the Admin Dashboard (`admin.html`) to display all database dishes, enable category filtering, and add 10-item pagination.

## User Review Required

> [!NOTE]
> **Dynamic Categories**: The category filter pills in the Menu & Stock tab will automatically synchronize with your active categories created in the Category Management tab.

## Proposed Changes

### Admin Portal UI (`admin.html`)

#### [MODIFY] [admin.html](file:///c:/xampp/htdocs/favorite_cafe/admin.html)
- Add a **Category Filter Bar** and **Dish Search Bar** at the top of `#tab-menu`.
- Add a **Pagination Footer Bar** at the bottom of `#tab-menu` showing:
  - Dish count summary (e.g. *"Showing 1 to 10 of 20 dishes"*).
  - Page navigation controls (**Prev**, **1**, **2**, **Next**).

---

### Admin Logic (`js/admin.js`)

#### [MODIFY] [admin.js](file:///c:/xampp/htdocs/favorite_cafe/js/admin.js)
- Update `loadAdminMenu()` to fetch from `api/menu.php` and `api/menu.json` so all database items (e.g. *Jollof Rice & Chicken*, *Special Favorite Omelette*, *Chicken & Rice*, etc.) display properly in the admin portal.
- Implement `renderAdminCategoryFilterPills()` to dynamically build category filter pills in the Menu & Stock tab.
- Implement pagination logic in `renderAdminMenu()`:
  - Page size: **10 items per page**.
  - Track `adminMenuCurrentPage`, `adminMenuCategoryFilter`, and `adminMenuSearchQuery`.
  - Slice items according to current page and selected category filter.

---

## Verification Plan

### Automated Verification
- Check JavaScript syntax using Node CLI: `node -c js/admin.js`.
- Test PHP menu endpoint execution: `c:\xampp\php\php.exe api/menu.php?action=get`.

### Manual Verification
- Open `http://localhost/favorite_cafe/admin.html` and click **Menu & Stock**.
- Verify *Jollof Rice & Chicken* and all 20 menu items are visible.
- Click category filter pills (*Coffee*, *Mains*, *Salads*) to test category filtering.
- Test pagination controls (Next/Prev buttons and page numbers) to verify 10 items are displayed per page.
- Push changes to [kayongest/favorite_cafe.git](https://github.com/kayongest/favorite_cafe.git).
