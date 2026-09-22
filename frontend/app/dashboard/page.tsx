'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MetricCard from '@/components/dashboard/MetricCard';
import ProductTable, { ProductItem } from '@/components/dashboard/ProductTable';
import OrdersTable, { OrderItem } from '@/components/dashboard/OrdersTable';

interface DashboardMetrics {
  ventas_totales: string;
  pedidos_activos: number;
  productos_catalogo: number;
  clientes_registrados: number;
  emprendimientos: string[];
}

export default function DashboardPage() {
  const router = useRouter();

  // Estados de navegación interna
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'emprendimientos'>('productos');

  // Estados de Productos
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Estados de Pedidos / Ventas
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Estados de Métricas Globales
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ventas_totales: 'S/ 0.00',
    pedidos_activos: 0,
    productos_catalogo: 0,
    clientes_registrados: 0,
    emprendimientos: ['Syverluma Central', 'eDark Store'],
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const [backendStatus, setBackendStatus] = useState<string>('Conectando con Django...');

  // 1. Cargar Métricas Globales en Tiempo Real
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/metricas/`);
      if (res.ok) {
        const data = await res.json();
        if (data.metricas) {
          setMetrics(data.metricas);
          setBackendStatus('Django REST + Firestore (100% OK)');
        }
      }
    } catch (err) {
      console.warn('Fallo al obtener métricas consolidadas:', err);
      setBackendStatus('Modo Offline / Servidor Inactivo');
    }
  }, [API_BASE_URL]);

  // 2. Cargar Catálogo de Productos
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/productos/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        const list: ProductItem[] = data.productos || data.data || [];
        setProducts(list);
      }
    } catch (err) {
      console.warn('Backend Django offline o error al leer productos:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, [API_BASE_URL]);

  // 3. Cargar Pedidos / Ventas
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ventas/`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.ventas || []);
      }
    } catch (err) {
      console.warn('Fallo al consultar órdenes de venta:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [API_BASE_URL]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchProducts(), fetchOrders()]);
  }, [fetchMetrics, fetchProducts, fetchOrders]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Manejadores CRUD de Productos
  const handleCreateProduct = async (formData: Partial<ProductItem>) => {
    const res = await fetch(`${API_BASE_URL}/api/productos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al registrar el producto en Firestore.');
    }
    await refreshAll();
  };

  const handleUpdateProduct = async (id: string, formData: Partial<ProductItem>) => {
    const res = await fetch(`${API_BASE_URL}/api/productos/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar producto en Firestore.');
    }
    await refreshAll();
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/productos/${id}/`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al eliminar producto en Firestore.');
    }
    await refreshAll();
  };

  // Manejador de Actualización de Pedidos
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`${API_BASE_URL}/api/ventas/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar el estado de la venta.');
    }
    await refreshAll();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Syverluma <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-800/50">Matriz Corporativa</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-2 font-mono">
                Hub Multi-Emprendimiento
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 rounded-full border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Matriz Activa
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-red-600/80 border border-slate-700 rounded-xl transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Panel de Control General
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ecosistema de gestión centralizado para la Corporación Syverluma y sus emprendimientos afiliados (eDark Store y aliados).
          </p>
        </div>

        {/* Metrics Grid con Datos Reales de Firestore */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Ventas Totales Consolidadas"
            value={metrics.ventas_totales}
            subtext="Calculado en tiempo real"
            accentColor="emerald"
          />
          <MetricCard
            label="Pedidos Activos"
            value={metrics.pedidos_activos}
            subtext="Pendientes o en despacho"
            accentColor="blue"
          />
          <MetricCard
            label="Productos en Catálogo"
            value={metrics.productos_catalogo || products.length}
            subtext="Sincronizado con Firestore"
            accentColor="emerald"
          />
          <MetricCard
            label="Clientes Registrados"
            value={metrics.clientes_registrados}
            subtext="Usuarios únicos activos"
            accentColor="emerald"
          />
        </div>

        {/* Status Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              Estado de la Matriz Syverluma
            </h2>
            <span className="text-xs text-slate-400">
              Emprendimientos Activos: <strong className="text-emerald-400">{metrics.emprendimientos?.join(', ')}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 text-[11px] block">Autenticación & Bóveda</span>
              <span className="font-semibold text-emerald-400">Firebase Identity Toolkit (OK)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 text-[11px] block">API Backend & Reportes</span>
              <span className="font-semibold text-blue-400">{backendStatus}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 text-[11px] block">Sesión Segura</span>
              <span className="font-semibold text-emerald-400">syverluma_session (HttpOnly)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'productos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            📦 Catálogo de Productos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'pedidos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            🛒 Pedidos & Ventas ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('emprendimientos')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'emprendimientos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            🏢 Red de Emprendimientos ({metrics.emprendimientos?.length || 2})
          </button>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'productos' && (
          <ProductTable
            products={products}
            loading={loadingProducts}
            onRefresh={refreshAll}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'pedidos' && (
          <OrdersTable
            orders={orders}
            loading={loadingOrders}
            onRefresh={refreshAll}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'emprendimientos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emprendimiento 1: eDark Store */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-blue-400 text-lg font-bold border border-blue-800/50">
                    💻
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    Activo
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">eDark Store</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tienda de tecnología, componentes de hardware, periféricos y armado de PC personalizadas.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-semibold text-white">E-commerce Tech</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integración:</span>
                    <span className="font-semibold text-emerald-400">Next.js + Django + Firestore</span>
                  </div>
                </div>
              </div>

              {/* Emprendimiento 2: Syverluma Gifts */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 text-lg font-bold border border-emerald-800/50">
                    🎁
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    Activo
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Syverluma Gifts</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Línea de regalos corporativos personalizados, cajas de aniversario y artículos con diseño exclusivo.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-semibold text-white">Retail Personalizado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integración:</span>
                    <span className="font-semibold text-emerald-400">Catálogo Syverluma</span>
                  </div>
                </div>
              </div>

              {/* Emprendimiento 3: Servicios & Consultoría TI */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-teal-950 flex items-center justify-center text-teal-400 text-lg font-bold border border-teal-800/50">
                    ⚙️
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/50">
                    En Crecimiento
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Servicios & Consultoría TI</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Soporte a empresas, mantenimiento de servidores, consultoría cloud y desarrollo a la medida.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-semibold text-white">Servicios B2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integración:</span>
                    <span className="font-semibold text-emerald-400">Matriz Syverluma</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner de Adopción de Emprendimientos */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  ¿Deseas adoptar un nuevo emprendimiento en la Matriz?
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  El sistema multi-tenant de Syverluma permite que cualquier nuevo negocio (gastronomía, moda, servicios o tecnología) comparta la misma pasarela de pago, autenticación segura y base de datos Cloud Firestore con inventario y órdenes aisladas.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('productos')}
                className="px-5 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-400 to-emerald-400 hover:from-blue-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex-shrink-0"
              >
                + Asignar Productos a Nuevo Negocio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}