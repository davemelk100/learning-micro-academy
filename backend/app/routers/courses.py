"""
Course-related routes
"""
from fastapi import APIRouter, Depends
from app.core.dependencies import get_supabase
from app.database.supabase_client import Client

router = APIRouter()

@router.get("/")
async def get_courses(supabase: Client = Depends(get_supabase)):
    """Get all available courses"""
    try:
        response = supabase.table("courses").select("*").execute()
        return response.data
    except Exception as e:
        return []  # Return empty list if courses table doesn't exist yet

@router.get("/{course_id}")
async def get_course(course_id: str, supabase: Client = Depends(get_supabase)):
    """Get a specific course by ID"""
    try:
        response = supabase.table("courses").select("*").eq("id", course_id).single().execute()
        return response.data
    except Exception as e:
        return None

