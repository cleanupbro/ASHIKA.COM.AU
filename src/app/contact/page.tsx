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
      <section className="bg-brand-teal py-20 md:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6">
              Contact Us
            </h1>
            <p className="text-[10px] md:text-xs text-brand-cream font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
              Our team is here to assist you with any inquiries. <br />
              Expect a response within 24 hours.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-3 gap-24">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-16">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-teal mb-10 border-b-2 border-brand-gold pb-3 inline-block">
                  Information
                </h2>

                <div className="space-y-12">
                  <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-[#F8FBFA] border border-brand-teal/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Mail className="w-6 h-6 text-brand-teal stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2">Email</h3>
                      <a href="mailto:info@ashika.com.au" className="text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:text-brand-teal transition-colors">
                        info@ashika.com.au
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-[#F8FBFA] border border-brand-teal/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Phone className="w-6 h-6 text-brand-teal stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2">Phone</h3>
                      <a href="tel:+61400000000" className="text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:text-brand-teal transition-colors">
                        +61 400 000 000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-[#F8FBFA] border border-brand-teal/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6 text-brand-teal stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2">Location</h3>
                      <p className="text-[13px] font-bold uppercase tracking-widest text-gray-900">Sydney, NSW, Australia</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-1.5">(By appointment only)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-[#F8FBFA] border border-brand-teal/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Clock className="w-6 h-6 text-brand-teal stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2">Hours</h3>
                      <p className="text-[13px] font-bold uppercase tracking-widest text-gray-900">Mon-Fri, 9am-6pm AEST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                {isSubmitted ? (
                  <div className="text-center py-24 border border-brand-teal/10 bg-[#F8FBFA] shadow-sm">
                    <CheckCircle className="w-16 h-16 text-brand-teal mx-auto mb-8 stroke-[1.5]" />
                    <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-teal mb-4">
                      Message Sent
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-12">
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="min-w-[240px] h-14 text-sm font-bold tracking-[0.2em]">
                      SEND ANOTHER
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-teal mb-12 border-b-2 border-brand-gold pb-3 inline-block">
                      Send us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-10">
                        <Input
                          label="Full Name"
                          name="name"
                          placeholder="ENTER YOUR NAME"
                          required
                          className="rounded-none border-gray-200 focus:border-brand-teal h-14 text-[10px] font-bold tracking-widest shadow-sm"
                        />
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="YOUR@EMAIL.COM"
                          required
                          className="rounded-none border-gray-200 focus:border-brand-teal h-14 text-[10px] font-bold tracking-widest shadow-sm"
                        />
                      </div>

                      <Input
                        label="Subject"
                        name="subject"
                        placeholder="WHAT IS THIS ABOUT?"
                        required
                        className="rounded-none border-gray-200 focus:border-brand-teal h-14 text-[10px] font-bold tracking-widest shadow-sm"
                      />

                      <Textarea
                        label="Message"
                        name="message"
                        placeholder="HOW CAN WE HELP YOU?"
                        rows={6}
                        required
                        className="rounded-none border-gray-200 focus:border-brand-teal text-[10px] font-bold tracking-widest shadow-sm"
                      />

                      <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[240px] h-14 text-sm font-bold tracking-[0.2em]" loading={isLoading}>
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
