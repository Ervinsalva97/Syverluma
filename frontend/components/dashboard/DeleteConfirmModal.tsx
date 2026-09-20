'use client';

import React, { useState } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productTitle: string;
  productId: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  productTitle,
  productId,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el producto.';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 space-y-5 text-slate-100">
        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 text-lg">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Confirmar Eliminación
            </h3>
            <p className="text-xs text-slate-400">
              Esta acción no se puede deshacer en Firestore.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm space-y-1">
          <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">
            Producto seleccionado:
          </span>
          <p className="font-semibold text-white">{productTitle}</p>
          <span className="font-mono text-xs text-slate-400 block">ID: {productId}</span>
        </div>

        <p className="text-xs text-slate-400">
          ¿Estás seguro de que deseas eliminar este documento de la colección &apos;productos&apos; de la matriz?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600/90 hover:bg-red-500 border border-red-500/50 rounded-xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {deleting && (
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Eliminar Documento
          </button>
        </div>
      </div>
    </div>
  );
}
