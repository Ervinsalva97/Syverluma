"use client";

import React, { useState } from "react";
import ProductCard, { Product } from "./ProductCard";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Caja de Regalo Personalizada Syverluma",
    category: "Regalos",
    price: 89.90,
    originalPrice: 110.00,
    isNew: true,
    isSale: true,
    rating: 5,
    imageUrl: "",
  },
  {
    id: "2",
    title: "Lámpara LED Cyberpunk Neon",
    category: "Hogar",
    price: 129.00,
    isNew: true,
    rating: 4.8,
    imageUrl: "",
  },
  {
    id: "3",
    title: "Set de Tazas Grabadas Personalizadas",
    category: "Regalos",
    price: 49.90,
    originalPrice: 65.00,
    isSale: true,
    rating: 4.5,
    imageUrl: "",
  },
  {
    id: "4",
    title: "Soporte de Escritorio de Aluminio",
    category: "Tecnología",
    price: 75.00,
    rating: 4.7,
    imageUrl: "",
  },
  {
    id: "5",
    title: "Teclado Mecánico RGB Custom",
    category: "Tecnología",
    price: 249.90,
    originalPrice: 299.00,
    isNew: true,
    isSale: true,
    rating: 4.9,
    imageUrl: "",
  },
  {
    id: "6",
    title: "Mousepad XL Control Syverluma",
    category: "Tecnología",
    price: 39.90,
    rating: 4.6,
    imageUrl: "",
  },
];

interface ProductGridProps {
  selectedCategory?: string;
}

export default function ProductGrid({ selectedCategory = "Todos" }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs font-medium text-slate-400 whitespace-nowrap">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            <option value="default">Destacados</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Valorados</option>
          </select>
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-base">No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
