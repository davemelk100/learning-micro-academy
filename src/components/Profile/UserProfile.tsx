import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { User, Save, Loader } from "lucide-react";

interface UserProfileProps {
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  interface UserData {
    id?: string;
    email?: string;
    name?: string;
    preferences?: Record<string, unknown>;
  }

  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated || !apiService.isAuthenticated()) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      const response = await apiService.getCurrentUser();
      if (response.data) {
        const userData = response.data as UserData;
        setUser(userData);
        setName(userData.name || "");
        setPreferences((userData.preferences as Record<string, unknown>) || {});
        setError(""); // Clear any previous errors
      } else {
        const errorMessage = response.error || "Failed to load profile";
        setError(errorMessage);
        console.error("Profile load error:", response.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error loading profile";
      setError(errorMessage);
      console.error("Profile load exception:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await apiService.updateUserProfile({
        name,
        preferences,
      });

      if (response.data) {
        const userData = response.data as UserData;
        setUser(userData);
        if (onClose) onClose();
      } else {
        setError(response.error || "Failed to save profile");
      }
    } catch {
      setError("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: string, value: unknown) => {
    setPreferences((prev: Record<string, unknown>) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Profile Settings
          </h2>
          <p className="text-sm text-slate-600">{user?.email}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Preferences</h3>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(preferences.notifications as boolean) || false}
                onChange={(e) =>
                  updatePreference("notifications", e.target.checked)
                }
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
              />
              <span className="text-sm text-slate-700">
                Enable notifications
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(preferences.emailUpdates as boolean) || false}
                onChange={(e) =>
                  updatePreference("emailUpdates", e.target.checked)
                }
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
              />
              <span className="text-sm text-slate-700">Email updates</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(preferences.darkMode as boolean) || false}
                onChange={(e) => updatePreference("darkMode", e.target.checked)}
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
              />
              <span className="text-sm text-slate-700">Dark mode</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Theme
            </label>
            <select
              value={(preferences.theme as string) || "light"}
              onChange={(e) => updatePreference("theme", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Language
            </label>
            <select
              value={(preferences.language as string) || "en"}
              onChange={(e) => updatePreference("language", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Progress Intensity (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={(preferences.progressIntensity as number) || 5}
              onChange={(e) =>
                updatePreference("progressIntensity", parseInt(e.target.value))
              }
              className="w-full"
            />
            <div className="text-sm text-slate-600 mt-1">
              {(preferences.progressIntensity as number) || 5}/10
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
