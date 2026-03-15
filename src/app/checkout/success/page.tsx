'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import {
  CheckCircle,
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
          <div className="max-w-xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-brand-black mx-auto mb-8 stroke-[1.5]" />
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-brand-black mb-6">
              Order Confirmed
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-12">
              Thank you for your order. A confirmation email has been sent.
            </p>
            <Link href="/">
              <Button className="min-w-[240px] h-14 text-sm font-bold tracking-[0.2em]">
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
      <div className="bg-brand-black py-20 md:py-24">
        <Container>
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-8 stroke-[1.5]" />
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6">
              Thank You
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
              ORDER #{order.orderNumber}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-24 md:py-32">
          <div className="max-w-5xl mx-auto space-y-20">
            {/* What's next */}
            <div className="grid md:grid-cols-2 gap-24">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-black mb-12 border-b-2 border-brand-gold pb-3 inline-block">
                  What Happens Next
                </h2>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <span className="text-xs font-black text-brand-gold border border-brand-gold/30 w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full">1</span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-2">Preparation</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                        Your items are being professionally cleaned and prepared.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <span className="text-xs font-black text-brand-gold border border-brand-gold/30 w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full">2</span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-2">Shipping</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                        Order ships on <strong>{format(shipDate, 'MMM d, yyyy')}</strong> via Express Post.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <span className="text-xs font-black text-brand-gold border border-brand-gold/30 w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full">3</span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-2">Returns</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                        Use the prepaid label to return. No cleaning required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-[#F8FBFA] p-10 border border-brand-black/5 shadow-sm">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-black mb-8">
                  Order Summary
                </h2>

                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-4 border-b border-brand-black/5 last:border-0">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-900">{item.product.name}</p>
                        <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest mt-1.5">SIZE {item.size} · {format(new Date(item.eventDate), 'MMM d')}</p>
                      </div>
                      <span className="text-[11px] font-black text-brand-black">${item.product.rental_price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-brand-black/5 space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-gray-400">Rental Subtotal</span>
                    <span className="text-gray-900">${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-brand-black">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-6 border-t border-brand-black/5">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Total</span>
                    <span className="text-2xl font-black text-brand-black">${order.subtotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery */}
            <div className="grid md:grid-cols-2 gap-24 pt-12 border-t border-brand-black/5">
               <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-black mb-6">
                  Delivery Address
                </h2>
                <address className="not-italic text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 leading-loose">
                  <p className="font-black text-gray-900 mb-2">
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
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                  A confirmation email has been sent to {order.shipping.email}. <br />
                  Please check your inbox for full details.
                </p>
                 <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full h-14 text-xs font-bold tracking-[0.2em]">
                      HOME
                    </Button>
                  </Link>
                  <Link href="/shop" className="flex-1">
                    <Button className="w-full h-14 text-xs font-bold tracking-[0.2em]">
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
