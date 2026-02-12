'use client';

import { useState } from 'react';
import { Container } from '@/components/layout';
import { Button, Input, Textarea } from '@/components/ui';
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-black mb-4">
              Contact Us
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest max-w-2xl mx-auto">
              Our team is here to assist you with any inquiries.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-3 gap-24">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-16">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-8 border-b border-black pb-2 inline-block">
                  Information
                </h2>

                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 border border-black flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-black stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</h3>
                      <a href="mailto:info@ashika.com.au" className="text-sm font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors">
                        info@ashika.com.au
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 border border-black flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-black stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</h3>
                      <a href="tel:+61400000000" className="text-sm font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors">
                        +61 400 000 000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 border border-black flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-black stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Location</h3>
                      <p className="text-sm font-bold uppercase tracking-wide text-black">Sydney, NSW, Australia</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">(By appointment only)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 border border-black flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-black stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Hours</h3>
                      <p className="text-sm font-bold uppercase tracking-wide text-black">Mon-Fri, 9am-6pm AEST</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Within 24hr response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                {isSubmitted ? (
                  <div className="text-center py-24 border border-gray-100 bg-gray-50">
                    <CheckCircle className="w-16 h-16 text-black mx-auto mb-6 stroke-1" />
                    <h3 className="text-2xl font-black uppercase tracking-widest text-black mb-4">
                      Message Sent
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-12">
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="min-w-[200px]">
                      SEND ANOTHER
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-12 border-b border-black pb-2 inline-block">
                      Send us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <Input
                          label="Full Name"
                          name="name"
                          placeholder="ENTER YOUR NAME"
                          required
                          className="rounded-none"
                        />
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="YOUR@EMAIL.COM"
                          required
                          className="rounded-none"
                        />
                      </div>

                      <Input
                        label="Subject"
                        name="subject"
                        placeholder="WHAT IS THIS ABOUT?"
                        required
                        className="rounded-none"
                      />

                      <Textarea
                        label="Message"
                        name="message"
                        placeholder="HOW CAN WE HELP YOU?"
                        rows={6}
                        required
                        className="rounded-none"
                      />

                      <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px] uppercase tracking-widest font-bold text-xs py-4" loading={isLoading}>
                        SEND MESSAGE
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
