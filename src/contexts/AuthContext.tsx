
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { symptomsDatabase } from '@/lib/database';

// Create a key for localStorage to store the database
const SYMPTOMS_DB_KEY = 'symptoms_database';
// Create a key for localStorage to store registered users
const REGISTERED_USERS_KEY = 'registered_users';

interface User {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  
  useEffect(() => {
    // Check if the user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      
      // Check if the user is an admin
      const adminStatus = localStorage.getItem('isAdmin');
      if (adminStatus === 'true') {
        setIsAdmin(true);
      }
      
      // Get the username
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }
    
    // Load saved symptoms database if it exists
    const savedDatabase = localStorage.getItem(SYMPTOMS_DB_KEY);
    if (savedDatabase) {
      // Merge the saved database with the default one to ensure newly added default symptoms are included
      const parsedDatabase = JSON.parse(savedDatabase);
      Object.assign(symptomsDatabase, parsedDatabase);
    }

    // Initialize registered users if not exists
    if (!localStorage.getItem(REGISTERED_USERS_KEY)) {
      const defaultUsers = [
        { username: 'Admin', email: 'admin@example.com', password: 'Admin@00', isAdmin: true },
        { username: 'User', email: 'user@example.com', password: 'User@00', isAdmin: false }
      ];
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  const login = (usernameInput: string, password: string): boolean => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    
    // Find the user
    const user = registeredUsers.find(
      (user: User) => user.username === usernameInput && user.password === password
    );
    
    if (user) {
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin);
      setUsername(user.username);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
      localStorage.setItem('username', user.username);
      toast({
        title: `${user.isAdmin ? 'Admin' : 'User'} Login Successful`,
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = (username: string, email: string, password: string): boolean => {
    // Get existing registered users
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    
    // Check if username already exists
    const userExists = registeredUsers.some((user: User) => user.username === username);
    if (userExists) {
      return false;
    }
    
    // Add new user
    const newUser = {
      username,
      email,
      password,
      isAdmin: false
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUsername('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
