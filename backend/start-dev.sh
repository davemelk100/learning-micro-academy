#!/bin/bash

# Quick start script for development (minimal setup)

echo "🚀 Starting Backend (Development Mode)..."

# Activate venv if it exists, otherwise create it
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt -q

# Create minimal .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating minimal .env file..."
    cat > .env << EOF
# Minimal config for development
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_KEY=placeholder-key
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key
JWT_SECRET_KEY=dev-secret-key-change-in-production-$(date +%s)
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
EOF
    echo "⚠️  Created .env with placeholder values. Update with real Supabase credentials for full functionality."
fi

echo "🌟 Starting server on http://localhost:8000"
echo "📖 API docs: http://localhost:8000/docs"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000

