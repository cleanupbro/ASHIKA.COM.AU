import { addDays, subDays, isWithinInterval, isBefore, isAfter, startOfDay, isSameDay } from 'date-fns';
import { RENTAL_CONFIG } from '@/types';

// Mock inventory blocks - these would come from database in real app
export interface InventoryBlock {
  id: string;
  product_id: string;
  event_date: Date;
  block_start: Date;
  block_end: Date;
  booking_id?: string;
}

// Generate some mock blocked dates for products
const generateMockBlocks = (): InventoryBlock[] => {
  const blocks: InventoryBlock[] = [];
  const today = startOfDay(new Date());

  // Create some random bookings for different products
  const mockBookings = [
    { product_id: '1', eventDaysFromNow: 5 },
    { product_id: '1', eventDaysFromNow: 20 },
    { product_id: '2', eventDaysFromNow: 8 },
    { product_id: '3', eventDaysFromNow: 12 },
    { product_id: '4', eventDaysFromNow: 3 },
    { product_id: '5', eventDaysFromNow: 15 },
    { product_id: '6', eventDaysFromNow: 25 },
    { product_id: '7', eventDaysFromNow: 10 },
    { product_id: '8', eventDaysFromNow: 18 },
    { product_id: '10', eventDaysFromNow: 7 },
    { product_id: '12', eventDaysFromNow: 22 },
    { product_id: '15', eventDaysFromNow: 30 },
  ];

  mockBookings.forEach((booking, index) => {
    const eventDate = addDays(today, booking.eventDaysFromNow);
    const blockStart = subDays(eventDate, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
    const blockEnd = addDays(eventDate, RENTAL_CONFIG.RENTAL_PERIOD_DAYS - RENTAL_CONFIG.DELIVERY_BUFFER_DAYS + RENTAL_CONFIG.CLEANING_BUFFER_DAYS);

    blocks.push({
      id: `block-${index}`,
      product_id: booking.product_id,
      event_date: eventDate,
      block_start: blockStart,
      block_end: blockEnd,
      booking_id: `booking-${index}`,
    });
  });

  return blocks;
};

export const mockInventoryBlocks = generateMockBlocks();

/**
 * Calculate the full blocking period for an event date
 */
export function calculateBlockingPeriod(eventDate: Date) {
  const blockStart = subDays(eventDate, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const rentalEnd = addDays(eventDate, RENTAL_CONFIG.RENTAL_PERIOD_DAYS - RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const blockEnd = addDays(rentalEnd, RENTAL_CONFIG.CLEANING_BUFFER_DAYS);

  return {
    eventDate,
    blockStart,    // When we ship (3 days before)
    rentalEnd,     // When customer must return (3 days after event)
    blockEnd,      // When item is available again (after cleaning)
  };
}

/**
 * Check if a product is available for a specific event date
 */
export function isProductAvailable(
  productId: string,
  eventDate: Date,
  blocks: InventoryBlock[] = mockInventoryBlocks
): boolean {
  const today = startOfDay(new Date());
  const eventDay = startOfDay(eventDate);

  // Can't book past dates
  if (isBefore(eventDay, today)) {
    return false;
  }

  // Can't book less than 5 days from now (need shipping time)
  const minBookingDate = addDays(today, 5);
  if (isBefore(eventDay, minBookingDate)) {
    return false;
  }

  // Can't book more than 6 months out
  const maxBookingDate = addDays(today, 180);
  if (isAfter(eventDay, maxBookingDate)) {
    return false;
  }

  // Calculate the blocking period for the requested date
  const { blockStart, blockEnd } = calculateBlockingPeriod(eventDate);

  // Check for any overlapping blocks
  const productBlocks = blocks.filter(b => b.product_id === productId);

  for (const existingBlock of productBlocks) {
    // Check if the periods overlap
    const overlaps =
      (isWithinInterval(blockStart, { start: existingBlock.block_start, end: existingBlock.block_end }) ||
       isWithinInterval(blockEnd, { start: existingBlock.block_start, end: existingBlock.block_end }) ||
       isWithinInterval(existingBlock.block_start, { start: blockStart, end: blockEnd }) ||
       isWithinInterval(existingBlock.block_end, { start: blockStart, end: blockEnd }) ||
       isSameDay(blockStart, existingBlock.block_start) ||
       isSameDay(blockEnd, existingBlock.block_end));

    if (overlaps) {
      return false;
    }
  }

  return true;
}

/**
 * Get all blocked dates for a product within a date range
 */
export function getBlockedDates(
  productId: string,
  rangeStart: Date,
  rangeEnd: Date,
  blocks: InventoryBlock[] = mockInventoryBlocks
): Date[] {
  const blockedDates: Date[] = [];
  const today = startOfDay(new Date());
  const minBookingDate = addDays(today, 5);
  const maxBookingDate = addDays(today, 180);

  let currentDate = startOfDay(rangeStart);
  const endDate = startOfDay(rangeEnd);

  while (!isAfter(currentDate, endDate)) {
    // Check if date is bookable
    if (
      isBefore(currentDate, minBookingDate) ||
      isAfter(currentDate, maxBookingDate) ||
      !isProductAvailable(productId, currentDate, blocks)
    ) {
      blockedDates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return blockedDates;
}

/**
 * Format the rental timeline for display
 */
export function formatRentalTimeline(eventDate: Date) {
  const { blockStart, rentalEnd, blockEnd } = calculateBlockingPeriod(eventDate);

  return {
    shipBy: blockStart,
    eventDate: eventDate,
    returnBy: rentalEnd,
    availableAgain: blockEnd,
  };
}
