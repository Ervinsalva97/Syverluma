"use client";

import React, { useState } from "react";

interface FilterSidebarProps {
  onCategoryChange?: (category: string) => void;
}

export default function FilterSidebar({ onCategoryChange }: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [expandedSection, setExpandedSection] = useState<string>("categories");

  const categories = [
    { id: "Todos", name: "Todos los productos", count: 12 },
    { id: "Regalos", name: "Regalos Personalizados", count: 5 },
    { id: "Tecnología", name: "Accesorios Tecnológicos", count: 4 },
    { id: "Hogar", name: "Detalles para el Hogar", count: 3 },
  ];

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
  };

  const toggleAccordion = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <aside className="sticky top-20 space-y-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
      {/* Active Filters Summary Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros Aplicados
          </h2>
          {selectedCategory !== "Todos" && (
            <button
              onClick={() => handleCategorySelect("Todos")}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Selected Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800/60">
            Categoría: {selectedCategory}
          </span>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Accordion 1: Categorías */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleAccordion("categories")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-200 hover:bg-slate-800/40 transition"
        >
          <span>Categorías</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === "categories" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === "categories" && (
          <div className="p-4 pt-0 space-y-2 border-t border-slate-800/60">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm transition ${
                  selectedCategory === cat.id
                    ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 2: Rango de Precio */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleAccordion("price")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-200 hover:bg-slate-800/40 transition"
        >
          <span>Rango de Precio</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === "price" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === "price" && (
          <div className="p-4 pt-0 space-y-3 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Máx"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-full py-1.5 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/40 transition">
              Aplicar Rango
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
