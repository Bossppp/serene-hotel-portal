
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hotel, Calendar, Search } from 'lucide-react';
import { getHotels } from '@/utils/api';
import { Hotel as HotelType } from '@/types';
import HotelCard from '@/components/hotels/HotelCard';

export default function Index() {
  const [popularHotels, setPopularHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotels = await getHotels();
        // Ensure hotels is an array before calling slice
        const hotelArray = Array.isArray(hotels) ? hotels : [];
        setPopularHotels(hotelArray.slice(0, 3));
        console.log('Fetched hotels:', hotels);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        setPopularHotels([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Luxury hotel"
            className="w-full h-full object-cover animate-blur-in"
          />
        </div>
        
        <div className="container relative z-20 px-4 py-32 md:py-40 lg:py-52">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Experience Tranquility in Every Stay
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover the perfect blend of comfort and luxury at our handpicked hotels. Book your dream getaway today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/hotels">
                <Button size="lg" className="btn-hover-effect">
                  Browse Hotels
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 btn-hover-effect">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold mb-4">Why Choose Serenity Hotels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience a seamless booking process and enjoy premium accommodations tailored to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Curated Selection</h3>
              <p className="text-muted-foreground">
                Handpicked hotels that meet our high standards for comfort and service.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Flexible Booking</h3>
              <p className="text-muted-foreground">
                Easy booking process with the ability to manage your reservations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Simple Discovery</h3>
              <p className="text-muted-foreground">
                Find the perfect hotel for your needs with our intuitive search system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Hotels Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Hotels</h2>
              <p className="text-muted-foreground">
                Discover our most booked destinations
              </p>
            </div>
            <Link to="/hotels" className="mt-4 md:mt-0">
              <Button variant="outline">
                View All Hotels
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularHotels.length > 0 ? (
                popularHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No hotels available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Create an account now to unlock the full experience and start booking your perfect stay.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="btn-hover-effect">
              Register Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
