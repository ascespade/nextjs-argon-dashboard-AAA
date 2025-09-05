# Summary

This branch adds an App Router + editor integration scaffold. It includes:

- App Router pages: /, /editor, /admin/\*
- Basic editor parent (app/editor/page.tsx) and iframe client (HomeEditorClient)
- API endpoints (pages/api/pages/[slug], save, publish) storing data in local `data/` folder as a fallback to Supabase
- Upload endpoint that stores base64 images to `public/uploads`
- Supabase migration SQL at `supabase/init.sql`
- ENV instructions in `docs/ENVIRONMENT.md` (ACL prevented committing `.env.example`)

## How to run

1. Create a `.env.local` using the placeholders in `docs/ENVIRONMENT.md`.
2. Start dev server: `pnpm dev` or `npm run dev`.
3. Visit `/` for homepage, `/editor` for the visual editor, `/admin/dashboard` for the admin dashboard.

## Supabase and Production

- This scaffold includes a local-file fallback so you can test the editor and save/publish without an actual Supabase project.
- To integrate Supabase:
  1. Install `@supabase/supabase-js`.
  2. Replace the storage helper with Supabase calls or implement a server module `lib/supabase.ts`.
  3. Run SQL in `supabase/init.sql` against your Supabase database.

## Limitations

- The editor uses native drag/drop (HTML5) to avoid adding new dev dependencies here; you can replace with `@dnd-kit` later.
- For production-ready Supabase integration and secure uploads, replace the filesystem fallback.

Next steps I can take (upon your go-ahead):

- Replace file-based storage with Supabase client calls and ensure secure uploads.
- Improve component library thumbnails and add drag-drop previews.
- Implement full undo/redo stack persisted server-side.
