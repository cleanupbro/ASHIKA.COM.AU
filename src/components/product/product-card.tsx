import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-brand-offwhite overflow-hidden mb-4 rounded-xl shadow-none border border-transparent group-hover:border-gray-100 transition-all duration-500">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Quick view on hover - Minimalist Style */}
        <div className="absolute inset-x-0 bottom-0 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black">
              Rent Now
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center px-2">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
          {product.category.replace("_", " ")}
        </p>
        <h3 className="text-[11px] font-black text-brand-black uppercase tracking-[0.1em] line-clamp-1 mb-2 group-hover:text-brand-tan transition-colors">
          {product.name}
        </h3>
        <div className="flex justify-center items-center gap-3">
          <span className="text-[12px] font-black text-brand-black">
            ${product.rental_price}
          </span>
          <span className="text-[10px] text-gray-400 line-through font-bold">
            ${product.retail_price}
          </span>
        </div>
      </div>
    </Link>
  );
}
