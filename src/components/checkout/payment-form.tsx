'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { Lock, AlertCircle } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Payment header */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-1">
          Payment Details
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Secure your rental booking</p>
      </div>

      {/* Bond notice */}
      <div className="flex gap-4 p-5 bg-gray-50 border border-gray-100">
        <AlertCircle className="w-5 h-5 text-black flex-shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-black uppercase tracking-widest">
            Security Bond: ${bondTotal}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1 leading-relaxed">
            Pre-authorized but not charged. Automatically released 3-5 days after return inspection.
          </p>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-6">
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="4242 4242 4242 4242"
          value={formData.cardNumber}
          onChange={handleChange}
          error={errors.cardNumber}
          required
          className="rounded-none"
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Expiry Date"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            error={errors.expiryDate}
            required
            className="rounded-none"
          />
          <Input
            label="CVC"
            name="cvc"
            placeholder="123"
            value={formData.cvc}
            onChange={handleChange}
            error={errors.cvc}
            required
            className="rounded-none"
          />
        </div>

        <Input
          label="Cardholder Name"
          name="cardholderName"
          placeholder="NAME ON CARD"
          value={formData.cardholderName}
          onChange={handleChange}
          error={errors.cardholderName}
          required
          className="rounded-none"
        />
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 p-6 space-y-3">
        <div className="flex justify-between text-xs uppercase tracking-wide">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-bold text-black">${subtotal}</span>
        </div>
        <div className="flex justify-between text-xs uppercase tracking-wide">
          <span className="text-gray-500">Shipping</span>
          <span className="font-bold text-black">FREE</span>
        </div>
        <div className="flex justify-between text-xs uppercase tracking-wide text-gray-400">
          <span>Security Bond (Hold)</span>
          <span>${bondTotal}</span>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold uppercase tracking-widest text-black">Total to charge</span>
            <span className="font-black text-black text-xl">${subtotal}</span>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
        <Lock className="w-3.5 h-3.5" />
        <span>Secured with 256-bit SSL encryption</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex-1 uppercase tracking-widest font-bold text-xs py-4"
        >
          Back
        </Button>
        <Button type="submit" size="lg" className="flex-1 uppercase tracking-widest font-bold text-xs py-4" loading={isLoading}>
          Pay ${subtotal}
        </Button>
      </div>

      {/* Test mode notice */}
      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Demo mode: Use card 4242 4242 4242 4242
      </p>
    </form>
  );
}
