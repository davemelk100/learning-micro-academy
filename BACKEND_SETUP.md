# Backend Setup Guide

This guide will help you set up the complete backend infrastructure for Learning Micro-Academy.

## Architecture Overview

- **Backend**: FastAPI (Python) - REST API
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Automation**: n8n (workflow automation)
- **Deployment**: Railway (hosting and secrets management)

## Step 1: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your:
   - Project URL
   - Anon key
   - Service role key
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Enable Row Level Security (RLS) is already configured in the schema

## Step 2: Set Up Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```bash
   cp env.example .env
   ```

5. Fill in `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET_KEY=generate-a-random-secret-key-here
   ```

6. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

7. Test the API at `http://localhost:8000/docs`

## Step 3: Set Up Railway

1. Create account at [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add a new service and select "Deploy from GitHub repo"
5. Select the `backend` directory as the root
6. Add environment variables in Railway dashboard:
   - All variables from `backend/env.example`
   - Railway automatically sets `PORT`
7. Deploy!

## Step 4: Set Up n8n

1. Create account at [n8n.io](https://n8n.io) or self-host
2. Import workflows from `n8n/workflows/`:
   - `user-signup-webhook.json`
   - `course-completion-notification.json`
3. Configure webhook URLs
4. Set up Supabase credentials in n8n
5. Configure SMTP for email notifications (if using)
6. Update `N8N_WEBHOOK_URL` in backend `.env` if needed

## Step 5: Update Frontend

1. Create `.env` file in root:
   ```bash
   cp .env.example .env
   ```

2. Update with your backend URL:
   ```env
   VITE_API_BASE_URL=https://your-railway-app.railway.app/api/v1
   ```

3. The frontend will automatically use the API service from `src/services/apiService.ts`

## Testing the Setup

1. **Test Backend**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test Signup**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

3. **Test Login**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables Reference

### Backend (.env)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `JWT_SECRET_KEY`: Secret for JWT token signing
- `JWT_ALGORITHM`: JWT algorithm (default: HS256)
- `JWT_EXPIRATION_HOURS`: Token expiration (default: 24)
- `CORS_ORIGINS`: Comma-separated allowed origins
- `PORT`: Server port (default: 8000)
- `N8N_WEBHOOK_URL`: Optional n8n webhook URL

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_SUPABASE_URL`: Supabase URL (optional, for direct access)
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key (optional)

## Troubleshooting

### Backend won't start
- Check that all environment variables are set
- Verify Supabase credentials are correct
- Ensure port 8000 is not in use

### Authentication fails
- Verify JWT_SECRET_KEY is set
- Check Supabase auth is enabled
- Verify user exists in Supabase auth.users

### Database errors
- Ensure schema.sql has been run
- Check RLS policies are correct
- Verify service role key has proper permissions

### CORS errors
- Add your frontend URL to CORS_ORIGINS
- Check that credentials are allowed

## Next Steps

1. Integrate authentication in frontend
2. Replace localStorage with API calls
3. Set up automated testing
4. Configure CI/CD pipeline
5. Set up monitoring and logging

