"""
Goal management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.core.dependencies import get_current_user
from app.database.database_adapter import db
import uuid

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
    current_user: dict = Depends(get_current_user)
):
    """Get all goals for current user"""
    try:
        goals = db.get_user_goals(current_user["id"])
        return goals
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching goals: {str(e)}"
        )

@router.post("/")
async def create_goal(
    goal: GoalCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new goal"""
    try:
        new_goal = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "title": goal.title,
            "description": goal.description,
            "learningStyleId": goal.learningStyleId,
            "sdg_ids": goal.sdgIds,
            "progress": goal.progress,
            "completed": goal.completed,
            "target": 1
        }
        
        created_goal = db.create_goal(new_goal)
        return created_goal
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating goal: {str(e)}"
        )

@router.put("/{goal_id}")
async def update_goal(
    goal_id: str,
    goal_update: GoalUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a goal"""
    try:
        # Verify goal belongs to user
        goal = db.get_goal_by_id(goal_id)
        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        
        if goal.get("user_id") != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this goal"
            )
        
        updates = goal_update.dict(exclude_unset=True)
        updated_goal = db.update_goal(goal_id, updates)
        return updated_goal
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
    current_user: dict = Depends(get_current_user)
):
    """Delete a goal"""
    try:
        # Verify goal belongs to user
        goal = db.get_goal_by_id(goal_id)
        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found"
            )
        
        if goal.get("user_id") != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this goal"
            )
        
        db.delete_goal(goal_id)
        return {"message": "Goal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting goal: {str(e)}"
        )
