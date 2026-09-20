'use client';

import React, { useState } from 'react';
import ProductModal from './ProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export interface ProductItem {
  id: string;
  title?: string;
  nombre?: string;
  category?: string;
  categoria?: string;
  price?: number;
  precio?: number;
  stock?: number;
  status?: string;
  estado?: string;
  descripcion?: string;
  description?: string;
  emprendimiento?: string;
}

interface ProductTableProps {
  products: ProductItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onCreateProduct?: (data: Partial<ProductItem>) => Promise<void>;
  onUpdateProduct?: (id: string, data: Partial<ProductItem>) => Promise<void>;
  onDeleteProduct?: (id: string) => Promise<void>;
}

export default function ProductTable({
  products,
  loading = false,
  onRefresh,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Estados para Modales CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  // Filtrado de productos por término de búsqueda y categoría
  const filteredProducts = products.filter((p) => {
    const name = (p.title || p.nombre || '').toLowerCase();
    const cat = (p.category || p.categoria || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || cat === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Obtener categorías únicas disponibles
  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category || p.categoria)
        .filter((c): c is string => Boolean(c))
    )
  );

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (product: ProductItem) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (formData: Partial<ProductItem>) => {
    if (modalMode === 'create' && onCreateProduct) {
      await onCreateProduct(formData);
    } else if (modalMode === 'edit' && selectedProduct && onUpdateProduct) {
      await onUpdateProduct(selectedProduct.id, formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete && onDeleteProduct) {
      await onDeleteProduct(productToDelete.id);
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
        {/* Table Header & Controls */}
        <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Catálogo de Productos
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-950 text-blue-400 border border-blue-800/50">
                Cloud Firestore CRUD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gestión y sincronización en tiempo real mediante Django REST API
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o ID..."
                className="px-3.5 py-2 text-xs bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-52 transition-all"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-800/90 text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="ALL">Todas las Categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                title="Sincronizar con Firestore"
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}

            {/* Create Button */}
            {onCreateProduct && (
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-400 hover:to-emerald-300 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <span className="text-sm font-black">+</span>
                Nuevo Producto
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">ID Documento</th>
                <th className="py-3 px-6">Producto</th>
                <th className="py-3 px-6">Categoría</th>
                <th className="py-3 px-6">Precio Unitario</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                // Skeleton Loading State
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-36" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-24" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-16" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-12" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-800 rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 text-xl">
                        📦
                      </div>
                      <p className="text-sm font-semibold text-slate-300">
                        {searchTerm ? 'No hay productos que coincidan con el filtro' : 'No se encontraron productos en Firestore'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Haz clic en &quot;+ Nuevo Producto&quot; para agregar el primer registro a la base de datos.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const title = p.title || p.nombre || 'Sin nombre';
                  const category = p.category || p.categoria || 'General';
                  const price = p.price ?? p.precio ?? 0;
                  const stock = p.stock ?? 0;
                  const isOutOfStock = stock <= 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                        {p.id}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-white">
                        <div>{title}</div>
                        {p.emprendimiento && (
                          <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 inline-block mt-1">
                            {p.emprendimiento}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-mono font-semibold text-slate-100">
                        S/ {Number(price).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`text-xs font-semibold ${
                            stock > 10
                              ? 'text-slate-200'
                              : stock > 0
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {stock} uds.
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/60 text-red-400 border border-red-800/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Agotado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/50 hover:bg-blue-900 border border-blue-800/50 rounded-lg transition-all"
                            title="Editar producto"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleOpenDelete(p)}
                            className="px-2.5 py-1 text-xs font-semibold text-red-400 hover:text-white bg-red-950/50 hover:bg-red-900 border border-red-800/50 rounded-lg transition-all"
                            title="Eliminar de Firestore"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs text-slate-400">
          <span>
            Mostrando <strong className="text-white">{filteredProducts.length}</strong> de <strong className="text-white">{products.length}</strong> productos
          </span>
          <span className="text-[11px] text-slate-500">
            Syverluma DataGrid v2.0 • CRUD Activo
          </span>
        </div>
      </div>

      {/* Modales Interactivos */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {productToDelete && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          productId={productToDelete.id}
          productTitle={productToDelete.title || productToDelete.nombre || 'Producto'}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
