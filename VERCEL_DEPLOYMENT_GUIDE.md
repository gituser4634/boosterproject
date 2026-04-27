# Vercel Deployment Guide

## Pre-Deployment Checklist ✓

- ✅ Build configuration: `next.config.ts` created
- ✅ Prisma generation: Added to build script
- ✅ Authentication: Dynamic URL configuration for production
- ✅ Environment variables: Documented in `.env.example`
- ✅ Test files: Added to `.gitignore`
- ✅ Vercel config: `vercel.json` configured
- ✅ Security headers: Added to Next.js config
- ✅ No critical build errors detected

## Step 1: Prepare Repository

1. Commit all changes:
   ```bash
   git add .
   git commit -m "chore: prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Set Up Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in
3. Click "New Project"
4. Import your GitHub repository

## Step 3: Configure Environment Variables on Vercel

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

### Database (Supabase PostgreSQL)
```
DATABASE_URL = postgresql://postgres.izgenempmwmtnobdaheu:Boosterproj321%2A@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL = postgresql://postgres.izgenempmwmtnobdaheu:Boosterproj321%2A@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

### NextAuth (GENERATE NEW SECRETS FOR PRODUCTION!)
```
NEXTAUTH_SECRET = [generate a new strong secret - use `openssl rand -hex 32`]
AUTH_SECRET = [same as NEXTAUTH_SECRET]
```

### Supabase Main Project
```
NEXT_PUBLIC_SUPABASE_URL = https://izgenempmwmtnobdaheu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2VuZW1wbXdtdG5vYmRhaGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTQzMDQsImV4cCI6MjA5MjU5MDMwNH0.0NG-iuJ3yQcLA1oqJevdFN-OhSl_XkBuO7h4HWaoJT4
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2VuZW1wbXdtdG5vYmRhaGV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxNDMwNCwiZXhwIjoyMDkyNTkwMzA0fQ.dIc0FVV9twG9FtouODPKYDnswRTmICjI4ilm42OkZ9c
```

### Ably Real-time Messaging
```
ABLY_API_KEY = BIV7mg.XXeXPA:zsEeIQaWlAwkzY6kkzrEO6mX4xyS9Z4LjulEuw_1sZE
```

### Supabase Storage Project
```
NEXT_PUBLIC_STORAGE_SUPABASE_URL = https://kutxlmxdvinntskcxksx.supabase.co
NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dHhsbXhkdmlubnRza2N4a3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzUxOTYsImV4cCI6MjA5MjgxMTE5Nn0.ulC6Ru5lAHRAGk9uUcgNH4MoE3ZUYF1FydkqgeneYvg
```

**IMPORTANT:** Mark sensitive variables (NEXTAUTH_SECRET, AUTH_SECRET, SUPABASE_SERVICE_ROLE_KEY, ABLY_API_KEY) as "Sensitive" in Vercel dashboard.

## Step 4: Deploy

1. In Vercel dashboard, click "Deploy"
2. Vercel will automatically:
   - Build the project with `npm run build`
   - This runs: `prisma generate && next build`
   - Generate Prisma client
   - Build Next.js app
   - Deploy to edge network

## Step 5: Verify Deployment

1. Wait for build to complete
2. Check **Deployments** tab for status
3. Click the URL to visit your live site
4. Test key features:
   - Authentication (login/signup)
   - Database queries
   - File uploads to Supabase Storage
   - Real-time chat (Ably)

## Step 6: Configure Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records according to Vercel instructions
4. Update NEXTAUTH callback URLs if using custom domain

## Important Security Notes ⚠️

1. **Never commit `.env.local`** - it's in `.gitignore`, keep it that way
2. **Generate new secrets for production** - the current ones are placeholders
3. **Service Role Key should never be exposed to client** - only use `NEXT_PUBLIC_*` on client
4. **Monitor your database connection limits** - Supabase connection pooling has limits
5. **Set up error monitoring** - Consider adding Sentry or similar

## Troubleshooting

### Build Fails with Prisma Error
- Ensure `DIRECT_URL` is set correctly in Environment Variables
- The build process needs direct database access to run migrations

### Authentication Redirects Not Working
- Check that `AUTH_SECRET` and `NEXTAUTH_SECRET` are set
- Verify the auth callback URL in your OAuth providers matches Vercel URL
- The app automatically handles NEXTAUTH_URL based on domain

### Database Connection Timeouts
- Check `DATABASE_URL` is using connection pooling (port 6543)
- Verify Supabase project is active
- Check network rules in Supabase dashboard

### Real-time Features Not Working
- Verify `ABLY_API_KEY` is correct
- Check browser console for Ably connection errors
- Confirm Ably project is active in Ably dashboard

## Post-Deployment

1. Set up CI/CD for automatic deployments on push to main
2. Configure preview deployments for pull requests
3. Set up error monitoring and logging
4. Monitor database query performance
5. Review Vercel analytics dashboard

## Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
- [Prisma Deployment Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [Supabase Production Checklist](https://supabase.com/docs/guides/self-hosting)
