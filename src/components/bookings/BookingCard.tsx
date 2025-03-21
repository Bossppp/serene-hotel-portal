
import { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import { Calendar, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteBooking } from '@/utils/api';
import { toast } from 'sonner';

interface BookingCardProps {
  booking: Booking;
  onDelete: () => void;
  hideActions?: boolean;
}

export default function BookingCard({ booking, onDelete, hideActions = false }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const daysUntilStay = Math.max(0, Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  
  const formattedStartDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBooking(booking.id!);
      onDelete();
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{booking.hotel.name}</CardTitle>
            <CardDescription className="mt-1">
              Booked {formatDistance(new Date(booking.createdAt), new Date(), { addSuffix: true })}
            </CardDescription>
          </div>
          
          {daysUntilStay > 0 ? (
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              In {daysUntilStay} days
            </div>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              Active
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Check-in:</span>{' '}
              <span className="font-medium">{formattedStartDate}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Check-out:</span>{' '}
              <span className="font-medium">{formattedEndDate}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Hotel className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Location:</span>{' '}
              <span className="font-medium">
                {booking.hotel.address.district}, {booking.hotel.address.province}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {!hideActions && (
        <CardFooter className="flex justify-between pt-3">
          <Link to={`/bookings/${booking.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently cancel your booking at {booking.hotel.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Yes, cancel booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
