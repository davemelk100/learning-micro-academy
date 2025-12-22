"""
User profile management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.core.dependencies import get_current_user
from app.database.database_adapter import db

router = APIRouter()

class UserPreferencesUpdate(BaseModel):
    preferences: Dict[str, Any]

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

@router.get("/me")
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user)
):
    """Get current user's profile"""
    try:
        user = db.get_user_by_id(current_user["id"])
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}"
        )

@router.put("/me")
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    try:
        update_data = {}
        if profile_update.name:
            update_data["name"] = profile_update.name
        if profile_update.preferences:
            # Merge preferences with existing ones
            existing_user = db.get_user_by_id(current_user["id"])
            existing_prefs = existing_user.get("preferences", {}) if existing_user else {}
            existing_prefs.update(profile_update.preferences)
            update_data["preferences"] = existing_prefs
        
        updated_user = db.update_user(current_user["id"], update_data)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )

@router.put("/me/preferences")
async def update_user_preferences(
    preferences_update: UserPreferencesUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user preferences"""
    try:
        updated_user = db.update_user(current_user["id"], {
            "preferences": preferences_update.preferences
        })
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating preferences: {str(e)}"
        )

@router.get("/me/goals")
async def get_user_goals(
    current_user: dict = Depends(get_current_user)
):
    """Get user's goals"""
    try:
        user = db.get_user_by_id(current_user["id"])
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user.get("goals", [])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching goals: {str(e)}"
        )

class UserGoalsUpdate(BaseModel):
    goals: List[Dict[str, Any]]

@router.put("/me/goals")
async def update_user_goals(
    goals_update: UserGoalsUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user's goals"""
    try:
        updated_user = db.update_user(current_user["id"], {
            "goals": goals_update.goals
        })
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating goals: {str(e)}"
        )
