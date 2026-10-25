# 🚀 Giulio Purgatorio — Personal Root Landing Hub (`gpurg.com`)

An ultra-modern, zero-build, zero-dependency personal landing page and entryway for **Giulio Purgatorio** (AWS Tech Lead & Cloud Solution Architect).

Built with **Vanilla ES6 + CSS Custom Properties (Glassmorphism 2.0) + Semantic HTML5**, statically hosted via **GitHub Pages** (`/docs`) with strict browser-enforced security and GDPR/ePrivacy compliance.

---

## 📐 Project Overview & Ecosystem Architecture

This project serves as the central hub for the root domain `gpurg.com`, linking Giulio's personal branding, gamified CV, PDF resume, and public social/code profiles:

- **Root Landing Hub**: `https://gpurg.com`
- **Gamified Interactive CV**: `https://cv.gpurg.com` (Retro pixel-art RPG experience)
- **Classic PDF CV**: `https://gpurg.com/cv.pdf` (also accessible via `/cv`)

---

## 🎨 Design System & UI/UX Directives

- **Aesthetic**: Cyber-Minimalist Glassmorphism 2.0 & Bento Grid in native dark mode (`#07090e`).
- **Typography**: Native modern system font stacks (`system-ui`, `-apple-system`, `ui-monospace`) for instant rendering with zero font file downloads or third-party requests.
- **Accent Palette**:
  - 🩵 **Cyan** (`#00f2fe`): Primary Hero spotlight.
  - 💚 **Emerald** (`#10b981`): Interactive CV / Recommended options.
  - 💜 **Violet** (`#a855f7`): Social & Network / GitHub & LinkedIn.
  - 🧡 **Amber** (`#f59e0b`): Tech Stack & AWS certifications.
- **Dynamic Backgrounds**:
  - **Ambient Drifting Orbs**: 3 pulsing, orbiting gradient light layers (`@keyframes floatOrb1, floatOrb2, floatOrb3`).
  - **rAF Cursor Spotlight**: Mouse-following radial spotlight throttled via `requestAnimationFrame` for smooth 60/120 FPS performance.

---

## 📁 File Structure (GitHub Pages `/docs`)

```text
gpurg-root/
├── README.md             # Repository documentation (not exposed on web root)
└── docs/                 # GitHub Pages web root (https://gpurg.com)
    ├── .well-known/
    │   └── security.txt  # RFC 9116 Responsible Disclosure security contact
    ├── .nojekyll         # Disables Jekyll processing so .well-known/ is served natively
    ├── CNAME             # Custom domain binding (gpurg.com) for GitHub Pages
    ├── 404.html          # Standalone dark glassmorphic 404 error page
    ├── cv.html           # Instant clean-URL redirect (/cv -> /cv.pdf)
    ├── robots.txt        # RFC 9309 crawler directives (Disallow: /)
    ├── config.js         # Single Source of Truth (Frozen CONFIG object for cards & modals)
    ├── app.js            # Vanilla ES6 runtime, inline SVG dictionary, modal focus trap, rAF tracking
    ├── index.html        # WCAG 2.1 AA HTML5 structure, CSP, SEO (OpenGraph + Twitter Cards)
    ├── styles.css        # CSS Custom Properties, Bento Grid layout, Glassmorphism design system
    ├── me.jpg            # Official profile headshot
    ├── favicon.svg       # Cloud vector SVG favicon
    └── cv.pdf            # Downloadable standard CV resume
```

---

## 🛡️ Governance, Privacy & Legal Compliance (`gpurg.com` 5-Pillar Standard)

1. **Privacy & Edge Logs (GDPR Art. 13 & Art. 6(1)(f))**: Static client-side hub with zero application-level personal data collection. Transient edge logs (IP, User-Agent, timestamp) are processed by GitHub Pages / Fastly CDN strictly for network security and DDoS mitigation under legitimate interest. Contact: `info@gpurg.com`.
2. **Zero Cookies & Zero Client Storage (ePrivacy Art. 5(3))**: Zero cookies (`document.cookie`) and zero web storage (`localStorage`, `sessionStorage`, `IndexedDB`), exempting the site from cookie consent banners.
3. **Zero Third-Party Requests (Browser-Enforced CSP)**: Enforced via `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ...">` and `<meta name="referrer" content="no-referrer">`.
4. **Non-Affiliation, Nominative Fair Use & Credits**: Independent personal initiative not affiliated with or endorsed by any employer, client, academic institution, or vendor. Trademarks (AWS, Amazon Web Services, LinkedIn, GitHub) belong to their respective owners under Nominative Fair Use. Inline SVG icons are from **Lucide / Feather Icons** (`ISC` / `MIT` License).
5. **No Warranty & Limitation of Liability (`"AS IS"`)**: Provided strictly `"AS IS"` for informational and portfolio purposes without warranty or liability.
