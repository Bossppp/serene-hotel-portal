
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Booking } from '@/types';
import { getBooking, deleteBooking, updateBooking } from '@/utils/api';
import { ArrowLeft, Calendar, Hotel, User, Mail, Phone, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance, format, differenceInDays, addDays, isBefore, isAfter } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);
  const [newEndDate, setNewEndDate] = useState<Date | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) {
          setError('Booking ID is missing');
          setLoading(false);
          return;
        }
        
        const data = await getBooking(id);
        setBooking(data);
        setNewStartDate(new Date(data.start_date));
        setNewEndDate(new Date(data.end_date));
      } catch (error: any) {
        setError(error.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      if (!booking?.id) return;
      
      setIsDeleting(true);
      await deleteBooking(booking.id);
      
      toast.success('Booking cancelled successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleUpdate = async () => {
    try {
      if (!booking?.id || !newStartDate || !newEndDate) return;
      
      setIsUpdating(true);
      
      await updateBooking(booking.id, {
        start_date: newStartDate.toISOString(),
        end_date: newEndDate.toISOString(),
      });
      
      // Refresh booking data
      const updatedBooking = await getBooking(booking.id);
      setBooking(updatedBooking);
      
      toast.success('Booking updated successfully');
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const today = new Date();
  const maxBookingDays = 3;
  
  const isDateValid = (date: Date) => {
    // Can't book in the past
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return false;
    }
    
    // If a start date is selected, end date must be after start date
    // and no more than 3 days after start date
    if (newStartDate) {
      return (
        isAfter(date, newStartDate) && 
        differenceInDays(date, newStartDate) <= maxBookingDays
      );
    }
    
    return true;
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const startDate = booking ? new Date(booking.start_date) : null;
  const endDate = booking ? new Date(booking.end_date) : null;
  const createdAt = booking ? new Date(booking.createdAt) : null;
  const nightsCount = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const daysUntilStay = startDate ? Math.max(0, Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;
  
  const formattedStartDate = startDate ? format(startDate, 'EEE, MMM d, yyyy') : '-';
  const formattedEndDate = endDate ? format(endDate, 'EEE, MMM d, yyyy') : '-';
  const formattedCreatedAt = createdAt ? format(createdAt, 'MMM d, yyyy h:mm a') : '-';
  
  const isBookingActive = startDate && endDate ? 
    (new Date() >= startDate && new Date() <= endDate) : false;
  
  const isBookingUpcoming = startDate ? 
    new Date() < startDate : false;
  
  const isBookingPast = endDate ? 
    new Date() > endDate : false;
  
  const canModify = isBookingUpcoming;
  
  const handleStartChange = (date: Date | undefined) => {
    setNewStartDate(date);
    setIsStartOpen(false);
    
    // Reset end date if it's before the new start date
    if (date && newEndDate && isBefore(newEndDate, date)) {
      setNewEndDate(undefined);
    }
  };
  
  const handleEndChange = (date: Date | undefined) => {
    setNewEndDate(date);
    setIsEndOpen(false);
  };
  
  const isFormValid = newStartDate && newEndDate;
  const hasChanges = booking && (
    !isSameDay(newStartDate!, new Date(booking.start_date)) || 
    !isSameDay(newEndDate!, new Date(booking.end_date))
  );
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-16 bg-muted/30 animate-fade-in">
          <div className="container px-4 pt-8">
            <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            
            {loading ? (
              <div className="animate-pulse space-y-8">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 bg-muted rounded w-full" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">Error</h3>
                <p className="text-muted-foreground">{error}</p>
                <Link to="/dashboard" className="mt-4 inline-block">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            ) : booking ? (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold">Booking Details</h1>
                    <p className="text-muted-foreground mt-2">
                      Booking created {formatDistance(new Date(booking.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {isBookingActive && (
                    <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </div>
                  )}
                  
                  {isBookingUpcoming && (
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      Upcoming - In {daysUntilStay} days
                    </div>
                  )}
                  
                  {isBookingPast && (
                    <div className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6">Hotel Information</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Hotel className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="ml-3">
                            <h3 className="font-medium">{booking.hotel.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.hotel.address.building_number} {booking.hotel.address.street}, {booking.hotel.address.district}, {booking.hotel.address.province}, {booking.hotel.address.postal_code}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="ml-3">
                            <p className="text-sm">{booking.hotel.tel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6">Stay Details</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Check-in</p>
                              <p className="font-medium">{formattedStartDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Check-out</p>
                              <p className="font-medium">{formattedEndDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="font-medium">{nightsCount} night{nightsCount !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6">Guest Information</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Guest Name</p>
                              <p className="font-medium">{booking.user.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{booking.user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="ml-3">
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{booking.user.tel_number}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-6">Booking Information</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="ml-3">
                            <p className="text-sm text-muted-foreground">Booking Created</p>
                            <p className="font-medium">{formattedCreatedAt}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 space-y-6">
                    {canModify && (
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Update Your Stay</h2>
                        
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <div className="grid gap-1">
                              <p className="text-sm font-medium leading-none">Check-in</p>
                            </div>
                            <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newStartDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newStartDate ? format(newStartDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newStartDate}
                                  onSelect={handleStartChange}
                                  disabled={(date) => isBefore(date, today) && !isSameDay(date, today)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="grid gap-2">
                            <div className="grid gap-1">
                              <p className="text-sm font-medium leading-none">Check-out</p>
                            </div>
                            <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newEndDate && "text-muted-foreground"
                                  )}
                                  disabled={!newStartDate}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newEndDate ? format(newEndDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={newEndDate}
                                  onSelect={handleEndChange}
                                  disabled={(date) => {
                                    if (!newStartDate) return true;
                                    return !isDateValid(date);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          {newStartDate && newEndDate && (
                            <Alert>
                              <AlertTitle>Booking Updates</AlertTitle>
                              <AlertDescription>
                                Your stay will be for {differenceInDays(newEndDate, newStartDate)} nights from {format(newStartDate, "MMM d, yyyy")} to {format(newEndDate, "MMM d, yyyy")}.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Button 
                            className="w-full" 
                            disabled={!isFormValid || !hasChanges || isUpdating}
                            onClick={handleUpdate}
                          >
                            {isUpdating ? 'Updating...' : 'Update Booking'}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-card rounded-lg border shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-4">Actions</h2>
                      
                      <div className="space-y-4">
                        <Link to={`/hotels/${booking.hotel.id}`}>
                          <Button variant="outline" className="w-full justify-start">
                            <Hotel className="mr-2 h-4 w-4" />
                            View Hotel Details
                          </Button>
                        </Link>
                        
                        {canModify && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="w-full justify-start" disabled={isDeleting}>
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">Booking Not Found</h3>
                <p className="text-muted-foreground">
                  The booking you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/dashboard" className="mt-4 inline-block">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
