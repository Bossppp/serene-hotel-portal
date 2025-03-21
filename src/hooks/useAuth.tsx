
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe, loginUser, logoutUser, registerUser, updateUser } from '@/utils/api';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'role' | 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  update: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, token } = await loginUser(email, password);
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'role' | 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, token } = await registerUser(userData);
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      
      setUser(null);
      localStorage.removeItem('token');
      
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const update = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await updateUser(userData);
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        update,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
