"""
User profile management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.dependencies import get_current_user, get_supabase
from app.database.supabase_client import Client

router = APIRouter()

class UserPreferencesUpdate(BaseModel):
    preferences: Dict[str, Any]

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

@router.get("/me")
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get current user's profile"""
    try:
        response = supabase.table("users").select("*").eq("id", current_user["id"]).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}"
        )

@router.put("/me")
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update user profile"""
    try:
        update_data = {}
        if profile_update.name:
            update_data["name"] = profile_update.name
        if profile_update.preferences:
            # Merge preferences with existing ones
            existing = supabase.table("users").select("preferences").eq("id", current_user["id"]).single().execute()
            existing_prefs = existing.data.get("preferences", {}) if existing.data else {}
            existing_prefs.update(profile_update.preferences)
            update_data["preferences"] = existing_prefs
        
        response = supabase.table("users").update(update_data).eq("id", current_user["id"]).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )

@router.put("/me/preferences")
async def update_user_preferences(
    preferences_update: UserPreferencesUpdate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update user preferences"""
    try:
        response = supabase.table("users").update({
            "preferences": preferences_update.preferences
        }).eq("id", current_user["id"]).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating preferences: {str(e)}"
        )

@router.get("/me/goals")
async def get_user_goals(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get user's goals"""
    try:
        response = supabase.table("users").select("goals").eq("id", current_user["id"]).single().execute()
        return response.data.get("goals", []) if response.data else []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching goals: {str(e)}"
        )

@router.put("/me/goals")
async def update_user_goals(
    goals: list,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update user's goals"""
    try:
        response = supabase.table("users").update({
            "goals": goals
        }).eq("id", current_user["id"]).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating goals: {str(e)}"
        )

