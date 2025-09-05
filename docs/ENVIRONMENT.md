The .env.example file could not be created due to repository ACL restrictions. Below are the placeholder environment variables you should create in a `.env.local` file at the project root before deploying or running the app.

# Supabase (replace placeholders with your real values)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=public

# App settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Placeholder secret for local file-storage fallback (do not use in production)
LOCAL_STORAGE_SECRET=change-me

Note: This project currently includes a filesystem-based fallback for storing pages and uploads (in `data/` and `public/uploads`) when Supabase keys are not configured. To use a real Supabase backend, install and configure `@supabase/supabase-js` and replace the storage helper with actual Supabase calls as described in README.
