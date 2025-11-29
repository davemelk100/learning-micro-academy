"""
Authentication routes for user signup, login, and token management
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.database.supabase_client import get_supabase_client, get_supabase_service_client
from app.core.security import create_access_token, verify_password, get_password_hash
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    """Create a new user account"""
    supabase = get_supabase_client()
    
    try:
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        user_id = auth_response.user.id
        
        # Create user profile in database
        profile_data = {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "preferences": {
                "theme": "light",
                "notifications": True,
                "emailUpdates": True,
                "language": "en",
                "selectedLearningStyle": None,
                "selectedSDGs": [],
                "currentSelectedSDG": "",
                "hasCompletedSDGSetup": False,
                "hasCompletedOnboarding": False,
                "newGoal": {
                    "title": "",
                    "description": "",
                    "target": 0
                },
                "lastUpdated": None,
                "selectedFont": "system",
                "darkMode": False,
                "progressIntensity": 5,
                "completedCourses": []
            },
            "goals": [],
            "progress": []
        }
        
        # Insert user profile
        profile_response = supabase.table("users").insert(profile_data).execute()
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user_id, "email": user_data.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.email,
                "name": user_data.name
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return access token"""
    supabase = get_supabase_client()
    
    try:
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user_id = auth_response.user.id
        
        # Get user profile
        profile_response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        
        if not profile_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user_id, "email": credentials.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": profile_response.data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh access token"""
    access_token = create_access_token(
        data={"sub": current_user["id"], "email": current_user["email"]}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

