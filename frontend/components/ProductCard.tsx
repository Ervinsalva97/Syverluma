import React from "react";

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden flex items-center justify-center p-6">
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="px-2.5 py-1 text-xs font-bold tracking-wider uppercase bg-blue-600 text-white rounded-md shadow-md">
                Nuevo
              </span>
            )}
            {product.isSale && (
              <span className="px-2.5 py-1 text-xs font-bold tracking-wider uppercase bg-emerald-600 text-white rounded-md shadow-md">
                Oferta
              </span>
            )}
          </div>

          {/* Placeholder/Icon Image */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-12 h-12 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-5 space-y-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
            <span className="ml-1 text-slate-500 font-sans">({product.rating})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl font-extrabold text-white">
              S/ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm font-medium text-slate-500 line-through">
                S/ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0">
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}
