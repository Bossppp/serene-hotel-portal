
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Hotel } from '@/types';
import { getHotel } from '@/utils/api';
import { MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLazyImage } from '@/hooks/useLazyImage';
import BookingForm from '@/components/bookings/BookingForm';
import { useAuth } from '@/hooks/useAuth';

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id) {
          setError('Hotel ID is missing');
          setLoading(false);
          return;
        }
        
        const data = await getHotel(id);
        setHotel(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch hotel details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotel();
  }, [id]);
  
  const { imageSrc, imageLoaded } = useLazyImage(
    hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 bg-muted/30 animate-fade-in">
        <div className="container px-4 pt-8">
          <Link to="/hotels" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Hotels
          </Link>
          
          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="aspect-[2/1] bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Link to="/hotels" className="mt-4 inline-block">
                <Button>View All Hotels</Button>
              </Link>
            </div>
          ) : hotel ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={hotel.name}
                    className={`w-full h-auto object-cover transition-all ${
                      !imageLoaded ? 'lazy-image loading' : 'lazy-image'
                    }`}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground ml-2">
                      {hotel.address.building_number} {hotel.address.street}, {hotel.address.district}, {hotel.address.province}, {hotel.address.postal_code}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground ml-2">{hotel.tel}</p>
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <h2 className="text-xl font-semibold mb-4">About this Hotel</h2>
                  <p>
                    Experience luxury and comfort at {hotel.name}. Located in the heart of {hotel.address.district}, our hotel offers the perfect blend of convenience and relaxation for your stay.
                  </p>
                  <p>
                    Our staff is dedicated to providing exceptional service to ensure your stay is memorable. Whether you're visiting for business or leisure, {hotel.name} is your ideal home away from home.
                  </p>
                  <h3 className="text-lg font-semibold mt-6 mb-3">Amenities</h3>
                  <ul>
                    <li>High-speed Wi-Fi</li>
                    <li>24/7 Room service</li>
                    <li>Swimming pool</li>
                    <li>Fitness center</li>
                    <li>On-site restaurant</li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                {isAuthenticated ? (
                  <BookingForm hotel={hotel} />
                ) : (
                  <div className="bg-card rounded-lg border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>
                    <p className="text-muted-foreground mb-6">
                      Please sign in to book this hotel.
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Link to="/login">
                        <Button className="w-full">Sign In</Button>
                      </Link>
                      <Link to="/register">
                        <Button variant="outline" className="w-full">Register</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">Hotel Not Found</h3>
              <p className="text-muted-foreground">
                The hotel you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/hotels" className="mt-4 inline-block">
                <Button>View All Hotels</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
