'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

interface PaymentFormProps {
  subtotal: number;
  bondTotal: number;
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PaymentForm({
  subtotal,
  bondTotal,
  onSubmit,
  onBack,
  isLoading,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    return limited.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name as keyof PaymentData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof PaymentData, string>> = {};

    const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber || cleanedCardNumber.length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    if (!formData.cardholderName) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900">
            Payment Details
          </h2>
          <p className="text-sm text-gray-500">Complete your rental booking</p>
        </div>
      </div>

      {/* Bond notice */}
      <div className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Security Bond: ${bondTotal}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            This amount will be <strong>pre-authorized but not charged</strong>.
            It will be automatically released within 3-5 business days after we
            receive and inspect your return.
          </p>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-4">
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={formData.cardNumber}
          onChange={handleChange}
          error={errors.cardNumber}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            error={errors.expiryDate}
            required
          />
          <Input
            label="CVC"
            name="cvc"
            placeholder="123"
            value={formData.cvc}
            onChange={handleChange}
            error={errors.cvc}
            required
          />
        </div>

        <Input
          label="Cardholder Name"
          name="cardholderName"
          placeholder="Name on card"
          value={formData.cardholderName}
          onChange={handleChange}
          error={errors.cardholderName}
          required
        />
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rental subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">FREE</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Security bond (pre-auth)</span>
          <span>${bondTotal}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total to charge</span>
            <span className="font-bold text-teal-600 text-lg">${subtotal}</span>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" size="lg" className="flex-1" loading={isLoading}>
          Pay ${subtotal}
        </Button>
      </div>

      {/* Test mode notice */}
      <p className="text-center text-xs text-gray-400">
        Demo mode: Use card number 4242 4242 4242 4242 for testing
      </p>
    </form>
  );
}
