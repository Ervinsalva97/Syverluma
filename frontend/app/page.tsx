"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroHeader from "@/components/HeroHeader";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner Header */}
      <HeroHeader />

      {/* Main Content Catalog Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar onCategoryChange={(category) => setSelectedCategory(category)} />
          </aside>

          {/* Right Column: Main Product Grid */}
          <section className="lg:col-span-3">
            <ProductGrid selectedCategory={selectedCategory} />
          </section>
        </div>
      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
