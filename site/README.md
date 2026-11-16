# Portfolio site source

Source for https://bzaat.github.io/bzaat/. React, Vite, Tailwind CSS v4, Lucide icons and Mermaid (loaded only when a project is opened).

```bash
cd site
npm install
npm run dev       # local development
npm run build     # type-check + production build into ../docs
```

GitHub Pages serves `main:/docs`, so publishing is: run `npm run build`, then commit `docs/`.

## Editing content

All text, numbers, tables, BibTeX entries and diagrams live in `src/data.ts`. Images, the CV and the certificate live in `public/` and are copied to `docs/` at the same paths on build, so existing links (for example `docs/Pham_Nguyen_Khanh_Nguyen_CV.pdf`) keep working.

Deep links: `#project-resnet50`, `#project-badminton`, `#project-uav-sar` and `#project-housing` open that project's details.
