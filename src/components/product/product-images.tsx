'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImagesProps {
  images: string[];
  name: string;
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[700px] no-scrollbar flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'relative w-20 h-24 lg:w-20 lg:h-28 flex-shrink-0 transition-all border',
              index === currentIndex
                ? 'border-brand-black opacity-100'
                : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <Image
              src={image}
              alt={`${name} - View ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative aspect-[3/4] lg:h-[700px] lg:w-full bg-brand-offwhite flex-1 group">
        <Image
          src={images[currentIndex]}
          alt={`${name} - View ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 75vw"
          priority
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-brand-black hover:text-white text-brand-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-brand-black hover:text-white text-brand-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
