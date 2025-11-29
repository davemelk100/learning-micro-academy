#!/bin/bash

# Start script for Learning Micro-Academy Backend

echo "🚀 Starting Learning Micro-Academy Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Copying env.example to .env..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your Supabase credentials before continuing!"
    echo "Press Enter to continue anyway, or Ctrl+C to exit and configure .env..."
    read
fi

# Start the server
echo "🌟 Starting FastAPI server..."
echo "📖 API docs will be available at http://localhost:8000/docs"
echo "🔗 API base URL: http://localhost:8000/api/v1"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000

