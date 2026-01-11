This folder contains modular CSS partials used by `public/app.css` (the entry file).

Files:
- `variables.css` — CSS custom properties and theme tokens
- `base.css` — resets, typography, and base helpers
- `layout.css` — layout grid and responsive rules
- `components.css` — visual components (cards, buttons, sections)
- `utilities.css` — helper utilities, accessibility focus, print styles

Guidelines:
- Add new component styles to `components.css` or create a new partial and import it from `app.css`.
- Use custom properties from `variables.css` for colors/spacings.
- Prefer semantic class names and use `data-` attributes for JS hooks (e.g., `data-preview`, `data-list-target`).