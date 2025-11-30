/**
 * API Service for communicating with the backend
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: response.statusText }));
        return { error: error.detail || "Request failed" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication
  async signup(email: string, password: string, name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<{ access_token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await this.request<{ access_token: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.data?.access_token) {
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  async refreshToken() {
    return this.request<{ access_token: string }>("/auth/refresh", {
      method: "POST",
    });
  }

  // User Profile
  async getCurrentUser() {
    return this.request("/users/me");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateUserProfile(updates: { name?: string; preferences?: any }) {
    return this.request("/users/me", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateUserPreferences(preferences: any) {
    return this.request("/users/me/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    });
  }

  // Goals
  async getGoals() {
    return this.request("/goals");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createGoal(goal: any) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(goal),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateGoal(goalId: string, updates: any) {
    return this.request(`/goals/${goalId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(goalId: string) {
    return this.request(`/goals/${goalId}`, {
      method: "DELETE",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateUserGoals(goals: any[]) {
    return this.request("/users/me/goals", {
      method: "PUT",
      body: JSON.stringify({ goals }),
    });
  }

  // Courses
  async getCourses() {
    return this.request("/courses");
  }

  async getCourse(courseId: string) {
    return this.request(`/courses/${courseId}`);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentUserFromStorage(): any {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
