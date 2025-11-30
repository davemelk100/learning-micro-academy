# Using SQLite for Local Development

This backend now supports **SQLite** as a local database option, perfect for development when you don't have Supabase available.

## Quick Start with SQLite

1. **Enable SQLite mode** in your `.env` file:
   ```env
   USE_SQLITE=true
   ```

2. **Start the backend**:
   ```bash
   npm run backend:dev
   # or
   cd backend && bash start-dev.sh
   ```

That's it! The database will be automatically created at `backend/local.db` when you first start the server.

## How It Works

- When `USE_SQLITE=true`, the backend uses a local SQLite database file (`backend/local.db`)
- No Supabase account or credentials needed
- All data is stored locally in a single file
- Perfect for development and testing

## Switching Between SQLite and Supabase

- **SQLite**: Set `USE_SQLITE=true` in `.env` (or leave Supabase credentials empty)
- **Supabase**: Set `USE_SQLITE=false` and provide valid Supabase credentials

## Database File Location

The SQLite database file is created at:
```
backend/local.db
```

You can delete this file to reset your local database (all data will be lost).

## Features Supported

✅ User signup and login  
✅ User profile management  
✅ Goals CRUD operations  
✅ JWT authentication  
✅ All API endpoints work the same way

## Limitations

- SQLite is file-based and single-user (fine for local dev)
- No built-in auth service (we handle password hashing)
- No real-time features (Supabase has real-time subscriptions)
- For production, use Supabase or another hosted database

## Troubleshooting

**Database file not created?**
- Make sure the backend has write permissions in the `backend/` directory
- Check that `USE_SQLITE=true` is set in `.env`

**Can't connect?**
- Make sure the backend server is running
- Check that port 8000 is available
- Verify `.env` file exists and has `USE_SQLITE=true`

