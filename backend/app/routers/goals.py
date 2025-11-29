"""
Goal management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.core.dependencies import get_current_user, get_supabase
from app.database.supabase_client import Client

router = APIRouter()

class GoalCreate(BaseModel):
    learningStyleId: str
    sdgIds: List[str]
    title: str
    description: str
    progress: int = 0
    completed: bool = False

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[int] = None
    completed: Optional[bool] = None

@router.get("/")
async def get_goals(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all goals for current user"""
    try:
        response = supabase.table("users").select("goals").eq("id", current_user["id"]).single().execute()
        return response.data.get("goals", []) if response.data else []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching goals: {str(e)}"
        )

@router.post("/")
async def create_goal(
    goal: GoalCreate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new goal"""
    try:
        # Get current goals
        user_response = supabase.table("users").select("goals").eq("id", current_user["id"]).single().execute()
        current_goals = user_response.data.get("goals", []) if user_response.data else []
        
        # Create new goal
        import uuid
        new_goal = {
            "id": str(uuid.uuid4()),
            **goal.dict()
        }
        
        # Add to goals array
        current_goals.append(new_goal)
        
        # Update user
        response = supabase.table("users").update({
            "goals": current_goals
        }).eq("id", current_user["id"]).execute()
        
        return new_goal
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating goal: {str(e)}"
        )

@router.put("/{goal_id}")
async def update_goal(
    goal_id: str,
    goal_update: GoalUpdate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a goal"""
    try:
        # Get current goals
        user_response = supabase.table("users").select("goals").eq("id", current_user["id"]).single().execute()
        current_goals = user_response.data.get("goals", []) if user_response.data else []
        
        # Find and update goal
        updated = False
        for i, goal in enumerate(current_goals):
            if goal.get("id") == goal_id:
                current_goals[i].update(goal_update.dict(exclude_unset=True))
                updated = True
                break
        
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        
        # Update user
        response = supabase.table("users").update({
            "goals": current_goals
        }).eq("id", current_user["id"]).execute()
        
        return [g for g in current_goals if g.get("id") == goal_id][0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating goal: {str(e)}"
        )

@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete a goal"""
    try:
        # Get current goals
        user_response = supabase.table("users").select("goals").eq("id", current_user["id"]).single().execute()
        current_goals = user_response.data.get("goals", []) if user_response.data else []
        
        # Remove goal
        filtered_goals = [g for g in current_goals if g.get("id") != goal_id]
        
        if len(filtered_goals) == len(current_goals):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        
        # Update user
        response = supabase.table("users").update({
            "goals": filtered_goals
        }).eq("id", current_user["id"]).execute()
        
        return {"message": "Goal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting goal: {str(e)}"
        )

