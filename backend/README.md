# Learning Micro-Academy Backend API

FastAPI backend for Learning Micro-Academy platform with Supabase integration.

## Features

- User authentication (signup, login, JWT tokens)
- User profile management
- Course data management
- Goal tracking
- Supabase integration for database and auth
- n8n webhook support for automation

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET_KEY`: A secret key for JWT token signing

### 3. Set up Supabase Database

Run the SQL schema in `../supabase/schema.sql` in your Supabase SQL editor.

### 4. Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `PUT /api/v1/users/me/preferences` - Update user preferences
- `GET /api/v1/users/me/goals` - Get user goals
- `PUT /api/v1/users/me/goals` - Update user goals

### Courses
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/{course_id}` - Get specific course

### Goals
- `GET /api/v1/goals` - Get all user goals
- `POST /api/v1/goals` - Create new goal
- `PUT /api/v1/goals/{goal_id}` - Update goal
- `DELETE /api/v1/goals/{goal_id}` - Delete goal

## Deployment

### Railway

1. Connect your repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect and deploy the Python app

### Environment Variables for Railway

Add these in Railway dashboard:
- All variables from `.env.example`
- `PORT` is automatically set by Railway

## n8n Integration

Webhook workflows are available in `../n8n/workflows/`:
- User signup webhook
- Course completion notification

Configure n8n webhook URL in `.env` as `N8N_WEBHOOK_URL`.

