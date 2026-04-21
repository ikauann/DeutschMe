# Design System Specification: The Precision Architect

## 1. Overview & Creative North Star
This design system is built upon the **"Precision Architect"** North Star. Learning German requires structure, clarity, and a focus on detail. Rather than a generic "educational app" feel, this system adopts a high-end editorial aesthetic. We move away from the rigid, boxed-in nature of standard Material Design 3 and toward a more fluid, layered experience.

The core philosophy is **Intentional Asymmetry and Tonal Depth**. By breaking the expected grid and using overlapping elements, we create a sense of movement. We prioritize "white space as a component" to reduce cognitive load—a necessity for language learners—while using professional blues to signify trust and authority.

---

## 2. Colors: Tonal Architecture
The palette is rooted in professional stability. We use a sophisticated range of blues and greys to create a hierarchy that feels calm yet purposeful.

### The Palette
*   **Primary Focus:** `primary (#005dac)` and `primary_container (#1976d2)`. These are our "Action" colors.
*   **The Neutrals:** `surface (#f7f9fc)` for the base and `surface_container_lowest (#ffffff)` for high-impact content.

### The "No-Line" Rule
To achieve a premium, high-end feel, **this design system prohibits the use of 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. For example:
*   A lesson card (`surface_container_lowest`) sits on a background (`surface`).
*   A header section uses `surface_container_low` to distinguish itself from the main content.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use **Surface Nesting** to define importance:
1.  **Base Layer:** `surface`
2.  **Section Layer:** `surface_container_low`
3.  **Active Component Layer:** `surface_container_lowest` (Highest contrast/white).

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" appearance:
*   **Glassmorphism:** For floating elements like fixed navigation footers, use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
*   **Signature Textures:** Apply a subtle linear gradient to main CTAs (e.g., transitioning from `primary` to `primary_container` at a 135-degree angle). This provides a "visual soul" that flat hex codes cannot.

---

## 3. Typography: The Editorial Scale
We utilize **Inter** for its neutral, highly readable qualities, which is essential for distinguishing complex German characters and compounds.

*   **Display (Large/Medium):** Used for "Achievement" states or hero headers. Set with tight letter spacing (-0.02em) to feel authoritative.
*   **Headline (Small):** The workhorse for lesson titles.
*   **Title (Medium/Small):** Used for navigation and section headers.
*   **Body (Large/Medium):** Reserved for language content (sentences, translations). Ensure a line height of `1.5` for maximum legibility during long study sessions.
*   **Label (Medium):** Used for metadata and button text.

**Editorial Logic:** Always pair a `headline-sm` with a `body-md` in `on_surface_variant` to create a clear "Title/Description" relationship without needing a divider line.

---

## 4. Elevation & Depth: Tonal Layering
Depth is achieved through **Tonal Layering** rather than structural lines.

### The Layering Principle
Instead of a shadow, place a `surface_container_lowest` card on a `surface_container_low` background. The subtle shift in hex values creates a soft, natural lift.

### Ambient Shadows
When an element must float (e.g., a "New Message" bubble):
*   **Blur:** `24px` to `32px`.
*   **Opacity:** `4% - 8%`.
*   **Color:** Use a tinted version of `on_surface` (e.g., a very dark navy) rather than pure black.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., an input field), use the **Ghost Border**: `outline_variant` at 20% opacity. Never use 100% opaque borders.

---

## 5. Components

### Elevated Chat Bubbles
Crucial for dialogue exercises. 
*   **User Bubble:** `primary_container`, `on_primary_container` text. Roundedness: `xl` (1.5rem).
*   **System/AI Bubble:** `surface_container_high`, `on_surface`. Roundedness: `xl` (1.5rem).
*   **Detail:** Apply an ambient shadow to the User Bubble to make it feel "active."

### Rounded Chips
Used for vocabulary selection or category filters.
*   **Shape:** `full` (9999px) for a soft, tactile feel.
*   **Interaction:** Unselected chips use `surface_container_high`. Selected chips transition to `primary` with `on_primary` text.

### Fixed Footers
The "Cockpit" of the app.
*   **Style:** `surface_container_lowest` with an 80% glassmorphism blur.
*   **Hierarchy:** Use icons from a consistent, thin-stroke library. The "Active" state should use a `primary` tint and a subtle `0.25rem` dot indicator below the icon.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface_container_low` background with a `md` (0.75rem) corner radius.
*   **State:** On focus, the background shifts to `surface_container_lowest` with a "Ghost Border" in `primary`.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Separation:** Use vertical white space (32px or 48px) and background shifts to separate content blocks. 

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use asymmetry. Place a "Streak" counter slightly offset from the header text to create visual interest.
*   **DO** prioritize "Breathing Room." If a screen feels cluttered, increase the background padding to `24px` instead of the standard `16px`.
*   **DO** use the `tertiary` (warm amber/orange) sparingly for "Grammar Alerts" or "Important Rules."

### Don’t:
*   **DON'T** use 1px solid dividers. They interrupt the flow of learning.
*   **DON'T** use pure black (#000000) for text. Use `on_surface` to maintain the premium, soft-contrast feel.
*   **DON'T** use sharp corners. Every interaction point should feel approachable—stick to the `md` to `xl` roundedness scale.

---

## 7. Signature Interaction: The "Haptic" Feedback
To elevate the experience, all primary buttons should have a subtle "Tonal Pulse" on press—where the background color shifts from `primary` to `primary_fixed` momentarily, simulating a physical button press through color rather than shadow.