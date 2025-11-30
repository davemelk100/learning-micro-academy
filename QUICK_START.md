# Quick Start Guide

## Starting the Backend Server

The backend needs to be running for authentication and data saving to work.

### Option 1: Using the Start Script (Recommended)

```bash
# Make sure you're in the project root
npm run backend:dev
```

Or directly:
```bash
cd backend
bash start.sh
```

### Option 2: Manual Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Then edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET_KEY=your-random-secret-key-here
   ```

5. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Verify Backend is Running

Once started, you should see:
- Server running at `http://localhost:8000`
- API docs at `http://localhost:8000/docs`
- Health check at `http://localhost:8000/health`

### Frontend Configuration

The frontend is configured to connect to `http://localhost:8000/api/v1` by default.

If your backend is running on a different URL, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Troubleshooting

**Connection Refused Error:**
- Make sure the backend server is running
- Check that port 8000 is not in use by another application
- Verify the backend started successfully (check terminal output)

**Missing Supabase Credentials:**
- You need a Supabase account and project
- Get your credentials from: Supabase Dashboard > Settings > API
- Add them to `backend/.env`

**Python/uvicorn not found:**
- Make sure Python 3.8+ is installed
- Install uvicorn: `pip install uvicorn`

### Development Workflow

1. **Terminal 1 - Backend:**
   ```bash
   npm run backend:dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

Both should be running simultaneously for full functionality.

