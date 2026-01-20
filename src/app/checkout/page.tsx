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
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Check } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before checking out
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Collection
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Continue Shopping</span>
            </Link>
            <span className="font-display text-xl font-bold text-teal-900">
              ASHIKA
            </span>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </Container>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Cart step (completed) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="hidden md:block text-sm font-medium text-teal-600">
                  Cart
                </span>
              </div>

              <div className="w-8 md:w-16 h-0.5 bg-teal-600" />

              {/* Shipping step */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'shipping'
                      ? 'bg-teal-600 text-white'
                      : step === 'payment'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step === 'payment' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`hidden md:block text-sm font-medium ${
                    step === 'shipping' || step === 'payment'
                      ? 'text-teal-600'
                      : 'text-gray-500'
                  }`}
                >
                  Shipping
                </span>
              </div>

              <div
                className={`w-8 md:w-16 h-0.5 ${
                  step === 'payment' ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              />

              {/* Payment step */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'payment'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <span
                  className={`hidden md:block text-sm font-medium ${
                    step === 'payment' ? 'text-teal-600' : 'text-gray-500'
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
        <div className="py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
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
              <div className="sticky top-24">
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
