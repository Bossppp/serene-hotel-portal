
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
import { Hotel, Booking, User } from '@/types';
import { getHotels, getBookings, getMe } from '@/utils/api';
import { Link } from 'react-router-dom';
import { Hotel as HotelIcon, Calendar, Users, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingCard from '@/components/bookings/BookingCard';
import HotelCard from '@/components/hotels/HotelCard';

export default function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsData, bookingsData] = await Promise.all([
          getHotels(),
          getBookings()
        ]);
        
        setHotels(hotelsData);
        setBookings(bookingsData);
        
        // Extract unique users from bookings
        const uniqueUsers = Array.from(
          new Map(bookingsData.map(booking => [booking.user.id, booking.user])).values()
        );
        setUsers(uniqueUsers);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleBookingDelete = () => {
    // Refresh bookings after deletion
    getBookings()
      .then(data => setBookings(data))
      .catch(error => console.error('Failed to refresh bookings:', error));
  };
  
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-16 bg-muted/30 animate-fade-in">
          <div className="container px-4 pt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage hotels, bookings, and user accounts
              </p>
            </div>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <HotelIcon className="mr-2 h-5 w-5 text-primary" />
                    Hotels
                  </CardTitle>
                  <CardDescription>Manage your hotel listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{hotels.length}</div>
                  <p className="text-sm text-muted-foreground mb-4">Total hotels in system</p>
                  <Link to="/admin/hotels">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Hotels
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Bookings
                  </CardTitle>
                  <CardDescription>All reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{bookings.length}</div>
                  <p className="text-sm text-muted-foreground mb-4">Total bookings in system</p>
                  <Link to="/admin/bookings">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Bookings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Users
                  </CardTitle>
                  <CardDescription>Registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{users.length}</div>
                  <p className="text-sm text-muted-foreground mb-4">Total users in system</p>
                  <Link to="/admin/users">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Users
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              
              <Tabs defaultValue="bookings">
                <TabsList className="mb-6">
                  <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                  <TabsTrigger value="hotels">Recent Hotels</TabsTrigger>
                  <TabsTrigger value="users">Recent Users</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardHeader className="pb-2">
                            <div className="h-5 bg-muted rounded w-1/2 mb-2" />
                            <div className="h-4 bg-muted rounded w-3/4" />
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="h-4 bg-muted rounded w-full" />
                              <div className="h-4 bg-muted rounded w-full" />
                              <div className="h-4 bg-muted rounded w-3/4" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.slice(0, 6).map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          onDelete={handleBookingDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No bookings found in the system.</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {bookings.length > 6 && (
                    <div className="text-center mt-6">
                      <Link to="/admin/bookings">
                        <Button variant="outline">
                          View All Bookings
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="hotels">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card animate-pulse">
                          <div className="aspect-[16/9] bg-muted" />
                          <div className="p-6">
                            <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                            <div className="space-y-2 mb-4">
                              <div className="h-4 bg-muted rounded w-full" />
                              <div className="h-4 bg-muted rounded w-2/3" />
                            </div>
                            <div className="h-10 bg-muted rounded w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : hotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hotels.slice(0, 6).map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No hotels found in the system.</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {hotels.length > 6 && (
                    <div className="text-center mt-6">
                      <Link to="/admin/hotels">
                        <Button variant="outline">
                          View All Hotels
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="users">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardHeader className="pb-2">
                            <div className="h-5 bg-muted rounded w-1/2 mb-2" />
                            <div className="h-4 bg-muted rounded w-3/4" />
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="h-4 bg-muted rounded w-full" />
                              <div className="h-4 bg-muted rounded w-full" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {users.slice(0, 6).map((user) => (
                        <Card key={user.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Role:</span>
                                <span className="font-medium capitalize">{user.role}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{user.tel_number}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No users found in the system.</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {users.length > 6 && (
                    <div className="text-center mt-6">
                      <Link to="/admin/users">
                        <Button variant="outline">
                          View All Users
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
