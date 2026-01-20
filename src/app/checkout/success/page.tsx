'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  Mail,
  Home,
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderData {
  orderNumber: string;
  items: Array<{
    product: { name: string; rental_price: number };
    size: string;
    eventDate: string;
    rentalTimeline: {
      shipBy: string;
      returnBy: string;
    };
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  subtotal: number;
  bondTotal: number;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('ashika_order');
    if (stored) {
      setOrder(JSON.parse(stored));
      // Clear the stored order after reading
      sessionStorage.removeItem('ashika_order');
    }
  }, []);

  // If no order data, show generic success
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Get first item for delivery info (assuming same delivery date for all)
  const firstItem = order.items[0];
  const shipDate = new Date(firstItem.rentalTimeline.shipBy);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success header */}
      <div className="bg-gradient-to-br from-teal-900 to-teal-800 text-white py-12">
        <Container>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Order Confirmed!
            </h1>
            <p className="text-teal-200">
              Order #{order.orderNumber}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Email confirmation */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 mb-1">
                    Confirmation sent to
                  </h2>
                  <p className="text-teal-600 font-medium">{order.shipping.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Check your email for order details and tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* What's next */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                What happens next?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">We prepare your order</h3>
                    <p className="text-sm text-gray-500">
                      Your items are professionally cleaned and prepared for shipping.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Express shipping</h3>
                    <p className="text-sm text-gray-500">
                      Your order ships on{' '}
                      <strong>{format(shipDate, 'EEEE, MMMM d')}</strong> via Australia Post Express.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Enjoy your event!</h3>
                    <p className="text-sm text-gray-500">
                      Look stunning on your special day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-600">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Easy returns</h3>
                    <p className="text-sm text-gray-500">
                      Use the prepaid return label to send items back. No cleaning needed!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Event: {format(new Date(item.eventDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <span className="font-medium">${item.product.rental_price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total charged</span>
                  <span className="text-teal-600">${order.subtotal}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Shipping To
              </h2>
              <address className="not-italic text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
                <p>{order.shipping.address}</p>
                <p>
                  {order.shipping.suburb}, {order.shipping.state}{' '}
                  {order.shipping.postcode}
                </p>
              </address>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
              <Link
                href="/shop"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
