## Sprint 1

# AI Prompt & Interaction Log

This file logs all AI interactions utilized during the development of Sprint 1: The Corporate Brand, in compliance with the Prodesk IT AI Policy.

---

## 🔍 Log 1: Base Project Architecture & Phase 1 Blueprint
* **Date:** May 26, 2026
* **Objective:** Establish a clean, semantic HTML5 structure and raw CSS layout blueprint matching the Phase 1 MVP criteria.

### Exact Prompt Used:
> "need phase 1 blue print for files fro development"

### AI Solution & Logic Applied:
The AI provided a clean two-file architectural blueprint (`index.html` and `style.css`). The markup utilizes semantic HTML5 structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) to maximize accessibility scores. The CSS handles layout foundations using Flexbox for component alignment (Navbar, Hero, Footer) and CSS Grid for matrix organization (3-card Services layout). It also included mobile viewport media query rules to handle clean stacking logic on smaller viewports.

---

## 🎨 Log 2: Color Palette Extraction from Brand Logo
* **Date:** May 26, 2026
* **Objective:** Extract and configure standard CSS custom properties directly matching the uploaded official Prodesk IT logo asset.

### Exact Prompt Used:
> "suggest me colour pallet according to this logo of prodesk it"

### AI Solution & Logic Applied:
The AI analyzed the company logo and extracted a precise color token grid using CSS custom variables inside a `:root` block. It mapped out the dominant amber gold (`#FCD061`), dark charcoal gray (`#2C2C2A`), and structural muted layout grays. This ensures the entire application maintains a deliberate, mathematically consistent brand look.

---

## 🖼️ Log 3: Hero Background Image Diffusion Logic
* **Date:** May 27, 2026
* **Objective:** Use a digital marketing asset as a hero background and seamlessly diffuse/blend its edges into the main layout without harsh bounding boxes.

### Exact Prompt Used:
> "i want to blend my image into the background. no sharp ending edges"

### AI Solution & Logic Applied:
The AI introduced a high-performance cross-browser masking technique utilizing the CSS `mask-image` linear-gradient mechanism. Unlike solid-color painting, alpha-mask transparency alters the container's raw opacity values, making it dissolve dynamically into whatever complex gradient is set on the global `<body>`.

---

## 🌐 Log 4: Cross-Browser Standardization for Layout Masking
* **Date:** May 27, 2026
* **Objective:** Add standard fallback syntax to the image-blending mask layer to ensure consistent behavior across various browser testing environments.

### Exact Prompt Used:
> "Also define the standard property 'mask-image' for compatibility"

### AI Solution & Logic Applied:
The AI updated the layout sheet to stack properties by placing vendor-prefixed properties (`-webkit-mask-image`) explicitly before standard W3C properties (`mask-image`). It also bound `mask-size: cover` and `mask-position: center` metrics together, guaranteeing that the visibility mask scales symmetrically with the underlying image background when an evaluator resizes their browser window during mobile responsiveness checks.

---

## 🆤 Log 5: Custom Typography & Hierarchical Font Scales
* **Date:** May 27, 2026
* **Objective:** Choose and implement professional typography scales for the navbar elements and hero text blocks.

### Exact Prompt Used:
> "okay tell me font for nav bar, hero section(h1, description, cta)"

### AI Solution & Logic Applied:
The AI configured the modern geometric sans-serif typeface `Plus Jakarta Sans` via Google Fonts. It implemented deep structural hierarchy rules across components using explicit tracking metrics (`letter-spacing`), compact line layouts (`line-height: 1.15` for headings), and varied font weight classes ranging from regular (`400`) to ultra-bold (`800`) to maximize scan-readability and visual impact.

---

## 📐 Log 6: Axis Re-alignment for Hero Content & CTA Buttons
* **Date:** May 27, 2026
* **Objective:** Adjust alignment variables to allow text elements and action items to stack cleanly along specified vertical lines.

### Exact Prompt Used:
> "how to get that cta button "get started left align""

### AI Solution & Logic Applied:
The AI reconfigured the alignment matrix inside the `.hero-content` flex block. By switching the system rules to use `text-align: left` alongside matching inline layout models (`display: inline-block`), it allowed the call-to-action button to snap seamlessly into alignment with the left margin boundary grid of the page headline.

---

## 📝 Log 7: Semantic Elements vs Generic Containers (Theory Validation)
* **Date:** May 27, 2026
* **Objective:** Audit the conceptual and architectural architectural differences between `<div>` and `<section>` components.

### Exact Prompt Used:
> "what is main difference between div and section tag"

### AI Solution & Logic Applied:
The AI mapped out the semantic division of DOM components. It highlighted that while `<div>` has zero semantic meaning and is strictly used as an engineering wrapper for CSS/JS alignment utilities, `<section>` explicitly organizes individual thematic nodes. Using these appropriately ensures automated testing suites like Google Lighthouse recognize the application layout correctly, clearing the baseline for a 100/100 Accessibility score.

## ⚙️ Log 8: Terminal Environment Debugging (Phase 3 Environment Setup)
* **Objective:** Resolve "npm error could not determine executable to run" blocker.
* **Solution Applied:** Executed `npm cache clean --force` and passed explicit package flags (`npx -p`) to bypass local Windows folder permission conflicts inside the AppData cache.

## 📱 Log 9: Mobile UX Optimization (Scroll Locking & Backdrop Dismissal)
* **Objective:** Implement mobile menu accessibility control.
* **Logic Applied:** Utilized document-level event bubbling targets to handle automated menu dismissal when tapping outside the layout container, paired with an `overflow: hidden` toggle on the global `<body>` node to freeze background scrolling while the mobile interface is active.

## ⚙️ Log 10: Tailwind Migration Strategy

* **Objective**: Understand how to approach the full migration from raw CSS to Tailwind.
* **Prompt Used**: "Tailwind CSS refactor — how to do it?"
* **Solution Applied**: Section-by-section migration strategy established. variables.css maps to `tailwind.config.js`, `layout.css` and `components.css` translate to utility classes in HTML, reset.css and responsive.css are deleted, darkMode: 'class' handles theme toggle.

## ⚙️ Log 11: Alternative Glass Effect Approach

* **Objective**:** Find another way to apply glass effect to nav-links without losing parent blur.
* **Prompt Used**: "Any other way by which I can apply the glass effect on nav-links?"
* **Solution Applied**: Pseudo-element trick — `.nav-links::before` with `position: absolute`, `inset: 0`, `backdrop-filter: blur` and `z-index: -1`. Parent stacking context does not affect pseudo-elements painted as a separate layer.

## Sprint 2

# AI Development Prompt Log
**Project:** Cash-Flow & Expense Tracker Application

This document logs the AI prompts utilized during the development, debugging, and feature enhancement of the application, fulfilling the project requirements.

## Phase 1: Dynamic Data & API Integration
**Prompt:** "i want that dinamic means if there are n number of currency is calling via api the drop down menu adopt automatically and show us the whole option not a hard coded just 4 or 5 currencies"
* **Purpose:** Refactored the currency dropdown to dynamically map all available global currencies from the Frankfurter API instead of relying on hardcoded HTML elements.

## Phase 2: Core Debugging & Syntax Fixes
**Prompt:** "Error calling API: TypeError: Cannot set properties of null (setting 'innerHTML') at fetchFrankfurterData"
* **Purpose:** Diagnosed and fixed a missing HTML container ID (`currency_options_container`) that the JavaScript was attempting to inject buttons into.

**Prompt:** "Uncaught TypeError: Cannot set properties of null (setting 'innerHTML') at window.changeCurrency"
* **Purpose:** Resolved a DOM targeting error by verifying and correcting the IDs (`current_currency_label`, `table_body`) across the HTML and JS files.

**Prompt:** `const expense_amount = (document.getElementById("expense_amount")* currentrate).value.trim();` "is this the right format?"
* **Purpose:** Corrected input value extraction sequence. Ensured the value was extracted and converted to a `Number` before applying the exchange rate multiplier.

**Prompt:** "Cannot access 'INR' before initialization at HTMLButtonElement."
* **Purpose:** Fixed an object property lookup error by wrapping the key in string literals (`rates['INR']`) so the JS engine wouldn't treat it as an uninitialized variable.

## Phase 3: jsPDF Document Generation
**Prompt:** "need to add total expense and remaining balance in the pdf"
* **Purpose:** Injected dynamic total calculations and localized currency formatting into the jsPDF output using the `doc.text()` API.

**Prompt:** "[Uploaded Image of garbled PDF text] this type of text is showing while getting pdf in INR how to fix this"
* **Purpose:** Resolved a character encoding conflict in jsPDF. Switched `Intl.NumberFormat` from `currencyDisplay: 'symbol'` to `currencyDisplay: 'code'` to prevent hidden HTML directional characters from corrupting the PDF font rendering.

## Phase 4: UI/UX & Responsive Layouts

**Prompt:** "flex and hidden are giving css conflict in the alert banner"
* **Purpose:** Resolved a Tailwind CSS display property clash by separating the `hidden` toggle and the `md:flex` properties using a dedicated outer wrapper `div`.

## Phase 5: State Management & Data Persistence
**Prompt:** "while deleting all the list the banner is not removed also after reset the banner not remove"
* **Purpose:** Added an explicit array-length check (`expense_list.length === 0`) to instantly clear UI alerts when the dashboard is emptied.

**Prompt:** "if am deleting any item from the table the balance must be updated and the recalculation must be done then after decide to show banner or not."
* **Purpose:** Eliminated floating-point decimal errors during row deletion by replacing standard subtraction with a full `.reduce()` recalculation of the array data.

**Prompt:** "how to add refresh in delete row so as if i delete a row from the table the page must refresh"
* **Purpose:** Added `window.location.reload();` to the deletion loop to ensure a completely clean UI repaint from local storage.

