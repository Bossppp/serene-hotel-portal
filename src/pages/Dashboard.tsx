
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getBookings } from '@/utils/api';
import { Booking } from '@/types';
import { Link } from 'react-router-dom';
import { ArrowRight, UserCog, UserCheck, Hotel, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import BookingCard from '@/components/bookings/BookingCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const handleBookingDelete = () => {
    // Refresh bookings after deletion
    getBookings()
      .then(data => setBookings(data))
      .catch(error => console.error('Failed to refresh bookings:', error));
  };
  
  const upcomingBookings = bookings.filter(
    booking => new Date(booking.start_date) > new Date()
  );
  
  const activeBookings = bookings.filter(
    booking => {
      const now = new Date();
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      return now >= start && now <= end;
    }
  );
  
  const pastBookings = bookings.filter(
    booking => new Date(booking.end_date) < new Date()
  );
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-16 bg-muted/30 animate-fade-in">
          <div className="container px-4 pt-8">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.name}
              </p>
            </div>
            
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Profile</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{user?.tel_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium capitalize">{user?.role}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <UserCog className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Bookings</CardTitle>
                  <CardDescription>Your hotel reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active:</span>
                      <span className="font-medium">{activeBookings.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Upcoming:</span>
                      <span className="font-medium">{upcomingBookings.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Past:</span>
                      <span className="font-medium">{pastBookings.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">{bookings.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Link to="/hotels">
                      <Button variant="outline" size="sm" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book New Stay
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                  <CardDescription>Useful links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/hotels">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Hotel className="w-4 h-4 mr-2" />
                      Browse Hotels
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <UserCog className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Bookings */}
            <div className="space-y-8">
              {/* Active Bookings */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Active Bookings</h2>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(2)].map((_, i) => (
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
                ) : activeBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeBookings.map((booking) => (
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
                      <p className="text-muted-foreground">No active bookings found.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Upcoming Bookings */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
                </div>
                
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
                ) : upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingBookings.map((booking) => (
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
                      <p className="text-muted-foreground">No upcoming bookings found.</p>
                      <Link to="/hotels" className="mt-4 inline-block">
                        <Button>
                          Book a Hotel
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Past Bookings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onDelete={handleBookingDelete}
                        hideActions
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
