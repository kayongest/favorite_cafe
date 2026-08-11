# Mobile Auth Flow Design

This plan outlines the creation of a dedicated mobile authentication experience based on the provided UI design. This mobile version will feature sleek, modern aesthetics with onboarding and a dedicated register/login flow, functioning similarly to the current desktop modal system but tailored for mobile users.

## Open Questions
> [!IMPORTANT]
> 1. Should we create a separate file (e.g., `mobile_auth.html`) that links back to `index.html` once logged in, or would you prefer this to be integrated into `index.html` as a mobile-only view? (I recommend a separate `mobile_auth.html` for a cleaner, dedicated mobile app feel).
> 2. The design shows a 4-digit verification code screen. Do you want this simulated with a simple prompt, or skip it for now and just wire up the Sign Up/Log In directly to the existing `processClientLogin()` logic?

## Proposed Changes

### Mobile Auth HTML File

#### [NEW] [mobile_auth.html](file:///c:/xampp/htdocs/favorite_cafe/mobile_auth.html)
We will create a new HTML file focusing entirely on the mobile experience depicted in the designs.
- **Splash Screen**: A sleek centered logo screen.
- **Onboarding Carousel**: Three slider screens ("All your favorites", "Order from chosen chef", "Free delivery offers").
- **Auth Screens**:
  - **Sign Up**: Form matching the design (Name, Email, Password, Re-type password).
  - **Log In**: Form matching the design (Email, Password, Remember Me).
  - **Verification**: 4-digit code input screen.
  - **Forgot Password**: Email input screen.
- **Interactivity**: Vanilla JS to handle smooth transitions (sliding in/out) between these screens to feel like a native mobile app. It will integrate with the existing login/register logic (`auth.php` or demo functions).

### CSS Styling

#### [NEW] [mobile_auth.css](file:///c:/xampp/htdocs/favorite_cafe/css/mobile_auth.css)
- Implement custom CSS specific to the mobile view.
- Utilize the color palette from the mockup: vibrant orange (`#f97316` or similar), deep dark blue (`#0f172a`), and sleek whites/grays.
- Flexbox/Grid layouts to ensure perfect centering and mobile responsiveness.

## Verification Plan

### Manual Verification
- Open `mobile_auth.html` in Chrome DevTools using mobile device simulation (e.g., iPhone 12/14 Pro).
- Verify the splash screen transitions smoothly to onboarding.
- Test the onboarding carousel functionality.
- Verify navigation between Sign Up, Log In, and Forgot Password.
- Test that submitting the Log In form correctly redirects the user to the main `index.html` page simulating a successful login.
