# Implementation Plan - Toast Notifications & User Database Authentication

Replace browser `alert()` popups with custom Toast Notifications, and implement real user verification (registered user database check) for Login & Registration.

## Proposed Changes

### 1. Modern Toast Notification System
- Build a lightweight, custom Toast Notification component (Success, Error, Warning, Info).
- Smooth slide-in/out animations from top-right with icon badges.
- Auto-dismiss after 3.5 seconds with close button.
- Replace all native `alert(...)` calls across the website (Login, Registration, Cart, Admin actions, Checkout, Booking) with `showToast(message, type)`.

### 2. User Authentication & Database Check
- **Registered User Store / Database**:
  - Implement user credential validation against stored registered accounts (`registered_users` array stored in local persistent DB storage + optional PHP `api/auth.php` backend for XAMPP MySQL environment).
- **Registration Flow**:
  - Validates full name, email, phone, and password.
  - Checks if email is already registered -> displays Error Toast ("Account with this email already exists!").
  - On success -> registers user in DB, updates navbar user account button, and shows Success Toast ("Welcome to Mashariki, [Name]! Account created successfully.").
- **Login Flow**:
  - Checks entered email and password against registered users in DB.
  - If email is NOT found -> displays Error Toast ("User not found. Please register an account first.").
  - If password does not match -> displays Error Toast ("Invalid password. Please try again.").
  - On success -> logs user in, pre-fills checkout contact info, updates navbar user account state, and shows Success Toast ("Welcome back, [Name]!").

---

## Proposed File Changes

### [CSS Styles]
#### [MODIFY] [css/style.css](file:///c:/xampp/htdocs/restaurante/css/style.css)
- Add CSS rules for `.toast-container`, `.toast-item`, `.toast-success`, `.toast-error`, `.toast-warning`, `.toast-info`, and entry/exit slide animations.

### [HTML Markup]
#### [MODIFY] [index.html](file:///c:/xampp/htdocs/restaurante/index.html)
- Add `#toastContainer` div container to body for floating toast notifications.

### [JavaScript Engine]
#### [MODIFY] [js/main.js](file:///c:/xampp/htdocs/restaurante/js/main.js)
- Implement `showToast(msg, type, title)` function.
- Update `handleClientRegister()` to save user credentials into registered user DB store.
- Update `handleClientLogin()` to query DB store; if user not found -> show Error Toast ("User not found").
- Pre-populate default demo accounts (`customer@mashariki.com`, `eric@mashariki.com`).
- Replace all `alert()` calls across cart, checkout, admin, reservations with `showToast()`.

---

## Verification Plan

### Manual Verification
1. **Toast Notification Test**: Trigger login, registration, cart item additions, and admin actions to verify toast popups appear gracefully in top-right corner and auto-dismiss.
2. **User Not Found Test**: Enter an unregistered email (e.g. `unknown@test.com`) into Login modal and click Sign In. Verify Error Toast appears: "User not found. Please register an account first."
3. **Registration & Login Test**: Register a new account (e.g. `raul@mashariki.com`), verify Success Toast, then log out and log in with those credentials to verify success.
