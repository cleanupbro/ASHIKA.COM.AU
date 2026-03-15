'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Container } from "@/components/layout";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Hero() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/shop');
  };

  return (
    <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover object-center w-full h-full"
          poster="/hero_poster_cinematic.png"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        {/* Warm cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Hero Content Overlay */}
      <Container className="relative z-10 w-full h-full flex flex-col items-center justify-between pb-24 pt-48">
        {/* Apple Glassmorphic Search Bar */}
        <div className="w-full max-w-4xl mb-auto animate-fade-in-down">
          <div
            className="glassmorphic-search-bar group cursor-pointer"
            onClick={handleSearchClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          >
            {/* FROM date */}
            <div className="flex-1 flex items-center gap-3 px-5 py-3 border-r border-white/10">
              <CalendarIcon className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-white/40 uppercase">
                  Event Date
                </span>
                <span className="text-[12px] font-semibold text-white/90 tracking-wide">
                  Select your date
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="flex-1 flex items-center gap-3 px-5 py-3 border-r border-white/10">
              <CalendarIcon className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-white/40 uppercase">
                  Category
                </span>
                <span className="text-[12px] font-semibold text-white/90 tracking-wide">
                  All Collections
                </span>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearchClick}
              className="glassmorphic-search-btn group/btn"
            >
              <SearchIcon className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>BROWSE</span>
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
              <Button variant="primary" className="glassmorphic-cta-btn">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
