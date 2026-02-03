# Tabitha Musyoki — Portfolio

A simple, accessible portfolio site showcasing administrative, project, and operations management experience.

## Run locally

- Open `index.html` directly in your browser for a quick preview.
- Or run a simple local server:
  - Python: `python -m http.server 8000`
  - VS Code: Install **Live Server** extension and click `Go Live`

## Changes implemented

- Fixed asset paths to use relative references for local previews (CSS & JS)
- Added a keyboard skip-link and wrapped content in `<main>` for better accessibility
- Added meta description, Open Graph and Twitter card tags, favicon & manifest links
- Preconnected to Google Fonts and loaded `Inter`
- Added accessible focus styles and `prefers-reduced-motion` handling in CSS
- Added a small `assets/js/script.js` with smooth-scroll & skip-link focus helpers
- Populated this `README.md` with run instructions

## Next suggestions

- Add a favicon (`assets/images/favicon.ico`) and an OG image (`assets/images/og-image.png`)
- Consider adding a small CI check (linting) and simple GitHub Actions workflow
- Optimize and add responsive WebP images and a small site manifest

---

If you want, I can continue and implement the SEO tags with real images, add a `site.webmanifest`, or scaffold a basic GitHub Actions CI workflow.