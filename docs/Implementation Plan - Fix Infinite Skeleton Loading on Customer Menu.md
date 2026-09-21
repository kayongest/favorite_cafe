# Implementation Plan - Fix Infinite Skeleton Loading on Customer Menu

Fix the infinite skeleton loading issue on the customer menu by restoring menu database items, adding backend auto-seeding when the menu table is empty, preventing empty database responses from suppressing fallback data, and rendering a proper empty state instead of leaving skeleton cards stuck on screen.

> [!NOTE]
> **Skeleton Loading is Preserved for Slow Connections**: Skeleton card placeholders will **still appear** whenever the page initially loads or when the network is slow. Once data arrives (or if no items are available), the skeletons are properly replaced by live menu items or an empty state message so they never get stuck infinitely.

## User Review Required

> [!IMPORTANT]
> The database table `menu_items` was re-seeded with 68 standard menu items from `api/menu.json`. Code updates in `api/menu.php` and `js/main.js` will ensure that even if the database table is reset or empty in the future, the system auto-seeds menu items, maintains skeleton loaders during network fetch, and gracefully replaces them once loading finishes.

## Proposed Changes

### Backend API

#### [MODIFY] [menu.php](file:///c:/xampp/htdocs/favorite_cafe/api/menu.php)
- In the `action=get` endpoint, check if the fetched items count from MySQL `menu_items` is 0.
- If 0 items are returned, trigger automatic seeding from `api/menu.json` into the MySQL table and re-query the items.

### Frontend Customer Menu Renderer

#### [MODIFY] [main.js](file:///c:/xampp/htdocs/favorite_cafe/js/main.js)
- In `loadDynamicCustomerMenu()`:
  - Keep skeleton placeholders visible while network fetch is in progress.
  - Only set `isDbSource = true` when `data.items` is non-empty (`data.items.length > 0`).
  - Fall back to `localItems` or `api/menu.json` if the database returns an empty array.
- In `renderCustomerMenuItems()`:
  - Remove the early `if (available.length === 0) return;` statement that was causing skeletons to freeze on screen.
  - If menu items exist, replace skeletons with dish cards.
  - When `available.length === 0`, replace skeletons with a user-friendly empty state message.

## Verification Plan

### Automated Tests / Script Verification
- Run `C:\xampp\php\php.exe c:\xampp\htdocs\favorite_cafe\api\menu.php` via command line to verify `items` array is returned with all 68 menu items.

### Manual Verification
- Open `http://localhost/favorite_cafe/index.html` in browser.
- Verify skeleton loading cards display initial shimmer on slow/fresh load and are replaced immediately by live menu items once loaded.
- Test category filter buttons (All, Mains, Burgers, Drinks, Smoothies, etc.) to ensure items render and can be clicked to view details and add to cart.
