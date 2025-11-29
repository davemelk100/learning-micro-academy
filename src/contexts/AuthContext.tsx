import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "../services/apiService";

interface UserData {
  id?: string;
  email?: string;
  name?: string;
  preferences?: Record<string, unknown>;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
          } else {
            // Token might be invalid, clear it
            apiService.logout();
          }
        } catch {
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);
      if (response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const response = await apiService.signup(email, password, name);
      if (response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      // Error is used in console.error, so it's fine
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
