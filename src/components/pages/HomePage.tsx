
import React from 'react';
import Layout from '../layout/Layout';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Hotel } from '@/types';
import { useRouter } from '@/hooks/useRouter';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: () => api.hotels.getAll(),
  });

  return (
    <Layout>
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Hotel Booking</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find and book the perfect hotel for your next trip
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to load hotels. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading hotels...</p>
            ) : (
              hotels?.map((hotel) => (
                <div key={hotel.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {hotel.address.street}, {hotel.address.district}, {hotel.address.province} {hotel.address.postalcode}
                    </p>
                    <Button 
                      onClick={() => router.push(`/hotels/${hotel.id}`)}
                      className="w-full"
                    >
                      View Details <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
