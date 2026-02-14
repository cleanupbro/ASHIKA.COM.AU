// ==========================================
// ASHIKA — Product Availability Logic
// ==========================================
// Checks product availability against existing bookings.
// Works with both Supabase (production) and mock data (development).

import { createClient } from '@/lib/supabase/client';
import { calculateBlockPeriod, validateEventDate, doDateRangesOverlap, getDatesInRange } from './dates';
import { startOfDay, addDays, format } from 'date-fns';
import type { InventoryBlock } from '@/lib/supabase/types';

// ----- Types -----

export interface AvailabilityResult {
  /** Whether the product is available for the requested dates */
  available: boolean;
  /** Reason if not available */
  reason?: string;
  /** Conflicting booking info (if any) */
  conflict?: {
    blockStart: string;
    blockEnd: string;
    reason: string;
  };
}

export interface BlockedDateRange {
  start: Date;
  end: Date;
  reason: 'rental' | 'cleaning' | 'maintenance' | 'reserved';
}

export interface AvailabilityCalendar {
  /** Map of date string (YYYY-MM-DD) to availability status */
  dates: Record<string, {
    available: boolean;
    reason?: string;
  }>;
  /** Start of the calendar range */
  rangeStart: Date;
  /** End of the calendar range */
  rangeEnd: Date;
}

// ----- Core Availability Check -----

/**
 * Check if a product is available for a specific event date.
 * This is the main availability function used throughout the app.
 *
 * @param productId - The product UUID
 * @param eventDate - The customer's event date
 * @returns Availability result with reason if unavailable
 */
export async function checkAvailability(
  productId: string,
  eventDate: Date | string
): Promise<AvailabilityResult> {
  // First validate the event date itself
  const dateValidation = validateEventDate(eventDate);
  if (!dateValidation.isValid) {
    return {
      available: false,
      reason: dateValidation.error,
    };
  }

  // Calculate the full block period for this booking
  const { blockStart, blockEnd } = calculateBlockPeriod(eventDate);

  try {
    const supabase = createClient();

    // Query for any overlapping blocks
    // Using the database function for reliable overlap detection
    const { data: conflicts, error } = await supabase
      .from('inventory_blocks')
      .select('id, block_start, block_end, reason')
      .eq('product_id', productId)
      .lte('block_start', format(blockEnd, 'yyyy-MM-dd'))
      .gte('block_end', format(blockStart, 'yyyy-MM-dd'))
      .returns<InventoryBlock[]>();

    if (error) {
      console.error('[Availability] Database error:', error);
      // Fail open for better UX, but log the error
      return {
        available: true,
        reason: 'Could not verify availability. Please try again.',
      };
    }

    // No conflicts = available
    if (!conflicts || conflicts.length === 0) {
      return { available: true };
    }

    // Return the first conflict
    const conflict = conflicts[0];
    return {
      available: false,
      reason: 'This item is already booked for your selected dates.',
      conflict: {
        blockStart: conflict.block_start,
        blockEnd: conflict.block_end,
        reason: conflict.reason,
      },
    };
  } catch (error) {
    console.error('[Availability] Unexpected error:', error);
    return {
      available: true,
      reason: 'Could not verify availability. Please try again.',
    };
  }
}

/**
 * Check availability using the database function.
 * This uses the PostgreSQL function we created in migrations.
 *
 * @param productId - The product UUID
 * @param startDate - Start of the period to check
 * @param endDate - End of the period to check
 * @returns Boolean availability from database
 */
export async function checkAvailabilityRpc(
  productId: string,
  startDate: Date | string,
  endDate: Date | string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('check_product_availability', {
      p_product_id: productId,
      p_start_date: typeof startDate === 'string' ? startDate : format(startDate, 'yyyy-MM-dd'),
      p_end_date: typeof endDate === 'string' ? endDate : format(endDate, 'yyyy-MM-dd'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (error) {
      console.error('[Availability] RPC error:', error);
      return true; // Fail open
    }

    return data as boolean;
  } catch (error) {
    console.error('[Availability] RPC unexpected error:', error);
    return true; // Fail open
  }
}

// ----- Blocked Dates Retrieval -----

/**
 * Get all blocked date ranges for a product.
 * Used to display unavailable dates in calendars.
 *
 * @param productId - The product UUID
 * @param monthsAhead - How many months ahead to fetch (default: 6)
 * @returns Array of blocked date ranges
 */
export async function getBlockedDates(
  productId: string,
  monthsAhead: number = 6
): Promise<BlockedDateRange[]> {
  try {
    const supabase = createClient();

    const today = startOfDay(new Date());
    const futureLimit = addDays(today, monthsAhead * 30);

    const { data, error } = await supabase
      .from('inventory_blocks')
      .select('block_start, block_end, reason')
      .eq('product_id', productId)
      .gte('block_end', format(today, 'yyyy-MM-dd'))
      .lte('block_start', format(futureLimit, 'yyyy-MM-dd'))
      .order('block_start', { ascending: true });

    if (error) {
      console.error('[Availability] Error fetching blocked dates:', error);
      return [];
    }

    return (data || []).map((block: { block_start: string; block_end: string; reason: string }) => ({
      start: new Date(block.block_start),
      end: new Date(block.block_end),
      reason: block.reason as BlockedDateRange['reason'],
    }));
  } catch (error) {
    console.error('[Availability] Unexpected error fetching blocked dates:', error);
    return [];
  }
}

/**
 * Generate a calendar view of availability for a product.
 * Returns a map of dates to their availability status.
 *
 * @param productId - The product UUID
 * @param startDate - Start of calendar range
 * @param endDate - End of calendar range
 * @returns Calendar with date-to-availability mapping
 */
export async function getAvailabilityCalendar(
  productId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityCalendar> {
  const blockedRanges = await getBlockedDates(productId);

  const dates: AvailabilityCalendar['dates'] = {};
  const allDates = getDatesInRange(startDate, endDate);

  for (const date of allDates) {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Check if this date falls within any blocked range
    const blockingRange = blockedRanges.find((range) =>
      doDateRangesOverlap(
        { start: date, end: date },
        { start: range.start, end: range.end }
      )
    );

    if (blockingRange) {
      dates[dateStr] = {
        available: false,
        reason: getBlockReasonLabel(blockingRange.reason),
      };
    } else {
      // Also check date validation (past dates, too soon, too far)
      const validation = validateEventDate(date);
      if (!validation.isValid) {
        dates[dateStr] = {
          available: false,
          reason: validation.error,
        };
      } else {
        dates[dateStr] = { available: true };
      }
    }
  }

  return {
    dates,
    rangeStart: startDate,
    rangeEnd: endDate,
  };
}

// ----- Batch Availability -----

/**
 * Check availability for multiple products at once.
 * Useful for listing pages to show available items.
 *
 * @param productIds - Array of product UUIDs
 * @param eventDate - The event date to check
 * @returns Map of product ID to availability
 */
export async function checkBatchAvailability(
  productIds: string[],
  eventDate: Date | string
): Promise<Record<string, boolean>> {
  // Validate date first
  const dateValidation = validateEventDate(eventDate);
  if (!dateValidation.isValid) {
    // All products unavailable for invalid dates
    return productIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
  }

  const { blockStart, blockEnd } = calculateBlockPeriod(eventDate);

  try {
    const supabase = createClient();

    // Get all blocks for these products in the date range
    const { data: blocks, error } = await supabase
      .from('inventory_blocks')
      .select('product_id')
      .in('product_id', productIds)
      .lte('block_start', format(blockEnd, 'yyyy-MM-dd'))
      .gte('block_end', format(blockStart, 'yyyy-MM-dd'));

    if (error) {
      console.error('[Availability] Batch check error:', error);
      // Fail open - mark all as available
      return productIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    }

    // Build set of unavailable product IDs
    const unavailableIds = new Set((blocks || []).map((b: { product_id: string }) => b.product_id));

    // Return availability map
    return productIds.reduce((acc, id) => ({
      ...acc,
      [id]: !unavailableIds.has(id),
    }), {});
  } catch (error) {
    console.error('[Availability] Batch check unexpected error:', error);
    return productIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
  }
}

// ----- Helper Functions -----

/**
 * Get a human-readable label for a block reason.
 */
function getBlockReasonLabel(reason: BlockedDateRange['reason']): string {
  const labels: Record<BlockedDateRange['reason'], string> = {
    rental: 'Already booked',
    cleaning: 'Being cleaned',
    maintenance: 'Under maintenance',
    reserved: 'Reserved',
  };
  return labels[reason] || 'Unavailable';
}

/**
 * Get the next available date for a product.
 * Useful for suggesting alternative dates.
 *
 * @param productId - The product UUID
 * @param preferredDate - The date the customer originally wanted
 * @returns Next available date, or null if none in range
 */
export async function getNextAvailableDate(
  productId: string,
  preferredDate: Date | string
): Promise<Date | null> {
  const blockedRanges = await getBlockedDates(productId);
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 180); // 6 months ahead

  let checkDate = startOfDay(
    typeof preferredDate === 'string' ? new Date(preferredDate) : preferredDate
  );

  // Ensure we start from today at minimum
  if (checkDate < today) {
    checkDate = today;
  }

  while (checkDate <= maxDate) {
    // Validate the date
    const validation = validateEventDate(checkDate);
    if (!validation.isValid) {
      checkDate = addDays(checkDate, 1);
      continue;
    }

    // Check if blocked
    const { blockStart, blockEnd } = calculateBlockPeriod(checkDate);
    const hasConflict = blockedRanges.some((range) =>
      doDateRangesOverlap(
        { start: blockStart, end: blockEnd },
        { start: range.start, end: range.end }
      )
    );

    if (!hasConflict) {
      return checkDate;
    }

    checkDate = addDays(checkDate, 1);
  }

  return null; // No available date found in range
}
