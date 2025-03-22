
import { User, Hotel, Booking, Address } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '60d0fe4f5311236168a109ca',
    name: 'John Doe',
    tel_number: '123-456-7890',
    email: 'john.doe@example.com',
    role: 'user'
  },
  {
    id: '60d0fe4f5311236168a109cb',
    name: 'Jane Smith',
    tel_number: '987-654-3210',
    email: 'jane.smith@example.com',
    role: 'user'
  },
  {
    id: '60d0fe4f5311236168a109cc',
    name: 'Admin User',
    tel_number: '555-123-4567',
    email: 'admin@example.com',
    role: 'admin'
  }
];

// Mock Hotel Addresses
const mockAddresses: Address[] = [
  {
    building_number: '123',
    street: 'Main Street',
    district: 'Downtown',
    province: 'Bangkok',
    postal_code: '10330'
  },
  {
    building_number: '456',
    street: 'Beach Road',
    district: 'Patong',
    province: 'Phuket',
    postal_code: '83150'
  },
  {
    building_number: '789',
    street: 'Nimman Road',
    district: 'Suthep',
    province: 'Chiang Mai',
    postal_code: '50200'
  },
  {
    building_number: '101',
    street: 'Sukhumvit Road',
    district: 'Watthana',
    province: 'Bangkok',
    postal_code: '10110'
  },
  {
    building_number: '202',
    street: 'Thonglor',
    district: 'Khlong Tan Nuea',
    province: 'Bangkok',
    postal_code: '10110'
  }
];

// Mock Hotels
export const mockHotels: Hotel[] = [
  {
    id: '60d0fe4f5311236168a109f1',
    name: 'Grand Hyatt Bangkok',
    address: mockAddresses[0],
    tel: '02-123-4567',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '60d0fe4f5311236168a109f2',
    name: 'Phuket Marriott Resort',
    address: mockAddresses[1],
    tel: '076-987-6543',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '60d0fe4f5311236168a109f3',
    name: 'Le Meridien Chiang Mai',
    address: mockAddresses[2],
    tel: '053-123-4567',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '60d0fe4f5311236168a109f4',
    name: 'Sukhumvit Suites',
    address: mockAddresses[3],
    tel: '02-345-6789',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '60d0fe4f5311236168a109f5',
    name: 'Thonglor Design Hotel',
    address: mockAddresses[4],
    tel: '02-987-6543',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Mock Bookings - Generating a mix of past, active, and future bookings
const generateDateRange = (daysInPast: number, daysInFuture: number) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + daysInPast); // Negative for past, positive for future
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysInFuture);
  
  return {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  };
};

export const mockBookings: Booking[] = [
  // Past bookings
  {
    id: '60d0fe4f5311236168a109d1',
    ...generateDateRange(-30, 3), // 30 days ago, stayed for 3 days
    hotel: mockHotels[0],
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() // Created 40 days ago
  },
  {
    id: '60d0fe4f5311236168a109d2',
    ...generateDateRange(-20, 2), // 20 days ago, stayed for 2 days
    hotel: mockHotels[1],
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // Created 25 days ago
  },
  
  // Active bookings (currently staying)
  {
    id: '60d0fe4f5311236168a109d3',
    ...generateDateRange(-1, 3), // Started yesterday, staying for 3 days
    hotel: mockHotels[2],
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Created 7 days ago
  },
  
  // Upcoming bookings
  {
    id: '60d0fe4f5311236168a109d4',
    ...generateDateRange(5, 3), // 5 days from now, staying for 3 days
    hotel: mockHotels[3],
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // Created 2 days ago
  },
  {
    id: '60d0fe4f5311236168a109d5',
    ...generateDateRange(10, 2), // 10 days from now, staying for 2 days
    hotel: mockHotels[4],
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // Created 3 days ago
  },
  {
    id: '60d0fe4f5311236168a109d6',
    ...generateDateRange(15, 3), // 15 days from now, staying for 3 days
    hotel: mockHotels[0],
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Created 5 days ago
  }
];

// Helper function to update the API responses to use mock data
export const setupMockApi = () => {
  // You can call this function to set up mocking if needed
  console.log('Mock data is ready for use');
};
