
import { AuthResponse, Booking, Hotel, User } from '@/types';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

// Helper to handle API errors
const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  throw error;
};

// Auth API calls
export const registerUser = async (userData: Omit<User, 'role' | 'id'>): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, role: 'user' }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    await fetch(`${API_URL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    localStorage.removeItem('token');
  } catch (error: any) {
    handleApiError(error);
  }
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/auth/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

// Hotel API calls
export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const getHotel = async (id: string): Promise<Hotel> => {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotel');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const createHotel = async (hotelData: Omit<Hotel, 'id'>): Promise<Hotel> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/hotels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hotelData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create hotel');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const updateHotel = async (id: string, hotelData: Partial<Hotel>): Promise<Hotel> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/hotels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hotelData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update hotel');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const deleteHotel = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/hotels/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

// Booking API calls
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const getBooking = async (id: string): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const createBooking = async (bookingData: { 
  hotel_id: string;
  start_date: string;
  end_date: string;
}): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const updateBooking = async (
  id: string, 
  bookingData: { start_date?: string; end_date?: string }
): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const getHotelBookings = async (hotelId: string): Promise<Booking[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/hotels/${hotelId}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotel bookings');
    }
    
    return await response.json();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};
