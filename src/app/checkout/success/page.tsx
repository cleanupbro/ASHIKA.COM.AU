'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  Home,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui';

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
      <div className="min-h-screen bg-white py-24">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-black mx-auto mb-6 stroke-1" />
            <h1 className="text-3xl font-black uppercase tracking-widest text-black mb-4">
              Order Confirmed
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-12">
              Thank you for your order. A confirmation email has been sent.
            </p>
            <Link href="/">
              <Button variant="primary" className="min-w-[200px]">
                RETURN HOME
              </Button>
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
    <div className="min-h-screen bg-white">
      {/* Success header */}
      <div className="bg-white border-b border-gray-100 py-16">
        <Container>
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-black mx-auto mb-6 stroke-1" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black mb-4">
              Thank You
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Order #{order.orderNumber}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* What's next */}
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-8 border-b border-black pb-2 inline-block">
                  What Happens Next
                </h2>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-black border border-black w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-black mb-1">Preparation</h3>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wide">
                        Your items are being professionally cleaned and prepared.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-black border border-black w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-black mb-1">Shipping</h3>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wide">
                        Order ships on <strong>{format(shipDate, 'MMM d')}</strong> via Express Post.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-black border border-black w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-black mb-1">Returns</h3>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wide">
                        Use the prepaid label to return. No cleaning required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 p-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-6">
                  Summary
                </h2>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-4 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-black">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Size {item.size} · {format(new Date(item.eventDate), 'MMM d')}</p>
                      </div>
                      <span className="text-xs font-bold text-black">${item.product.rental_price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-xs uppercase tracking-wide">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-black">${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-wide">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold text-black">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-widest text-black">Total</span>
                    <span className="text-xl font-black text-black">${order.subtotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
               <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4">
                  Delivery Address
                </h2>
                <address className="not-italic text-xs uppercase tracking-widest text-gray-500 leading-loose">
                  <p className="font-bold text-black">
                    {order.shipping.firstName} {order.shipping.lastName}
                  </p>
                  <p>{order.shipping.address}</p>
                  <p>
                    {order.shipping.suburb}, {order.shipping.state}{' '}
                    {order.shipping.postcode}
                  </p>
                </address>
              </div>
              <div className="flex flex-col justify-end">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">
                  A confirmation email has been sent to {order.shipping.email}. Please check your inbox for full details.
                </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full uppercase tracking-widest font-bold text-[10px]">
                      HOME
                    </Button>
                  </Link>
                  <Link href="/shop" className="flex-1">
                    <Button variant="primary" className="w-full uppercase tracking-widest font-bold text-[10px]">
                      CONTINUE SHOPPING
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
