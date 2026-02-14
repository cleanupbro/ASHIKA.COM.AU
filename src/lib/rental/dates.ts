// ==========================================
// ASHIKA — Booking Dates Calculation
// ==========================================
// All date calculations for the rental lifecycle.
// This module is the source of truth for date logic.

import {
  addDays,
  subDays,
  isBefore,
  isAfter,
  isEqual,
  startOfDay,
  differenceInDays,
  parseISO,
  format,
} from 'date-fns';
import { RENTAL_CONFIG } from '@/lib/constants/rental';

// ----- Types -----

export interface BookingDates {
  /** When item ships (event - delivery buffer) */
  rentalStart: Date;
  /** The customer's event date */
  eventDate: Date;
  /** When customer must return item (event + return buffer) */
  rentalEnd: Date;
  /** When item is available again (after cleaning) */
  cleaningEnd: Date;
  /** Human-readable summary */
  summary: {
    shipDate: string;
    returnBy: string;
    availableAgain: string;
  };
}

export interface DateValidation {
  isValid: boolean;
  error?: string;
}

// ----- Core Calculations -----

/**
 * Calculate all booking dates from an event date.
 *
 * Timeline:
 * [rental_start] ---3 days---> [event_date] ---4 days---> [rental_end] ---3 days---> [cleaning_end]
 *
 * @param eventDate - The customer's event date
 * @returns All calculated dates for the booking
 */
export function calculateBookingDates(eventDate: Date | string): BookingDates {
  // Normalize to Date object at start of day
  const event = normalizeDate(eventDate);

  // Calculate dates based on rental config
  const rentalStart = subDays(event, RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const rentalEnd = addDays(event, RENTAL_CONFIG.RENTAL_PERIOD_DAYS - RENTAL_CONFIG.DELIVERY_BUFFER_DAYS);
  const cleaningEnd = addDays(rentalEnd, RENTAL_CONFIG.CLEANING_BUFFER_DAYS);

  return {
    rentalStart,
    eventDate: event,
    rentalEnd,
    cleaningEnd,
    summary: {
      shipDate: format(rentalStart, 'EEE, d MMM yyyy'),
      returnBy: format(rentalEnd, 'EEE, d MMM yyyy'),
      availableAgain: format(cleaningEnd, 'EEE, d MMM yyyy'),
    },
  };
}

/**
 * Calculate the total block period for a product (rental + cleaning).
 * Used for checking availability conflicts.
 *
 * @param eventDate - The customer's event date
 * @returns Start and end dates of the full blocking period
 */
export function calculateBlockPeriod(eventDate: Date | string): {
  blockStart: Date;
  blockEnd: Date;
} {
  const dates = calculateBookingDates(eventDate);
  return {
    blockStart: dates.rentalStart,
    blockEnd: dates.cleaningEnd,
  };
}

// ----- Validation -----

/**
 * Validate that an event date is bookable.
 * Checks:
 * - Not in the past
 * - Not too soon (minimum advance booking)
 * - Not too far out (maximum advance booking)
 *
 * @param eventDate - The date to validate
 * @returns Validation result with error message if invalid
 */
export function validateEventDate(eventDate: Date | string): DateValidation {
  const event = normalizeDate(eventDate);
  const today = startOfDay(new Date());

  // Check if date is in the past
  if (isBefore(event, today)) {
    return {
      isValid: false,
      error: 'Event date cannot be in the past.',
    };
  }

  // Check minimum advance booking
  const minBookingDate = addDays(today, RENTAL_CONFIG.MIN_ADVANCE_BOOKING_DAYS);
  if (isBefore(event, minBookingDate)) {
    return {
      isValid: false,
      error: `Please book at least ${RENTAL_CONFIG.MIN_ADVANCE_BOOKING_DAYS} days in advance to allow for shipping.`,
    };
  }

  // Check maximum advance booking
  const maxBookingDate = addDays(today, RENTAL_CONFIG.MAX_ADVANCE_BOOKING_DAYS);
  if (isAfter(event, maxBookingDate)) {
    return {
      isValid: false,
      error: `Bookings can only be made up to ${RENTAL_CONFIG.MAX_ADVANCE_BOOKING_DAYS} days in advance.`,
    };
  }

  return { isValid: true };
}

// ----- Date Range Helpers -----

/**
 * Check if two date ranges overlap.
 * Used for availability conflict detection.
 *
 * @param range1 - First date range [start, end]
 * @param range2 - Second date range [start, end]
 * @returns True if the ranges overlap
 */
export function doDateRangesOverlap(
  range1: { start: Date; end: Date },
  range2: { start: Date; end: Date }
): boolean {
  // Ranges overlap if: start1 <= end2 AND start2 <= end1
  return (
    (isBefore(range1.start, range2.end) || isEqual(range1.start, range2.end)) &&
    (isBefore(range2.start, range1.end) || isEqual(range2.start, range1.end))
  );
}

/**
 * Get all dates within a range (inclusive).
 * Useful for calendar blocking UI.
 *
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns Array of dates in the range
 */
export function getDatesInRange(
  startDate: Date | string,
  endDate: Date | string
): Date[] {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  const dates: Date[] = [];

  let current = start;
  while (isBefore(current, end) || isEqual(current, end)) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

/**
 * Calculate the number of days between two dates.
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days between dates (can be negative)
 */
export function daysBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  return differenceInDays(normalizeDate(endDate), normalizeDate(startDate));
}

// ----- Late Return Helpers -----

/**
 * Check if a return is late and calculate fees.
 *
 * @param rentalEnd - Expected return date
 * @param actualReturnDate - Actual return date
 * @returns Late status and any applicable fees
 */
export function calculateLateReturn(
  rentalEnd: Date | string,
  actualReturnDate: Date | string
): {
  isLate: boolean;
  daysLate: number;
  inGracePeriod: boolean;
  fee: number;
} {
  const expected = normalizeDate(rentalEnd);
  const actual = normalizeDate(actualReturnDate);

  const daysLate = Math.max(0, differenceInDays(actual, expected));
  const isLate = daysLate > 0;
  const inGracePeriod = daysLate > 0 && daysLate <= RENTAL_CONFIG.LATE_GRACE_DAYS;

  // Fee only applies after grace period
  const fee = daysLate > RENTAL_CONFIG.LATE_GRACE_DAYS ? RENTAL_CONFIG.LATE_FEE_AUD : 0;

  return {
    isLate,
    daysLate,
    inGracePeriod,
    fee,
  };
}

// ----- Formatting Helpers -----

/**
 * Format a date for display.
 *
 * @param date - Date to format
 * @param formatString - date-fns format string (default: 'd MMM yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'd MMM yyyy'
): string {
  return format(normalizeDate(date), formatString);
}

/**
 * Format a date range for display.
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted range string (e.g., "15 Jan - 22 Jan 2026")
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  // Same month and year
  if (format(start, 'MMM yyyy') === format(end, 'MMM yyyy')) {
    return `${format(start, 'd')} - ${format(end, 'd MMM yyyy')}`;
  }

  // Same year
  if (format(start, 'yyyy') === format(end, 'yyyy')) {
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
  }

  // Different years
  return `${format(start, 'd MMM yyyy')} - ${format(end, 'd MMM yyyy')}`;
}

// ----- Internal Helpers -----

/**
 * Normalize a date input to a Date object at start of day.
 */
function normalizeDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return startOfDay(parseISO(date));
  }
  return startOfDay(date);
}
