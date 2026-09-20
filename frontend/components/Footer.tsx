import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-slate-950 font-bold flex items-center justify-center text-sm">
                S
              </div>
              <span className="font-extrabold text-lg text-white">Syverluma</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Matriz digital de comercio electrónico y distribución de regalos y productos exclusivos.
            </p>
          </div>

          {/* Enlaces de Tienda */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Tienda</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-400 transition">Todos los Productos</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Novedades</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Regalos Personalizados</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-400 transition">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Políticas de Envío</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contacto</a></li>
            </ul>
          </div>

          {/* Legales & Copyright */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-400 transition">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Syverluma EIRL. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
