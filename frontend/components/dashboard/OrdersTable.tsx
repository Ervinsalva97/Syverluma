'use client';

import React, { useState } from 'react';

export interface OrderItem {
  id: string;
  numeroOrden: string;
  cliente?: {
    nombre?: string;
    email?: string;
    telefono?: string;
    documento?: string;
  } | string;
  productos?: Array<{
    id?: string;
    nombre?: string;
    cantidad?: number;
    precio?: number;
  }>;
  total: number;
  metodoPago?: string;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado' | string;
  emprendimiento?: string;
  fechaCreacion?: string;
  notas?: string;
}

interface OrdersTableProps {
  orders: OrderItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onUpdateStatus?: (id: string, newStatus: string) => Promise<void>;
}

export default function OrdersTable({
  orders,
  loading = false,
  onRefresh,
  onUpdateStatus,
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmprendimiento, setFilterEmprendimiento] = useState('ALL');
  const [filterEstado, setFilterEstado] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const emprendimientos = Array.from(
    new Set(orders.map((o) => o.emprendimiento || 'Syverluma Central'))
  );

  const filteredOrders = orders.filter((o) => {
    const num = (o.numeroOrden || '').toLowerCase();
    const clienteName = typeof o.cliente === 'object' ? (o.cliente?.nombre || '') : (o.cliente || '');
    const matchesSearch = num.includes(searchTerm.toLowerCase()) || clienteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmp = filterEmprendimiento === 'ALL' || (o.emprendimiento || 'Syverluma Central') === filterEmprendimiento;
    const matchesEstado = filterEstado === 'ALL' || o.estado.toLowerCase() === filterEstado.toLowerCase();
    return matchesSearch && matchesEmp && matchesEstado;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!onUpdateStatus) return;
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'entregado':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
      case 'enviado':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
      case 'confirmado':
        return 'bg-teal-950/60 text-teal-300 border-teal-800/50';
      case 'cancelado':
        return 'bg-red-950/60 text-red-400 border-red-800/50';
      case 'pendiente':
      default:
        return 'bg-amber-950/60 text-amber-300 border-amber-800/50';
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gestión de Pedidos & Ventas
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              eDark & Multi-Emprendimientos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Órdenes procesadas en tiempo real para todos los emprendimientos de la corporación
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por orden o cliente..."
            className="px-3.5 py-2 text-xs bg-slate-800/90 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-52 transition-all"
          />

          <select
            value={filterEmprendimiento}
            onChange={(e) => setFilterEmprendimiento(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800/90 text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="ALL">Todos los Emprendimientos</option>
            {emprendimientos.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800/90 text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Recargar pedidos"
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
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-6">Nº Orden</th>
              <th className="py-3 px-6">Emprendimiento</th>
              <th className="py-3 px-6">Cliente</th>
              <th className="py-3 px-6">Total (S/)</th>
              <th className="py-3 px-6">Método de Pago</th>
              <th className="py-3 px-6">Estado</th>
              <th className="py-3 px-6 text-right">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-24" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-800 rounded w-20 ml-auto" /></td>
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 text-xl">
                      🛍️
                    </div>
                    <p className="text-sm font-semibold text-slate-300">
                      No hay pedidos registrados en este momento
                    </p>
                    <p className="text-xs text-slate-500">
                      Las órdenes de eDark Store y otros emprendimientos aparecerán aquí en tiempo real.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const clienteNombre = typeof o.cliente === 'object' ? (o.cliente?.nombre || 'Cliente General') : (o.cliente || 'Cliente General');
                const clienteEmail = typeof o.cliente === 'object' ? o.cliente?.email : '';

                return (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-300 font-semibold group-hover:text-blue-400 transition-colors">
                      {o.numeroOrden || o.id}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800/50">
                        {o.emprendimiento || 'Syverluma Central'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-white">{clienteNombre}</div>
                      {clienteEmail && <div className="text-[11px] text-slate-500">{clienteEmail}</div>}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-400">
                      S/ {Number(o.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6 text-xs capitalize text-slate-300">
                      {o.metodoPago || 'Transferencia'}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(o.estado)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {o.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <select
                        disabled={updatingId === o.id}
                        value={o.estado}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-2.5 py-1 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs text-slate-400">
        <span>
          Total Pedidos: <strong className="text-white">{filteredOrders.length}</strong>
        </span>
        <span className="text-[11px] text-slate-500">
          Syverluma Order Manager • Conectado a Firestore /ventas
        </span>
      </div>
    </div>
  );
}
