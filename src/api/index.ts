
import { AuthResponse, Booking, Hotel, User } from '@/types';
import { toast } from 'sonner';
import { mockUsers, mockHotels, mockBookings } from '../utils/mockData';

// Simulate Next.js API routes
const api = {
  auth: {
    register: async (userData: Omit<User, 'role' | 'id'>): Promise<AuthResponse> => {
      // Simulate API call
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
    },
    
    login: async (email: string, password: string): Promise<AuthResponse> => {
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
    },
    
    getMe: async (): Promise<User> => {
      // Return the first mock user as the logged-in user
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      return mockUsers[0];
    },
    
    logout: async (): Promise<void> => {
      localStorage.removeItem('token');
      return;
    },
    
    updateUser: async (userData: Partial<User>): Promise<User> => {
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
  },
  
  hotels: {
    getAll: async (): Promise<Hotel[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockHotels];
    },
    
    getById: async (id: string): Promise<Hotel> => {
      // Find hotel by ID
      const hotel = mockHotels.find(h => h.id === id);
      
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      
      return hotel;
    },
    
    create: async (hotelData: Omit<Hotel, 'id'>): Promise<Hotel> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Create a new hotel with a mock ID
      const newHotel = {
        ...hotelData,
        id: `mock-hotel-${Date.now()}`
      };
      
      return newHotel;
    },
    
    update: async (id: string, hotelData: Partial<Hotel>): Promise<Hotel> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
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
    },
    
    delete: async (id: string): Promise<void> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // In a real implementation, you would remove the hotel from the array
      return;
    }
  },
  
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockBookings];
    },
    
    getById: async (id: string): Promise<Booking> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Find booking by ID
      const booking = mockBookings.find(b => b.id === id);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
    },
    
    create: async (bookingData: { 
      hotel_id: string;
      start_date: string;
      end_date: string;
    }): Promise<Booking> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
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
    },
    
    update: async (
      id: string, 
      bookingData: { start_date?: string; end_date?: string }
    ): Promise<Booking> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
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
    },
    
    delete: async (id: string): Promise<void> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // In a real implementation, you would remove the booking from the array
      return;
    },
    
    getByHotelId: async (hotelId: string): Promise<Booking[]> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Filter bookings by hotel ID
      const bookings = mockBookings.filter(b => b.hotel.id === hotelId);
      return bookings;
    }
  }
};

export default api;
