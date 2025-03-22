import { AuthResponse, Booking, Hotel, User } from '@/types';
import { toast } from 'sonner';
import { mockUsers, mockHotels, mockBookings } from './mockData';

const API_URL = 'http://localhost:5003/api/v9';

// Flag to use mock data instead of real API
const USE_MOCK_DATA = true;

// Helper to handle API errors
const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  throw error;
};

// Auth API calls
export const registerUser = async (userData: Omit<User, 'role' | 'id'>): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    // Mock registration
    const newUser = {
      ...userData,
      id: `mock-${Date.now()}`,
      role: 'user' as const
    };
    
    // Create mock token
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    
    return {
      user: newUser,
      token
    };
  }

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
  if (USE_MOCK_DATA) {
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
    
    // Create mock token
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    
    return {
      user,
      token
    };
  }

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
  if (USE_MOCK_DATA) {
    // Return the first mock user as the logged-in user
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    return mockUsers[0];
  }

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
  if (USE_MOCK_DATA) {
    localStorage.removeItem('token');
    return;
  }

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
  if (USE_MOCK_DATA) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Return updated user data
    return {
      ...mockUsers[0],
      ...userData
    };
  }

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
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockHotels];
  }

  try {
    const response = await fetch(`${API_URL}/hotels`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    handleApiError(error);
    console.error('Error fetching hotels:', error);
    return [];
  }
};

export const getHotel = async (id: string): Promise<Hotel> => {
  if (USE_MOCK_DATA) {
    // Find hotel by ID
    const hotel = mockHotels.find(h => h.id === id);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    
    return hotel;
  }

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
  if (USE_MOCK_DATA) {
    // Create a new hotel with a mock ID
    const newHotel = {
      ...hotelData,
      id: `mock-hotel-${Date.now()}`
    };
    
    return newHotel;
  }

  try {
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
  if (USE_MOCK_DATA) {
    // Find hotel by ID
    const hotel = mockHotels.find(h => h.id === id);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    
    // Return updated hotel data
    return {
      ...hotel,
      ...hotelData
    };
  }

  try {
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
  if (USE_MOCK_DATA) {
    // In a real implementation, you would remove the hotel from the array
    return;
  }

  try {
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
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockBookings];
  }

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
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    handleApiError(error);
    return [];
  }
};

export const getBooking = async (id: string): Promise<Booking> => {
  if (USE_MOCK_DATA) {
    // Find booking by ID
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  }

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
  if (USE_MOCK_DATA) {
    // Find hotel by ID
    const hotel = mockHotels.find(h => h.id === bookingData.hotel_id);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    
    // Create a new booking with mock data
    const newBooking: Booking = {
      id: `mock-booking-${Date.now()}`,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      hotel: hotel,
      user: mockUsers[0], // Use the first mock user
      createdAt: new Date().toISOString()
    };
    
    return newBooking;
  }

  try {
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
  if (USE_MOCK_DATA) {
    // Find booking by ID
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Return updated booking data
    return {
      ...booking,
      ...bookingData
    };
  }

  try {
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
  if (USE_MOCK_DATA) {
    // In a real implementation, you would remove the booking from the array
    return;
  }

  try {
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
  if (USE_MOCK_DATA) {
    // Filter bookings by hotel ID
    const bookings = mockBookings.filter(b => b.hotel.id === hotelId);
    return bookings;
  }

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
