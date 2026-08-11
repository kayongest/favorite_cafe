# Mobile View Redesign Plan

Based on the 4 new UI mockups provided, I will completely overhaul `mobile_app.html`, `mobile_app.css`, and `mobile_app.js` to match this beautiful new design system. 

## Proposed Changes

### 1. Global Styles (`mobile_app.css`)
- **Colors**: Update the primary accent color to the new Teal/Cyan color seen in the mockups. The background will be updated to the soft light gray/blue tint.
- **Typography**: Refine font weights and sizes to match the clean, modern look of the new mockups.
- **Card Styles**: Update item and category cards to have the specific rounded corners, soft shadows, and clean white backgrounds shown in the designs.

### 2. Layout Structure (`mobile_app.html`)
- **Top Header**: 
  - Left: User Avatar (clicking this will open the Profile Sidebar).
  - Center: Dynamic title depending on the active tab (e.g., "Favorite", "Notifications").
  - Right: Teal price badge (`$0`) and Cart icon.
- **Bottom Navigation**: 
  - Update to 5 tabs: **Home**, **Menu**, **Order**, **Favorite**, and **Notification**.
  - Active tab will be highlighted in the new Teal color.

### 3. Screen Views (Managed via JS Tab Switching)
- **Home View**: 
  - Promo Banner ("Order Salmon Steak Today", 35% off).
  - "We offer" Categories section (Salads, Meat, Pasta, Soups).
  - "Recommended for you" section.
- **Menu View**:
  - 2-column grid displaying the categories/items with large images.
- **Favorite View**:
  - Grid showing favorite items with a red heart icon and `+` button.
- **Notifications View**:
  - List of notification cards (Order Out for Delivery, Limited-Time Deal, etc.) with read/unread statuses.
- **Profile Sidebar (Modal)**:
  - Slides in from the side/bottom containing User Info, Personal Information, Orders, Promocodes, Toggles (Notifications, Face ID), and a red Sign Out button.

### 4. Logic (`mobile_app.js`)
- Implement a tab-switching mechanism to hide/show the different views (Home, Menu, Order, Favorite, Notification) without reloading the page.
- Wire up the new Profile menu toggles and links.

## User Review Required
> [!IMPORTANT]  
> This is a complete redesign of the mobile app layout to perfectly match the 4 new images. The bottom navigation will be updated to the 5 new tabs. If you approve this plan, please click **Proceed** and I will implement these changes immediately!
