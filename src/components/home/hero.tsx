import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';

export function Hero() {
  return (
    <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <Image
          src="/hero_allborrow_clone_lehenga.png" // This will be the generated image path
          alt="SO WHY BUY WHEN YOU CAN BORROW?"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Hero Content Overlay */}
      <Container className="relative z-10 w-full h-full flex flex-col items-center justify-between pb-24 pt-48">
        {/* Top Search Bar (Simulated Date Picker from Screenshot) */}
        <div className="w-full max-w-lg mb-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-2.5 flex items-center gap-1 shadow-xl border border-white/20">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-gray-100">
              <span className="text-[10px] font-black tracking-widest text-gray-400">FROM</span>
              <span className="text-[11px] font-black text-brand-black">FEB 14</span>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-gray-100">
              <span className="text-[10px] font-black tracking-widest text-gray-400">TO</span>
              <span className="text-[11px] font-black text-brand-black">FEB 21</span>
            </div>
            <button className="bg-brand-tan px-8 py-2 md:py-3 rounded-md text-[11px] font-black tracking-widest text-brand-black hover:bg-opacity-90 transition-all">
              SEARCH
            </button>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-[0.2em] leading-tight drop-shadow-2xl hero-title">
            SO WHY BUY <br /> WHEN YOU CAN <br /> BORROW?
          </h1>
          <div className="flex justify-center">
            <Link href="/shop">
              <Button 
                variant="primary" 
                className="bg-white/80 backdrop-blur-sm text-brand-black border-none hover:bg-white px-10 py-4 text-[10px] font-black tracking-[0.2em] shadow-lg"
              >
                Get 10% Off!
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
