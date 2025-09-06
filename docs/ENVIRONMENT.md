# Environment Configuration

This document explains how to configure the environment variables for the NextJS Argon Dashboard Editable Website.

## Required Environment Variables

### Supabase Configuration

1. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
   - Get this from your Supabase dashboard → Settings → API
   - Example: `https://your-project-id.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key
   - Get this from your Supabase dashboard → Settings → API
   - This key is safe to expose in the browser

3. **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key
   - Get this from your Supabase dashboard → Settings → API
   - ⚠️ **KEEP THIS SECRET** - Never expose this in client-side code
   - Used only for server-side operations

<<<<<<< Current (Your changes)
Note: This project currently includes a filesystem-based fallback for storing pages and uploads (in `data/` and `public/uploads`) when Supabase keys are not configured. To use a real Supabase backend, install and configure `@supabase/supabase-js` and replace the storage helper with actual Supabase calls as described in README.
======= 4. **SUPABASE_BUCKET**: Storage bucket name (default: `public`)

- Create a public bucket in Supabase Storage if it doesn't exist

### Next.js Configuration

5. **NEXTAUTH_URL**: Your application URL
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`

6. **NEXTAUTH_SECRET**: A random secret key for NextAuth
   - Generate with: `openssl rand -base64 32`
   - Or use any random string generator

### Application Configuration

7. **NEXT_PUBLIC_APP_URL**: Your application base URL
   - Same as NEXTAUTH_URL in most cases

8. **NEXT_PUBLIC_DEFAULT_LOCALE**: Default language (default: `ar`)
   - Options: `ar` (Arabic), `en` (English)

9. **NEXT_PUBLIC_FALLBACK_LOCALE**: Fallback language (default: `en`)

## Setup Instructions

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the Supabase values:
   - Create a new Supabase project at https://supabase.com
   - Go to Settings → API to get your URL and keys
   - Create a public storage bucket named `public`

3. Generate a NextAuth secret:

   ```bash
   openssl rand -base64 32
   ```

4. Run the database initialization:

   ```bash
   # Run the SQL schema
   psql -h your-db-host -U postgres -d postgres -f supabase/init.sql

   # Or use Supabase CLI
   supabase db reset
   ```

5. Seed the database with components and admin user:

   ```bash
   node scripts/seed-supabase.js
   ```

6. Check `docs/ADMIN_CREDENTIALS.md` for the generated admin credentials

## Production Deployment

For production deployment:

1. Set all environment variables in your hosting platform
2. Ensure Supabase RLS policies are properly configured
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain
4. Rotate the admin password after first login
5. Consider using environment-specific Supabase projects

## Security Notes

- Never commit `.env.local` to version control
- Use different Supabase projects for development and production
- Regularly rotate service role keys
- Monitor Supabase usage and set up billing alerts
  > > > > > > > Incoming (Background Agent changes)
