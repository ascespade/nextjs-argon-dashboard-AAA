# Deployment Guide

This guide covers deploying the NextJS Argon Dashboard Editable Website to various platforms.

## Prerequisites

1. **Supabase Project**: Create a new project at https://supabase.com
2. **Environment Variables**: Set up all required environment variables
3. **Database Setup**: Run the initialization SQL and seed script

## Platform-Specific Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and connect your GitHub repository

2. **Configure Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     SUPABASE_BUCKET=public
     NEXTAUTH_URL=https://your-domain.vercel.app
     NEXTAUTH_SECRET=your_generated_secret
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```

3. **Deploy**:
   - Vercel will automatically build and deploy
   - The `vercel.json` configuration is already included

4. **Post-Deployment**:
   ```bash
   # Run the seed script to populate components and create admin
   node scripts/seed-supabase.js
   ```

### Netlify

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git" and connect your repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add all required variables

4. **Deploy**:
   - Netlify will build and deploy automatically

### Render

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configuration**:
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**:
   - Add all required environment variables

4. **Deploy**:
   - Render will build and deploy automatically

### Docker Deployment

1. **Build Image**:
   ```bash
   docker build -t nextjs-argon-dashboard .
   ```

2. **Run Container**:
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your_url \
     -e SUPABASE_SERVICE_ROLE_KEY=your_key \
     nextjs-argon-dashboard
   ```

3. **Docker Compose**:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
         - SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}
   ```

## Database Setup

### 1. Initialize Supabase Schema

Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/init.sql
```

### 2. Seed the Database

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=your_url
export SUPABASE_SERVICE_ROLE_KEY=your_key

# Run seed script
node scripts/seed-supabase.js
```

### 3. Verify Setup

- Check `docs/ADMIN_CREDENTIALS.md` for admin login details
- Visit `/admin/users` to verify admin access
- Test the editor at `/editor`

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema initialized
- [ ] Seed script executed
- [ ] Admin credentials retrieved
- [ ] Editor functionality tested
- [ ] Theme toggle working
- [ ] Language toggle working
- [ ] Component library populated
- [ ] Image uploads working
- [ ] Page save/publish working

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**:
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure service role key has proper permissions

3. **Editor Not Loading**:
   - Check iframe security policies
   - Verify postMessage communication
   - Check browser console for errors

4. **Image Upload Issues**:
   - Verify Supabase storage bucket exists
   - Check bucket permissions
   - Verify file size limits

### Performance Optimization

1. **Enable Supabase CDN** for image uploads
2. **Configure caching** for static assets
3. **Optimize images** before upload
4. **Enable compression** in production

## Security Considerations

1. **Rotate Admin Password**: Change default admin password immediately
2. **Environment Variables**: Never commit `.env.local` to version control
3. **RLS Policies**: Review and test Row Level Security policies
4. **API Keys**: Use different keys for development and production
5. **HTTPS**: Always use HTTPS in production

## Monitoring

1. **Supabase Dashboard**: Monitor database usage and performance
2. **Application Logs**: Check deployment platform logs
3. **Error Tracking**: Consider adding Sentry or similar service
4. **Analytics**: Add Google Analytics or similar for usage tracking