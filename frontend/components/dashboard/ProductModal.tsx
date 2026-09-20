'use client';

import React, { useState, useEffect } from 'react';
import { ProductItem } from './ProductTable';

interface ProductModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: ProductItem | null;
  onClose: () => void;
  onSubmit: (formData: Partial<ProductItem>) => Promise<void>;
}

export default function ProductModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [emprendimiento, setEmprendimiento] = useState('Syverluma Central');
  const [precio, setPrecio] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setNombre(initialData.title || initialData.nombre || '');
        setCategoria(initialData.category || initialData.categoria || 'General');
        setEmprendimiento(initialData.emprendimiento || 'Syverluma Central');
        setPrecio(initialData.price ?? initialData.precio ?? 0);
        setStock(initialData.stock ?? 0);
        setDescripcion(initialData.description || initialData.descripcion || '');
      } else {
        setNombre('');
        setCategoria('General');
        setEmprendimiento('Syverluma Central');
        setPrecio('');
        setStock('');
        setDescripcion('');
      }
      setError(null);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }

    const numPrecio = Number(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        title: nombre.trim(),
        categoria: categoria.trim() || 'General',
        category: categoria.trim() || 'General',
        emprendimiento: emprendimiento.trim() || 'Syverluma Central',
        precio: numPrecio,
        price: numPrecio,
        stock: Math.floor(numStock),
        descripcion: descripcion.trim(),
        description: descripcion.trim(),
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar el producto.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {mode === 'create' ? 'Registrar Nuevo Producto' : 'Editar Información de Producto'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sincronización directa con Cloud Firestore
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Licencia Matriz Syverluma Pro"
              className="w-full px-4 py-2.5 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Emprendimiento o Tienda Asociada
            </label>
            <select
              value={emprendimiento}
              onChange={(e) => setEmprendimiento(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-800/90 text-slate-100 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="Syverluma Central">Syverluma Central (Matriz)</option>
              <option value="eDark Store">eDark Store (Hardware & Tecnología)</option>
              <option value="Syverluma Gifts">Syverluma Gifts (Personalizados)</option>
              <option value="Servicios TI">Servicios & Consultoría TI</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Categoría
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej: Software / Hardware / Servicios"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Precio Unitario (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 text-sm font-mono bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Cantidad en Stock
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Descripción o Especificaciones
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles adicionales del producto o servicio..."
              className="w-full px-4 py-2 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-600 to-emerald-400 hover:from-blue-500 hover:to-emerald-300 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {mode === 'create' ? 'Guardar Producto' : 'Actualizar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
