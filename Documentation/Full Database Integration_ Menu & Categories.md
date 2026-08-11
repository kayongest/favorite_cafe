# Full Database Integration: Menu & Categories

The database SQL dump you provided has been successfully loaded into MySQL, and I've audited the codebase to see how it connects. Great news: the core API endpoints (`api/menu.php` and `api/categories.php`) are already perfectly integrated with MySQL! 

However, there is a missing "back-to-back" link in the Admin Dashboard that prevents newly created categories from being used when creating a menu item.

## Proposed Changes

### 1. Dynamic Category Dropdown (Admin Dashboard)
Currently, when you go to **Add New Dish** in the Admin UI, the Category dropdown (`<select id="menuCategory">`) is hardcoded to just 7 options (Burgers, Pizza, etc.).
- **Fix:** I will update `admin.js` to dynamically inject the options into this dropdown directly from the MySQL `categories` table. When you create a new category (e.g. "Specials"), it will instantly appear in the Add Dish dropdown.

#### [MODIFY] `js/admin.js`
- Create a function `populateCategoryDropdown()` that runs after categories are fetched from the database.
- It will clear the hardcoded options and rebuild them from the DB records.

#### [MODIFY] `admin.html`
- Clean out the hardcoded options inside `<select id="menuCategory" class="form-select" required>` so it acts as an empty container ready for the dynamic injection.

### 2. Verify Frontend Sync
- Your customer frontend (`index.html` via `main.js`) is already calling `loadDynamicCategories()` and fetching menu items perfectly from the DB. I will just double-check that no hardcoded fallback HTML is interfering with the dynamic load.

## User Review Required
> [!IMPORTANT]
> The database dump contains 15 menu items and 15 categories. This implementation will ensure that if you add a 16th category in Admin, it immediately shows up on the Customer page's filter bar, AND in the Admin's "Add Dish" dropdown. 

Let me know if you approve of this plan to finish the complete back-to-back integration!
