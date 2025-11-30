"""
Supabase client initialization and utilities
"""
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional

_supabase_client: Optional[Client] = None
_supabase_service_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get Supabase client with anon key"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
    return _supabase_client

def get_supabase_service_client() -> Client:
    """Get Supabase client with service role key (admin access)"""
    global _supabase_service_client
    if _supabase_service_client is None:
        _supabase_service_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    return _supabase_service_client

