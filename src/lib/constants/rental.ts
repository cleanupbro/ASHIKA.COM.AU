// ==========================================
// ASHIKA — Rental Business Rules
// ==========================================
// These constants define the core rental logic.
// DO NOT change without business approval.

export const RENTAL_CONFIG = {
  // ----- Timing -----
  /** Total days the customer has the item */
  RENTAL_PERIOD_DAYS: 7,

  /** Days before event date we ship the item */
  DELIVERY_BUFFER_DAYS: 3,

  /** Days after return for cleaning/inspection before available again */
  CLEANING_BUFFER_DAYS: 3,

  /** Maximum days in advance a booking can be made */
  MAX_ADVANCE_BOOKING_DAYS: 180,

  /** Minimum days in advance (to allow shipping) */
  MIN_ADVANCE_BOOKING_DAYS: 5,

  // ----- Financials -----
  /** Refundable security deposit (AUD) */
  BOND_AMOUNT_AUD: 100,

  /** Late return penalty after grace period (AUD) */
  LATE_FEE_AUD: 50,

  /** Grace period before late fees apply (days) */
  LATE_GRACE_DAYS: 3,

  /** Shipping cost (free both ways) */
  SHIPPING_COST_AUD: 0,

  // ----- Damage Assessment -----
  /** Partial damage capture amount (AUD) */
  DAMAGE_FEE_PARTIAL_AUD: 50,

  /** Full capture for missing/destroyed items */
  DAMAGE_FEE_FULL_AUD: 100,
} as const;

export type RentalConfig = typeof RENTAL_CONFIG;

// ----- Booking Status Flow -----
export const BOOKING_STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['returned'],
  returned: ['inspecting'],
  inspecting: ['completed', 'disputed'],
  completed: [],
  disputed: ['completed'],
  cancelled: [],
} as const;

export type BookingStatus = keyof typeof BOOKING_STATUS_FLOW;

// ----- Bond Status -----
export const BOND_STATUS = {
  pending: 'Awaiting payment',
  held: 'Pre-authorized on card',
  released: 'Returned to customer',
  partial_capture: 'Partial amount charged',
  full_capture: 'Full bond charged',
} as const;

export type BondStatus = keyof typeof BOND_STATUS;

// ----- Product Categories -----
export const PRODUCT_CATEGORIES = [
  { value: 'saree', label: 'Sarees', icon: 'Shirt' },
  { value: 'lehenga', label: 'Lehengas', icon: 'Sparkles' },
  { value: 'salwar_kameez', label: 'Salwar Kameez', icon: 'Shirt' },
  { value: 'sherwani', label: 'Sherwanis', icon: 'Crown' },
  { value: 'kurta', label: 'Kurtas', icon: 'Shirt' },
  { value: 'kids', label: 'Kids Wear', icon: 'Baby' },
  { value: 'accessories', label: 'Accessories', icon: 'Gem' },
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]['value'];

// ----- Occasions -----
export const OCCASIONS = [
  'wedding',
  'reception',
  'sangeet',
  'mehendi',
  'haldi',
  'engagement',
  'festival',
  'party',
  'diwali',
  'navratri',
  'garba',
  'puja',
] as const;

export type Occasion = typeof OCCASIONS[number];

// ----- Size Charts -----
export const SIZE_CHART = {
  standard: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  saree: ['Free Size'],
  kids: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
} as const;

// ----- Australian States -----
export const AU_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'SA', name: 'South Australia' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'NT', name: 'Northern Territory' },
  { code: 'ACT', name: 'Australian Capital Territory' },
] as const;

// ----- Postcode Validation -----
export const AU_POSTCODE_REGEX = /^(0[2-9]\d{2}|[1-9]\d{3})$/;

export function isValidAustralianPostcode(postcode: string): boolean {
  return AU_POSTCODE_REGEX.test(postcode);
}
