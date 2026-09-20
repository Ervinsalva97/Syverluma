"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-blue-500/20">
              S
            </div>
            <a href="#" className="font-extrabold text-xl tracking-tight text-white hover:opacity-90 transition">
              Syverluma <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-800/50">Regalos</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-200 hover:text-white transition">
              Inicio
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Nosotros
            </a>
            <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
              Tienda
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Contacto
            </a>
          </div>

          {/* Cart Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition shadow-inner"
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span>Carrito</span>
              <span className="ml-1 px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <a href="#" className="block py-2 text-base font-medium text-white">Inicio</a>
          <a href="#" className="block py-2 text-base font-medium text-slate-400">Nosotros</a>
          <a href="#" className="block py-2 text-base font-medium text-blue-400">Tienda</a>
          <a href="#" className="block py-2 text-base font-medium text-slate-400">Contacto</a>
        </div>
      )}
    </nav>
  );
}
