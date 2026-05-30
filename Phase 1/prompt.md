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