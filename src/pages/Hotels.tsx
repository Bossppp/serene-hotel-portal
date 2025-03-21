
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HotelCard from '@/components/hotels/HotelCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Hotel } from '@/types';
import { getHotels } from '@/utils/api';
import { Search } from 'lucide-react';

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHotels(hotels);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = hotels.filter(hotel => {
      return (
        hotel.name.toLowerCase().includes(searchTermLower) ||
        hotel.address.province.toLowerCase().includes(searchTermLower) ||
        hotel.address.district.toLowerCase().includes(searchTermLower)
      );
    });
    
    setFilteredHotels(filtered);
  }, [searchTerm, hotels]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 bg-muted/30 animate-fade-in">
        <div className="container px-4 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Explore Hotels</h1>
              <p className="text-muted-foreground mt-2">
                Find the perfect stay for your next trip
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hotels, locations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
              {searchTerm ? (
                <p className="text-muted-foreground">
                  No hotels match your search criteria. Try different keywords.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  There are no hotels available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
