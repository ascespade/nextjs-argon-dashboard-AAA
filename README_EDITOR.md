Editor & Homepage mapping

Overview

This project includes a Preline/Tailwind-based homepage (pages/index.js) and a Visual Editor (pages/editor.js) that loads the exact homepage in an iframe using "?edit=1". The editor sends and receives updates via postMessage using lib/editor-protocol.js and pages/index.js is the single source of truth (DB-backed via lib/db.js and API routes in pages/api/pages/*).

Where sections live

- pages/index.js
  - Renders the homepage composed of ordered components from the DB (draft or published depending on query param edit=1).
  - It listens to editor messages and applies updates directly to the live state, persisting when Save Draft is called.

- lib/db.js
  - Contains the default DB (data/db.json auto-created). The pages/home draft content is seeded in defaultDB.pages.home.draft.
  - Functions: getPage, saveDraft, publishPage, getComponentsLibrary, listVersions, rollbackToVersion.

- pages/editor.js
  - Visual Editor UI (Preline + Tailwind) with toolbar, device preview, zoom, components library and drag-and-drop.
  - The editor posts messages (Messages.ADD_COMPONENT, Messages.SAVE_DRAFT, Messages.PUBLISH, Messages.UPDATE_FIELD etc.) to the iframe that loads the homepage.

Editable components & mapping

The homepage is stored as an ordered list of components in DB.pages.home.draft.components. Each component has:
- id: string
- type: string (one of hero_banner, features, stats_counter, gallery, testimonials, cta_section, faq, text_block)
- props: object (component-specific props)
- style: object (applied inline for resizing/custom sizing)

Mapping examples (how they appear in pages/index.js):
- hero_banner
  - props: { title, subtitle, buttonText, buttonHref, image, badge }
  - Renders hero section with left text (editable) and right image (editable)

- features
  - props: { items: [{id, icon, title, text}] }
  - Renders Preline-style cards grid; each item editable

- stats_counter
  - props: { items: [{id, label, value}] }

- gallery
  - props: { images: [src] }

- testimonials
  - props: { items: [{id, name, role, avatar, quote}] }

- cta_section
  - props: { title, subtitle?, buttonText, buttonHref }

- faq
  - props: { items: [{id, q, a}] }

- text_block
  - props: { text }

Editing workflow

- The editor iframe loads the real homepage using /?edit=1; pages/index.js enters edit mode when the edit query param is set and enables contentEditable areas and drag handles.
- Inline edits call postToEditor(window.parent, Messages.UPDATE_FIELD, { id, field, value }) which the editor receives and uses when persisting.
- Save Draft: editor posts Messages.SAVE_DRAFT to iframe which triggers pages/index.js to POST /api/pages/home/save saving draft via lib/db.js.
- Publish: editor posts Messages.PUBLISH which triggers POST /api/pages/home/publish to persist published content.
- Drag & Drop: Dragging a component from the editor library posts Messages.ADD_COMPONENT to the iframe which appends the component to the page state.

Notes

- Styling: the editor UI and homepage use Preline + Tailwind utilities loaded via CDN (pages/_document.js), so the styling is consistent.
- Icons: Nucleo icons (Argon) remain available and are used for component thumbnails; you can switch to Lucide/Heroicons easily by changing classes and imports.
- RTL support: You can add ?lang=ar or a UI toggle to set document.dir="rtl" if you need Arabic-first layout; base code supports editable text but you should choose an Arabic web font (e.g., Cairo) for production.

Next steps (optional)

- Replace Tailwind CDN with an actual Tailwind build for production performance and purge.
- Implement a dedicated Inspector panel to edit properties (colors, spacing) for selected components.
- Add a grid/snap system for better resize UX.

If you want, I can now add an Inspector panel and RTL toggle UI, or run a Tailwind build setup to remove CDN usage and produce production CSS.
