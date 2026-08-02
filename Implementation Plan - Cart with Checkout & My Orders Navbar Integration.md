# Implementation Plan - Cart with Checkout & My Orders Navbar Integration

Add a fully-functional Cart system with Checkout flow and a "My Orders" management modal directly in the navbar of Mashariki Restaurant.

## Proposed Features & User Experience

### 1. Navbar Cart Icon & Counter Badge
- **Cart Button**: Positioned in the top navigation bar alongside the Search and Login buttons.
- **Badge Counter**: Live counter indicating total items in the cart (animates on item addition).
- **Cart Drawer/Modal**: Opens when clicking the cart icon, displaying:
  - List of selected food/drink items (image, title, item price, quantity increment/decrement, and remove button).
  - Price summary breakdown: Subtotal, Delivery Fee (or Free Delivery promo), and Total Price.
  - "Proceed to Checkout" action button.

### 2. Checkout Modal & Flow
- **Order Details Form**:
  - Service Type: Delivery, Pickup/Takeaway, or In-Restaurant Dine-In (Table No.).
  - Customer contact & delivery address (pre-filled if logged in).
  - Payment options: Cash on Delivery, Mobile Money (MTN MoMo / Airtel Money), or Credit Card.
- **Order Placement**:
  - Validates form, creates a timestamped order with unique ID (e.g. `#MSH-8492`), clears the cart, and saves the order to `localStorage`.
  - Displays a Confirmation overlay with estimated time and instant tracking option.

### 3. "My Orders" Navbar View & Timeline Modal
- **Navbar Integration**: Clean link/icon in the navbar menu (`Orders` with badge/icon).
- **Orders Dashboard Modal**:
  - Displays customer's active and past order history.
  - Features real-time status badges: `Placed`, `Preparing in Kitchen`, `Out for Delivery`, `Delivered / Completed`.
  - Allows clicking on any order to open an interactive Order Tracking Timeline.
  - Includes sample initial order history for demo purposes if no past orders exist.

### 4. Menu & Item Modal Integration
- Seamlessly connect all "Add to Cart" buttons on menu cards and item detail popups to the central JS Cart state and `localStorage`.

---

## Proposed Changes

### [HTML Markup]

#### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Add `#navCartBtn` with `#cartCount` badge into navbar actions.
- Clean up navigation items and add `#myOrdersBtn` seamlessly into navbar links.
- Create `#cartDrawerModal` markup for shopping cart item list & summary.
- Create `#checkoutModal` markup for order placement and details.
- Create `#orderSuccessModal` markup for order confirmation.
- Refine `#ordersModal` markup to render order list cards and active timeline tracking modal.

---

### [Styles]

#### [MODIFY] [css/style.css](file:///c:/xampp/htdocs/restaurante/css/style.css)
- Add CSS styling for:
  - Cart Navbar button & red/orange counter badge.
  - Cart Slide-over / Modal drawer layout.
  - Checkout form inputs, payment option radio pills, order summary card.
  - "My Orders" modal cards, status color pills, and visual step-by-step progress timeline lines.

---

### [JavaScript Logic]

#### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Implement central `Cart` state stored in `localStorage` (`cartItems`, `addToCart`, `updateQuantity`, `removeFromCart`, `renderCart`, `calculateTotal`).
- Implement `Checkout` logic (`openCheckout`, `processOrder`, `renderOrderSuccess`).
- Implement `Orders` state (`getOrders`, `saveOrder`, `showMyOrders`, `closeOrdersModal`, `showOrderTimeline`).
- Connect all existing menu card "Add" buttons to the global cart.

---

## Verification Plan

### Automated Tests / Code Checks
- Inspect JS syntax and ensure no console errors.

### Manual Verification
1. **Cart Test**: Click "Add to Cart" on menu items. Verify badge count increases, and opening cart shows item with correct quantity and price.
2. **Quantity Test**: Change quantity inside cart drawer and test item removal.
3. **Checkout Test**: Click "Proceed to Checkout", fill order details, choose payment method, and complete order. Verify confirmation message and cart reset.
4. **My Orders Test**: Click "Orders" in navbar. Verify newly placed order appears under "My Orders" list with status and tracking timeline details.
