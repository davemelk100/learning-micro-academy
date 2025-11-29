/**
 * Example: How to integrate authentication in your React components
 * 
 * This is a reference implementation showing how to use the API service
 * for authentication and user management.
 */

import React, { useState, useEffect } from 'react';
import { apiService } from './apiService';

export const AuthExample: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = apiService.getCurrentUserFromStorage();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiService.signup(email, password, name);
    if (response.data) {
      setUser(response.data.user);
      alert('Account created successfully!');
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiService.login(email, password);
    if (response.data) {
      setUser(response.data.user);
      alert('Logged in successfully!');
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    alert('Logged out successfully!');
  };

  const handleUpdateProfile = async () => {
    const response = await apiService.updateUserProfile({
      name: 'Updated Name',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    });
    if (response.data) {
      setUser(response.data);
      alert('Profile updated!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

