# Implementation Plan - Profile Contacts CRUD System

Implement full **CRUD (Create, Read, Update, Delete)** functionality for the Contacts profile section in `mobile_app.html`, connecting it to MySQL database authentication (`users` table) and local offline persistence (`localStorage`).

## User Review Required

> [!IMPORTANT]
> - **Database Column**: We will automatically update the MySQL `users` table schema in `api/db.php` to include an `address` column (and sync optional custom contacts).
> - **Authentication Context**: Profile updates require a logged-in session or valid token. Offline changes are stored in `localStorage` and synchronized when online.

---

## Proposed Changes

### Backend Component (`api/`)

#### [MODIFY] [db.php](file:///c:/xampp/htdocs/favorite_cafe/api/db.php)
- Auto-migrate `users` table to add `address` `TEXT DEFAULT NULL` if not present.

#### [MODIFY] [auth.php](file:///c:/xampp/htdocs/favorite_cafe/api/auth.php)
- Add `update_profile` action accepting `id`/token, `phone`, `email`, `address`, and `full_name`.
- Add `get_profile` action to retrieve latest contacts directly from MySQL.

---

### Frontend Component (`mobile_app.html` & `css/mobile_app.css`)

#### [MODIFY] [mobile_app.html](file:///c:/xampp/htdocs/favorite_cafe/mobile_app.html)
- Enhance the Contacts `<div class="profile-section-card">` to support dynamic rendering of contacts and interactive CRUD actions (Edit, Add, Delete).
- Add `#profileEditModal` overlay component styled in dark navy/cyan theme with form inputs:
  - Mobile Phone input
  - Email Address input
  - Delivery Address input
  - Save & Cancel buttons

#### [MODIFY] [mobile_app.css](file:///c:/xampp/htdocs/favorite_cafe/css/mobile_app.css)
- Add modal container and backdrop styling for `#profileEditModal`.

---

### Application Logic Component (`js/mobile_app.js`)

#### [MODIFY] [mobile_app.js](file:///c:/xampp/htdocs/favorite_cafe/js/mobile_app.js)
- Implement `openMobileAuthModal('profile_edit')` and `closeMobileAuthModal()`.
- Implement `renderUserContacts()` to update DOM elements `#profilePhoneVal`, `#profileEmailVal`, `#profileAddressVal`, and custom items.
- Implement `saveMobileProfileContacts()` to send AJAX request to `api/auth.php?action=update_profile`, update state & `localStorage`, and show confirmation toast.
- Implement clear/delete field functionality with confirmation.

---

## Verification Plan

### Automated / Manual Verification
1. **Read**: Load `mobile_app.html` in browser, navigate to Profile tab, verify phone, email, address are displayed from user session.
2. **Update**: Click "Edit" in Contacts card header, change Phone, Email, and Address in modal, click "Save Changes". Verify UI updates immediately and database record is updated.
3. **Offline Persistence**: Refresh browser page and check if updated contacts remain stored.
