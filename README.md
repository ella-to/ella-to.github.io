# ella.to

Astro static site for [ella.to](https://ella.to) — a markdown resume plus Go vanity import paths.

## Structure

```
data/resume.json     resume content
data/vanity.json     Go modules served under ella.to/<pkg>
data/Sample.md       reference for the markdown shape src/resume.ts produces

src/resume.ts        resume.json -> markdown
src/pages/index.astro    renders that markdown at /
src/pages/resume.md.ts   serves it raw at /resume.md
src/pages/[pkg].astro    one go-import page per vanity.json entry
src/styles/markdown.css  the whole design (light/dark + print)
src/integrations/resume-pdf.ts  prints / to /resume.pdf after the build

public/CNAME         ella.to
```

The PDF is not a second design — it is the page's own `@media print` rules
rendered by headless Chrome, so `markdown.css` stays the only source of truth.
Adjust the print block there and the PDF follows.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # -> dist/
bun run preview
```

## Editing

- **Resume** — edit `data/resume.json`. Nothing else needs to change; the markdown,
  the page, and the PDF all regenerate from it.
- **New Go module** — add `{ "name": "<pkg>" }` to `data/vanity.json`. A
  `/<pkg>/index.html` with the right `go-import` meta is generated at build time.
  Add `"repo"` to point somewhere other than `github.com/ella-to/<pkg>`.

## Deploy

`.github/workflows/deploy.yml` builds on push to `main` and publishes `dist/` to
GitHub Pages.
