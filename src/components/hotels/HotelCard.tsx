
import { Hotel } from '@/types';
import { Button } from '@/components/ui/button';
import { useLazyImage } from '@/hooks/useLazyImage';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { imageSrc, imageLoaded } = useLazyImage(
    hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );
  
  return (
    <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="overflow-hidden aspect-[16/9]">
        <img
          src={imageSrc}
          alt={hotel.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            !imageLoaded ? 'lazy-image loading' : 'lazy-image'
          }`}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{hotel.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground ml-2 line-clamp-2">
              {hotel.address.building_number} {hotel.address.street}, {hotel.address.district}, {hotel.address.province}, {hotel.address.postal_code}
            </p>
          </div>
          
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground ml-2">{hotel.tel}</p>
          </div>
        </div>
        
        <Link to={`/hotels/${hotel.id}`}>
          <Button className="w-full btn-hover-effect">View Details</Button>
        </Link>
      </div>
    </div>
  );
}
