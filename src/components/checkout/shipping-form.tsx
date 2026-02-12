'use client';

import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { Truck } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Shipping info header */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-1">
          Shipping Details
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Where should we send your rental?</p>
      </div>

      {/* Name fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
          className="rounded-none"
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
          className="rounded-none"
        />
      </div>

      {/* Contact fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          className="rounded-none"
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
          className="rounded-none"
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
        className="rounded-none"
      />

      {/* City, State, Postcode */}
      <div className="grid md:grid-cols-3 gap-6">
        <Input
          label="Suburb"
          name="suburb"
          value={formData.suburb}
          onChange={handleChange}
          error={errors.suburb}
          required
          className="rounded-none"
        />
        <Select
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
          required
          options={AUSTRALIAN_STATES}
          className="rounded-none"
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
          className="rounded-none"
        />
      </div>

      {/* Delivery notes */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wide text-black mb-2">
          Delivery Notes (Optional)
        </label>
        <textarea
          name="deliveryNotes"
          rows={3}
          placeholder="Any special delivery instructions?"
          value={formData.deliveryNotes}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors resize-none text-sm bg-white"
        />
      </div>

      {/* Free shipping notice */}
      <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-100">
        <Truck className="w-5 h-5 text-black" />
        <div>
          <p className="text-[10px] font-bold text-black uppercase tracking-widest">Free Express Shipping</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
            Australia-wide delivery & returns included.
          </p>
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" size="lg" className="w-full uppercase tracking-widest font-bold text-xs py-4" loading={isLoading}>
        Continue to Payment
      </Button>
    </form>
  );
}
