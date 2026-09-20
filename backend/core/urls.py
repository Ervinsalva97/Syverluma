from django.urls import path
from .views import (
    AuthView,
    ProductoListView,
    ProductoDetailView,
    DashboardMetricsView,
    VentaListView,
    VentaDetailView
)

urlpatterns = [
    # Ruta de autenticación ya existente en el sistema
    path('api/auth/', AuthView.as_view(), name='api-auth'),
    
    # Métricas consolidadas en tiempo real (Multi-Emprendimiento)
    path('api/dashboard/metricas/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    
    # Rutas CRUD para productos en Cloud Firestore
    path('api/productos/', ProductoListView.as_view(), name='api-productos-list'),
    path('api/productos/<str:pk>/', ProductoDetailView.as_view(), name='api-productos-detail'),

    # Rutas para gestión de Ventas y Pedidos (eDark + Nuevos Emprendimientos)
    path('api/ventas/', VentaListView.as_view(), name='api-ventas-list'),
    path('api/ventas/<str:pk>/', VentaDetailView.as_view(), name='api-ventas-detail'),
]
