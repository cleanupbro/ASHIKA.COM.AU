'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import {
  ShippingForm,
  PaymentForm,
  OrderReview,
  type ShippingData,
  type PaymentData,
} from '@/components/checkout';
import { useCart } from '@/contexts/cart-context';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui';

type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, bondTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If cart is empty, redirect to shop
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-black uppercase tracking-widest text-black mb-4">
              Your bag is empty
            </h1>
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide">
              Add some items to your bag before checking out
            </p>
            <Link href="/shop">
              <Button variant="primary" className="min-w-[200px]">
                BROWSE COLLECTION
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSubmit = async (data: PaymentData) => {
    setIsLoading(true);

    // Simulate API call / payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a mock order number
    const orderNumber = `ASH-${Date.now().toString(36).toUpperCase()}`;

    // Store order info for confirmation page
    sessionStorage.setItem(
      'ashika_order',
      JSON.stringify({
        orderNumber,
        items: state.items,
        shipping: shippingData,
        subtotal,
        bondTotal,
        createdAt: new Date().toISOString(),
      })
    );

    // Clear cart
    clearCart();

    // Redirect to success page
    router.push('/checkout/success');
  };

  const handleBackToShipping = () => {
    setStep('shipping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-500 hover:text-brand-black transition-colors uppercase tracking-widest text-[10px] font-bold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Shop</span>
            </Link>
            <span className="font-sans text-xl tracking-[0.3em] font-black text-brand-black uppercase">
              ASHIKA
            </span>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </Container>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100">
        <Container>
          <div className="py-8">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Cart step */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-black text-white flex items-center justify-center text-[10px] rounded-full">
                  <Check className="w-3 h-3" />
                </div>
                <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-brand-black">
                  Bag
                </span>
              </div>

              <div className="w-12 h-px bg-brand-black" />

              {/* Shipping step */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded-full ${
                    step === 'shipping' || step === 'payment'
                      ? 'bg-brand-black text-white border-brand-black'
                      : 'bg-white text-gray-300 border-gray-200'
                  }`}
                >
                  {step === 'payment' ? <Check className="w-3 h-3" /> : '2'}
                </div>
                <span
                  className={`hidden md:block text-[10px] font-bold uppercase tracking-widest ${
                    step === 'shipping' || step === 'payment'
                      ? 'text-brand-black'
                      : 'text-gray-300'
                  }`}
                >
                  Shipping
                </span>
              </div>

              <div
                className={`w-12 h-px ${
                  step === 'payment' ? 'bg-brand-black' : 'bg-gray-200'
                }`}
              />

              {/* Payment step */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded-full ${
                    step === 'payment'
                      ? 'bg-brand-black text-white border-brand-black'
                      : 'bg-white text-gray-300 border-gray-200'
                  }`}
                >
                  3
                </div>
                <span
                  className={`hidden md:block text-[10px] font-bold uppercase tracking-widest ${
                    step === 'payment' ? 'text-brand-black' : 'text-gray-300'
                  }`}
                >
                  Payment
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <Container>
        <div className="py-12">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Form section */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                {step === 'shipping' && (
                  <ShippingForm onSubmit={handleShippingSubmit} />
                )}
                {step === 'payment' && shippingData && (
                  <PaymentForm
                    subtotal={subtotal}
                    bondTotal={bondTotal}
                    onSubmit={handlePaymentSubmit}
                    onBack={handleBackToShipping}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <OrderReview
                  items={state.items}
                  subtotal={subtotal}
                  bondTotal={bondTotal}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
