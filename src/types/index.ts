
export interface User {
  id?: string;
  name: string;
  tel_number: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

export interface Address {
  building_number: string;
  street: string;
  district: string;
  province: string;
  postal_code: string;
}

export interface Hotel {
  id?: string;
  name: string;
  address: Address;
  tel: string;
  image?: string;
}

export interface Booking {
  id?: string;
  start_date: string;
  end_date: string;
  hotel: Hotel;
  user: User;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
