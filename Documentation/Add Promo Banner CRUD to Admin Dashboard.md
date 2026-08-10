# Add Promo Banner CRUD to Admin Dashboard

This plan outlines the steps to add full Create, Read, Update, and Delete (CRUD) capabilities for the Promo Banners/Carousel in the Admin panel.

## Proposed Changes

### 1. Update `admin.html`
- **Sidebar Navigation**: Add a new sidebar menu item for "Promos & Banners" under the Management section.
- **Promo Management Section**: Add a new `<section id="tab-promos" class="tab-section" style="display:none;">` containing:
  - A header and an "Add New Promo" button.
  - A grid/table to display existing promo banners.
- **Promo Modal**: Add a new modal (`#promoModal`) containing a form to Add/Edit promos. The form will include:
  - Promo Title (e.g., "Order Salmon Steak Today")
  - Promo Subtitle (e.g., "And Save Up To")
  - Discount Text (e.g., "35%")
  - Image URL (e.g., "img/menu/6.jpg")

### 2. Update `js/admin.js`
- **State Management**: Introduce `adminPromos` array and load/save it to `localStorage` under the key `favcafe_promos`. 
- **Tab Switching Logic**: Update `initSidebarTabs()` to render promos when the `promos` tab is clicked.
- **CRUD Functions**:
  - `renderAdminPromosGrid()`: Dynamically generate HTML cards/rows for each promo.
  - `openAddPromoModal()` & `closePromoModal()`: Modal toggling.
  - `editPromo(id)`: Populate the modal with existing promo data for editing.
  - `deletePromo(id)`: Remove a promo from the array and re-render.
  - `savePromoItem(event)`: Handle form submission to either add a new promo or update an existing one.

### 3. Update `js/mobile_app.js`
- Update the `initCarousel()` function in the mobile app. Instead of using a hard-coded `slides` array, it will now fetch `localStorage.getItem('favcafe_promos')`.
- If no promos exist in local storage, it will default to the original 3 slides to ensure the carousel always looks good out of the box.

## Verification Plan

### Manual Verification
1. Open the Admin dashboard and click on the "Promos & Banners" tab.
2. Add a new promo with a custom title, discount, and image. Verify it appears in the admin list.
3. Open the Mobile App (`mobile_app.html`). Verify the new promo appears in the carousel on the Home tab.
4. Go back to the Admin dashboard, edit the promo's discount value, and save.
5. Refresh the Mobile App to verify the edit is instantly reflected.
6. Delete a promo in the Admin dashboard and verify it disappears from the mobile carousel.
