import React from "react";

export default function HeroHeader() {
  return (
    <header className="relative py-16 bg-slate-950 border-b border-blue-900/30 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 bg-blue-950/60 rounded-full border border-blue-800/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          CATÁLOGO EXCLUSIVO
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Tienda <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Syverluma</span>
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Explora y filtra nuestra selección de productos destacados y personalizados con la más alta calidad y envío garantizado.
        </p>
      </div>
    </header>
  );
}
