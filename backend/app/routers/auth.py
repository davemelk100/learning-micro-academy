"""
Authentication routes for user signup, login, and token management
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.database.database_adapter import db
from app.core.security import create_access_token, verify_password, get_password_hash
from datetime import timedelta
from app.core.config import settings
import uuid

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
    # Check if user already exists
    existing_user = db.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    try:
        # Generate user ID
        user_id = str(uuid.uuid4())
        
        # Hash password
        password_hash = get_password_hash(user_data.password)
        
        # Create user profile
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
        
        # Create user in database
        if db.use_sqlite:
            # For SQLite, store password hash
            db.create_user(user_id, user_data.email, user_data.name, password_hash)
        else:
            # For Supabase, use Supabase Auth
            from app.database.supabase_client import get_supabase_client
            supabase = get_supabase_client()
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
            db.create_user(user_id, user_data.email, user_data.name, "")
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return access token"""
    try:
        if db.use_sqlite:
            # SQLite authentication
            user = db.get_user_by_email(credentials.email)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # Verify password
            password_hash = db.get_user_password_hash(user["id"])
            if not password_hash or not verify_password(credentials.password, password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            user_id = user["id"]
        else:
            # Supabase authentication
            from app.database.supabase_client import get_supabase_client
            supabase = get_supabase_client()
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
            user = db.get_user_by_id(user_id)
            
            if not user:
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
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "preferences": user.get("preferences", {})
            }
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
    from app.core.dependencies import get_current_user
    access_token = create_access_token(
        data={"sub": current_user["id"], "email": current_user["email"]}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
