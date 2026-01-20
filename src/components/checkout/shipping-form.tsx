'use client';

import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { MapPin, Truck } from 'lucide-react';

// Australian states
const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  deliveryNotes?: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
  isLoading?: boolean;
}

export function ShippingForm({ onSubmit, isLoading }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    deliveryNotes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const validatePostcode = (postcode: string): boolean => {
    const num = parseInt(postcode, 10);
    return num >= 200 && num <= 9999 && postcode.length === 4;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof ShippingData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};

    // Validate required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Street address is required';
    if (!formData.suburb) newErrors.suburb = 'Suburb is required';
    if (!formData.state) newErrors.state = 'Please select a state';
    if (!formData.postcode) {
      newErrors.postcode = 'Postcode is required';
    } else if (!validatePostcode(formData.postcode)) {
      newErrors.postcode = 'Please enter a valid Australian postcode (e.g., 2000)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping info header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900">
            Shipping Details
          </h2>
          <p className="text-sm text-gray-500">Where should we send your rental?</p>
        </div>
      </div>

      {/* Name fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>

      {/* Contact fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+61 400 000 000"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />
      </div>

      {/* Address */}
      <Input
        label="Street Address"
        name="address"
        placeholder="123 Example Street"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        required
      />

      {/* City, State, Postcode */}
      <div className="grid md:grid-cols-3 gap-4">
        <Input
          label="Suburb"
          name="suburb"
          value={formData.suburb}
          onChange={handleChange}
          error={errors.suburb}
          required
        />
        <Select
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
          required
          options={AUSTRALIAN_STATES}
        />
        <Input
          label="Postcode"
          name="postcode"
          placeholder="2000"
          maxLength={4}
          value={formData.postcode}
          onChange={handleChange}
          error={errors.postcode}
          required
        />
      </div>

      {/* Delivery notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Delivery Notes (Optional)
        </label>
        <textarea
          name="deliveryNotes"
          rows={2}
          placeholder="Any special delivery instructions?"
          value={formData.deliveryNotes}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors resize-none"
        />
      </div>

      {/* Free shipping notice */}
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
        <Truck className="w-5 h-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">Free Express Shipping</p>
          <p className="text-xs text-green-600">
            Australia-wide delivery included. Return shipping is also free!
          </p>
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" size="lg" className="w-full" loading={isLoading}>
        Continue to Payment
      </Button>
    </form>
  );
}
