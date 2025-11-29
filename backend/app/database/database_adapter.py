"""
Database adapter that supports both Supabase and SQLite
"""
from typing import Optional, Dict, Any, List
import sqlite3
import json
import os
from datetime import datetime
from pathlib import Path
import uuid

from app.core.config import settings

# SQLite database file path
SQLITE_DB_PATH = Path(__file__).parent.parent.parent / "local.db"


class DatabaseAdapter:
    """Adapter for database operations supporting both Supabase and SQLite"""
    
    def __init__(self):
        # Check if we should use SQLite (either via env var or if Supabase is not configured)
        use_sqlite_env = os.getenv("USE_SQLITE", "false").lower() == "true"
        supabase_configured = (
            os.getenv("SUPABASE_URL") and 
            os.getenv("SUPABASE_KEY") and 
            os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        )
        
        # Use SQLite if explicitly set OR if Supabase is not configured
        self.use_sqlite = use_sqlite_env or not supabase_configured
        self.conn = None
        
        if self.use_sqlite:
            self._init_sqlite()
        else:
            try:
                from app.database.supabase_client import get_supabase_service_client
                self.supabase = get_supabase_service_client()
            except Exception:
                # Fallback to SQLite if Supabase fails
                self.use_sqlite = True
                self._init_sqlite()
    
    def _init_sqlite(self):
        """Initialize SQLite database and create tables if needed"""
        self.conn = sqlite3.connect(str(SQLITE_DB_PATH))
        self.conn.row_factory = sqlite3.Row
        self._create_tables()
    
    def _create_tables(self):
        """Create SQLite tables"""
        cursor = self.conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                preferences TEXT DEFAULT '{}',
                goals TEXT DEFAULT '[]',
                progress TEXT DEFAULT '[]',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Courses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS courses (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                duration TEXT,
                level TEXT,
                lessons TEXT DEFAULT '[]',
                image TEXT,
                instructor TEXT,
                tags TEXT DEFAULT '[]',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # User courses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_courses (
                user_id TEXT NOT NULL,
                course_id TEXT NOT NULL,
                progress INTEGER DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                PRIMARY KEY (user_id, course_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Goals table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS goals (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                virtue_id TEXT,
                sdg_ids TEXT DEFAULT '[]',
                progress INTEGER DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                target INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        self.conn.commit()
    
    def get_connection(self):
        """Get database connection"""
        if self.use_sqlite:
            if self.conn is None:
                self._init_sqlite()
            return self.conn
        return self.supabase
    
    # User operations
    def create_user(self, user_id: str, email: str, name: str, password_hash: str) -> Dict[str, Any]:
        """Create a new user"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("""
                INSERT INTO users (id, email, name, password_hash, preferences, goals, progress)
                VALUES (?, ?, ?, ?, '{}', '[]', '[]')
            """, (user_id, email, name, password_hash))
            self.conn.commit()
            return {
                "id": user_id,
                "email": email,
                "name": name,
                "preferences": {},
                "goals": [],
                "progress": []
            }
        else:
            result = self.supabase.table("users").insert({
                "id": user_id,
                "email": email,
                "name": name,
                "preferences": {},
                "goals": [],
                "progress": []
            }).execute()
            return result.data[0] if result.data else None
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            row = cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "email": row["email"],
                    "name": row["name"],
                    "password_hash": row["password_hash"],
                    "preferences": json.loads(row["preferences"]),
                    "goals": json.loads(row["goals"]),
                    "progress": json.loads(row["progress"])
                }
            return None
        else:
            # For Supabase, we'd need to query auth.users separately
            # This is a simplified version - you'd need to handle auth separately
            result = self.supabase.table("users").select("*").eq("email", email).execute()
            return result.data[0] if result.data else None
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return {
                    "id": row["id"],
                    "email": row["email"],
                    "name": row["name"],
                    "preferences": json.loads(row["preferences"]),
                    "goals": json.loads(row["goals"]),
                    "progress": json.loads(row["progress"])
                }
            return None
        else:
            result = self.supabase.table("users").select("*").eq("id", user_id).execute()
            return result.data[0] if result.data else None
    
    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            set_clauses = []
            values = []
            
            if "name" in updates:
                set_clauses.append("name = ?")
                values.append(updates["name"])
            
            if "preferences" in updates:
                set_clauses.append("preferences = ?")
                values.append(json.dumps(updates["preferences"]))
            
            if "goals" in updates:
                set_clauses.append("goals = ?")
                values.append(json.dumps(updates["goals"]))
            
            if "progress" in updates:
                set_clauses.append("progress = ?")
                values.append(json.dumps(updates["progress"]))
            
            set_clauses.append("updated_at = CURRENT_TIMESTAMP")
            values.append(user_id)
            
            cursor.execute(
                f"UPDATE users SET {', '.join(set_clauses)} WHERE id = ?",
                values
            )
            self.conn.commit()
            return self.get_user_by_id(user_id)
        else:
            result = self.supabase.table("users").update(updates).eq("id", user_id).execute()
            return result.data[0] if result.data else None
    
    def get_user_password_hash(self, user_id: str) -> Optional[str]:
        """Get user password hash (SQLite only)"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("SELECT password_hash FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            return row["password_hash"] if row else None
        return None
    
    # Goal operations
    def get_user_goals(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all goals for a user"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM goals WHERE user_id = ?", (user_id,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        else:
            result = self.supabase.table("goals").select("*").eq("user_id", user_id).execute()
            return result.data if result.data else []
    
    def create_goal(self, goal: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new goal"""
        if self.use_sqlite:
            goal_id = goal.get("id", str(uuid.uuid4()))
            cursor = self.conn.cursor()
            cursor.execute("""
                INSERT INTO goals (id, user_id, title, description, virtue_id, sdg_ids, progress, completed, target)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                goal_id,
                goal["user_id"],
                goal.get("title", ""),
                goal.get("description", ""),
                goal.get("virtue_id"),
                json.dumps(goal.get("sdg_ids", [])),
                goal.get("progress", 0),
                goal.get("completed", False),
                goal.get("target", 1)
            ))
            self.conn.commit()
            return self.get_goal_by_id(goal_id)
        else:
            result = self.supabase.table("goals").insert(goal).execute()
            return result.data[0] if result.data else None
    
    def get_goal_by_id(self, goal_id: str) -> Optional[Dict[str, Any]]:
        """Get goal by ID"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM goals WHERE id = ?", (goal_id,))
            row = cursor.fetchone()
            if row:
                goal = dict(row)
                goal["sdg_ids"] = json.loads(goal["sdg_ids"])
                return goal
            return None
        else:
            result = self.supabase.table("goals").select("*").eq("id", goal_id).execute()
            return result.data[0] if result.data else None
    
    def update_goal(self, goal_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update a goal"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            set_clauses = []
            values = []
            
            for key, value in updates.items():
                if key == "sdg_ids":
                    set_clauses.append("sdg_ids = ?")
                    values.append(json.dumps(value))
                else:
                    set_clauses.append(f"{key} = ?")
                    values.append(value)
            
            set_clauses.append("updated_at = CURRENT_TIMESTAMP")
            values.append(goal_id)
            
            cursor.execute(
                f"UPDATE goals SET {', '.join(set_clauses)} WHERE id = ?",
                values
            )
            self.conn.commit()
            return self.get_goal_by_id(goal_id)
        else:
            result = self.supabase.table("goals").update(updates).eq("id", goal_id).execute()
            return result.data[0] if result.data else None
    
    def delete_goal(self, goal_id: str) -> bool:
        """Delete a goal"""
        if self.use_sqlite:
            cursor = self.conn.cursor()
            cursor.execute("DELETE FROM goals WHERE id = ?", (goal_id,))
            self.conn.commit()
            return cursor.rowcount > 0
        else:
            result = self.supabase.table("goals").delete().eq("id", goal_id).execute()
            return len(result.data) > 0 if result.data else False


# Global database adapter instance
db = DatabaseAdapter()

