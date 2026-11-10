# Portfolio media slots

The homepage currently renders intentional CSS placeholders so no unrelated stock photography is shown.

## Replace these slots when ready

- **Hero portrait:** Replace the `.hero-portrait-slot` placeholder in `src/components/sections/HeroSection.tsx`. Recommended portrait crop: 4:5, minimum 1200 × 1500 px.
- **Featured project visuals:** Replace each `.project-image-slot` placeholder in `src/components/sections/ProjectsSection.tsx`. Recommended landscape crop: 16:9 or 16:5, minimum 1600 px wide.

## Suggested filenames

- `public/portfolio-media/bezaleel-portrait.webp`
- `public/portfolio-media/drishti-ai.webp`
- `public/portfolio-media/veltrix-sports.webp`
- `public/portfolio-media/mise-file-organizer.webp`

Use optimized WebP/AVIF images, meaningful alt text, and Next.js `Image` where possible. Do not commit private, confidential, or third-party copyrighted images without permission.
