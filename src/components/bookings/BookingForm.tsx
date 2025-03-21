
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Hotel } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { createBooking } from '@/utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  hotel: Hotel;
}

export default function BookingForm({ hotel }: BookingFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const today = new Date();
  const maxBookingDays = 3;
  
  const handleStartChange = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartOpen(false);
    
    // Reset end date if it's before the new start date
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(undefined);
    }
  };
  
  const handleEndChange = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndOpen(false);
  };
  
  const isDateValid = (date: Date) => {
    // Can't book in the past
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return false;
    }
    
    // If a start date is selected, end date must be after start date
    // and no more than 3 days after start date
    if (startDate) {
      return (
        isAfter(date, startDate) && 
        differenceInDays(date, startDate) <= maxBookingDays
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
  
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createBooking({
        hotel_id: hotel.id!,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      
      toast.success('Booking created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nightsCount = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  
  return (
    <div className="space-y-6 bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="text-xl font-semibold">Book Your Stay</h3>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Check-in</p>
          </div>
          <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
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
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                disabled={!startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndChange}
                disabled={(date) => {
                  if (!startDate) return true;
                  return !isDateValid(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {startDate && endDate && (
          <div className="rounded-md bg-muted p-4">
            <div className="font-medium">Booking Summary</div>
            <div className="text-sm text-muted-foreground mt-1">
              {nightsCount} night{nightsCount !== 1 ? 's' : ''} at {hotel.name}
            </div>
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-medium">{format(startDate, "EEE, MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Check-out:</span>
                <span className="font-medium">{format(endDate, "EEE, MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full"
          disabled={!startDate || !endDate || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </Button>
        
        {!startDate && (
          <p className="text-sm text-muted-foreground text-center">
            Select your check-in and check-out dates to book this hotel.
          </p>
        )}
        
        <p className="text-xs text-muted-foreground">
          Note: You can book up to 3 nights per stay.
        </p>
      </div>
    </div>
  );
}
