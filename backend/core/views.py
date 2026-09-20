import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Configuración del logger para trazabilidad de errores
logger = logging.getLogger(__name__)

# Inicializar Firebase Admin SDK si aún no existe
if not firebase_admin._apps:
    # Apuntar al archivo JSON ubicado en la raíz del backend
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cred_path = os.path.join(base_dir, 'firebase-credenciales.json')
        
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin inicializado correctamente en Django.")
    except Exception as e:
        logger.error(f"Fallo al inicializar Firebase Admin: {e}")


# ==========================================
# VISTA DE AUTENTICACIÓN EXISTENTE (NO BORRAR)
# ==========================================
class AuthView(APIView):
    """
    Vista encargada de gestionar la autenticación de usuarios.
    """
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                {"error": "Credenciales incompletas."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(
            {"message": "Autenticación exitosa", "token": "jwt-token-ejemplo"}, 
            status=status.HTTP_200_OK
        )


# ==========================================
# NUEVA VISTA: PRODUCTO LIST VIEW
# ==========================================
class ProductoListView(APIView):
    """
    API View para leer datos REALES desde Cloud Firestore 
    de la colección 'productos'.
    """
    def get(self, request):
        try:
            # Inicializar el cliente de Firestore
            db = firestore.client()
            
            # Referencia a la colección 'productos'
            productos_ref = db.collection('productos')
            
            # Obtener todos los documentos de la colección
            docs = productos_ref.stream()
            
            productos_lista = []
            for doc in docs:
                producto_data = doc.to_dict()
                producto_data['id'] = doc.id
                productos_lista.append(producto_data)
            
            return Response(
                {
                    "status": "success",
                    "count": len(productos_lista),
                    "data": productos_lista,
                    "productos": productos_lista
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al conectar con Cloud Firestore en ProductoListView: {str(e)}")
            return Response(
                {
                    "status": "error",
                    "message": "No se pudo recuperar la información de los productos en este momento."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Crea un nuevo producto en la colección 'productos' de Cloud Firestore.
        """
        try:
            data = request.data
            nombre = data.get('nombre') or data.get('title')
            precio = data.get('precio') if data.get('precio') is not None else data.get('price')
            
            if not nombre:
                return Response(
                    {"status": "error", "message": "El nombre o título del producto es obligatorio."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                precio_float = float(precio) if precio is not None else 0.0
            except (ValueError, TypeError):
                return Response(
                    {"status": "error", "message": "El precio debe ser un número válido."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            categoria = data.get('categoria') or data.get('category') or 'General'
            try:
                stock_int = int(data.get('stock', 0))
            except (ValueError, TypeError):
                stock_int = 0

            descripcion = data.get('descripcion') or data.get('description') or ''

            nuevo_producto = {
                'nombre': str(nombre).strip(),
                'title': str(nombre).strip(),
                'precio': precio_float,
                'price': precio_float,
                'categoria': str(categoria).strip(),
                'category': str(categoria).strip(),
                'stock': stock_int,
                'descripcion': str(descripcion).strip(),
                'description': str(descripcion).strip(),
                'activo': True
            }

            db = firestore.client()
            _, doc_ref = db.collection('productos').add(nuevo_producto)
            nuevo_producto['id'] = doc_ref.id

            return Response(
                {
                    "status": "success",
                    "message": "Producto creado exitosamente en Cloud Firestore.",
                    "data": nuevo_producto
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error al crear producto en Firestore: {str(e)}")
            return Response(
                {"status": "error", "message": f"Error al registrar producto: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# VISTA DE DETALLE, EDICIÓN Y ELIMINACIÓN CRUD
# ==========================================
class ProductoDetailView(APIView):
    """
    API View para consultar, actualizar y eliminar un producto por ID en Cloud Firestore.
    """
    def get(self, request, pk):
        try:
            db = firestore.client()
            doc_ref = db.collection('productos').document(pk)
            doc = doc_ref.get()
            if not doc.exists:
                return Response(
                    {"status": "error", "message": "Producto no encontrado en Firestore."},
                    status=status.HTTP_404_NOT_FOUND
                )
            data = doc.to_dict()
            data['id'] = doc.id
            return Response({"status": "success", "data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error al obtener producto {pk}: {str(e)}")
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        """
        Actualiza un producto existente en Cloud Firestore.
        """
        try:
            db = firestore.client()
            doc_ref = db.collection('productos').document(pk)
            doc = doc_ref.get()
            if not doc.exists:
                return Response(
                    {"status": "error", "message": "Producto no encontrado para actualizar."},
                    status=status.HTTP_404_NOT_FOUND
                )

            data = request.data
            update_data = {}
            if 'nombre' in data or 'title' in data:
                nombre = data.get('nombre') or data.get('title')
                update_data['nombre'] = str(nombre).strip()
                update_data['title'] = str(nombre).strip()
            
            if 'precio' in data or 'price' in data:
                val = data.get('precio') if data.get('precio') is not None else data.get('price')
                try:
                    update_data['precio'] = float(val)
                    update_data['price'] = float(val)
                except (ValueError, TypeError):
                    pass

            if 'categoria' in data or 'category' in data:
                cat = data.get('categoria') or data.get('category')
                update_data['categoria'] = str(cat).strip()
                update_data['category'] = str(cat).strip()

            if 'stock' in data:
                try:
                    update_data['stock'] = int(data.get('stock'))
                except (ValueError, TypeError):
                    pass

            if 'descripcion' in data or 'description' in data:
                desc = data.get('descripcion') or data.get('description')
                update_data['descripcion'] = str(desc).strip()
                update_data['description'] = str(desc).strip()

            if 'activo' in data:
                update_data['activo'] = bool(data.get('activo'))

            if not update_data:
                return Response(
                    {"status": "error", "message": "No se proporcionaron datos válidos para actualizar."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            doc_ref.update(update_data)
            
            actualizado = doc_ref.get().to_dict()
            actualizado['id'] = pk

            return Response(
                {
                    "status": "success",
                    "message": "Producto actualizado exitosamente en Cloud Firestore.",
                    "data": actualizado
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al actualizar producto {pk}: {str(e)}")
            return Response(
                {"status": "error", "message": f"Fallo al actualizar: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        """
        Elimina un producto de Cloud Firestore.
        """
        try:
            db = firestore.client()
            doc_ref = db.collection('productos').document(pk)
            doc = doc_ref.get()
            if not doc.exists:
                return Response(
                    {"status": "error", "message": "Producto no encontrado para eliminar."},
                    status=status.HTTP_404_NOT_FOUND
                )

            doc_ref.delete()
            return Response(
                {
                    "status": "success",
                    "message": f"Producto con ID {pk} eliminado exitosamente de Cloud Firestore."
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al eliminar producto {pk}: {str(e)}")
            return Response(
                {"status": "error", "message": f"Fallo al eliminar: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# MÉTRICAS CONSOLIDADAS MULTI-EMPRENDIMIENTO
# ==========================================
class DashboardMetricsView(APIView):
    """
    Calcula en tiempo real las métricas consolidadas del sistema Syverluma
    (Ventas Totales, Pedidos Activos, Catálogo y Clientes) consultando
    las colecciones 'ventas', 'productos' y 'usuarios' de Cloud Firestore.
    """
    def get(self, request):
        try:
            db = firestore.client()
            
            # 1. Analizar colección 'ventas'
            ventas_ref = db.collection('ventas')
            ventas_docs = ventas_ref.stream()

            total_ingresos = 0.0
            pedidos_activos = 0
            total_pedidos = 0
            clientes_unicos = set()
            emprendimientos_activos = set(['Syverluma Central', 'eDark Store'])

            for v_doc in ventas_docs:
                v = v_doc.to_dict()
                total_pedidos += 1
                try:
                    total_ingresos += float(v.get('total', 0.0))
                except (ValueError, TypeError):
                    pass

                estado = str(v.get('estado', 'pendiente')).lower()
                if estado in ['pendiente', 'confirmado', 'enviado']:
                    pedidos_activos += 1

                cliente = v.get('cliente', {})
                if isinstance(cliente, dict):
                    email = cliente.get('email') or cliente.get('nombre')
                    if email:
                        clientes_unicos.add(email)
                elif isinstance(cliente, str) and cliente:
                    clientes_unicos.add(cliente)

                emp = v.get('emprendimiento') or v.get('tienda')
                if emp:
                    emprendimientos_activos.add(str(emp))

            # 2. Analizar colección 'productos'
            prod_ref = db.collection('productos')
            prod_docs = prod_ref.stream()
            total_productos = 0
            productos_bajo_stock = 0

            for p_doc in prod_docs:
                p = p_doc.to_dict()
                total_productos += 1
                stock = p.get('stock', 0)
                try:
                    if int(stock) < 5:
                        productos_bajo_stock += 1
                except (ValueError, TypeError):
                    pass

                emp = p.get('emprendimiento') or p.get('tienda') or p.get('marca')
                if emp:
                    emprendimientos_activos.add(str(emp))

            # 3. Analizar colección 'usuarios' (Clientes Registrados)
            try:
                usr_ref = db.collection('usuarios')
                usr_docs = list(usr_ref.stream())
                total_usuarios = max(len(usr_docs), len(clientes_unicos))
            except Exception:
                total_usuarios = len(clientes_unicos)

            # Si la base de datos es nueva o no tiene ventas aún, mostrar bases sanas
            formatted_ingresos = f"S/ {total_ingresos:,.2f}" if total_ingresos > 0 else "S/ 0.00"

            return Response(
                {
                    "status": "success",
                    "metricas": {
                        "ventas_totales_num": round(total_ingresos, 2),
                        "ventas_totales": formatted_ingresos,
                        "pedidos_activos": pedidos_activos,
                        "total_pedidos": total_pedidos,
                        "productos_catalogo": total_productos,
                        "productos_bajo_stock": productos_bajo_stock,
                        "clientes_registrados": total_usuarios,
                        "emprendimientos": sorted(list(emprendimientos_activos))
                    }
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al calcular métricas de dashboard: {str(e)}")
            return Response(
                {
                    "status": "error",
                    "message": f"Error al generar métricas: {str(e)}",
                    "metricas": {
                        "ventas_totales": "S/ 0.00",
                        "pedidos_activos": 0,
                        "productos_catalogo": 0,
                        "clientes_registrados": 0,
                        "emprendimientos": ["Syverluma Central", "eDark Store"]
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# GESTIÓN DE VENTAS Y PEDIDOS (CRUD PEDIDOS)
# ==========================================
class VentaListView(APIView):
    """
    Listar y crear pedidos/ventas en Cloud Firestore para cualquier emprendimiento
    asociado a la matriz Syverluma (incluyendo eDark Store).
    """
    def get(self, request):
        try:
            db = firestore.client()
            ventas_ref = db.collection('ventas')
            
            # Filtro opcional por emprendimiento
            emp_filtro = request.query_params.get('emprendimiento')
            if emp_filtro and emp_filtro != 'ALL':
                docs = ventas_ref.where('emprendimiento', '==', emp_filtro).stream()
            else:
                docs = ventas_ref.stream()

            ventas_lista = []
            for doc in docs:
                v = doc.to_dict()
                v['id'] = doc.id
                ventas_lista.append(v)

            # Ordenar por fecha descendente si existe
            ventas_lista.sort(
                key=lambda x: str(x.get('fechaCreacion', '')),
                reverse=True
            )

            return Response(
                {
                    "status": "success",
                    "count": len(ventas_lista),
                    "ventas": ventas_lista
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al listar ventas en Firestore: {str(e)}")
            return Response(
                {"status": "error", "message": f"Fallo al consultar ventas: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Registra una nueva orden o venta en Cloud Firestore.
        """
        try:
            data = request.data
            cliente = data.get('cliente', {})
            productos = data.get('productos', [])
            total = data.get('total', 0.0)
            metodo_pago = data.get('metodoPago', 'transferencia')
            emprendimiento = data.get('emprendimiento') or data.get('tienda') or 'Syverluma Central'

            import time
            numero_orden = data.get('numeroOrden') or f"ORD-{int(time.time())}"

            nueva_venta = {
                'numeroOrden': numero_orden,
                'cliente': cliente if isinstance(cliente, dict) else {'nombre': str(cliente)},
                'productos': productos,
                'total': float(total),
                'metodoPago': metodo_pago,
                'estado': data.get('estado', 'pendiente'),
                'emprendimiento': emprendimiento,
                'fechaCreacion': time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                'notas': data.get('notas', '')
            }

            db = firestore.client()
            _, doc_ref = db.collection('ventas').add(nueva_venta)
            nueva_venta['id'] = doc_ref.id

            return Response(
                {
                    "status": "success",
                    "message": "Venta registrada exitosamente en Cloud Firestore.",
                    "data": nueva_venta
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error al registrar venta: {str(e)}")
            return Response(
                {"status": "error", "message": f"Error al procesar venta: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VentaDetailView(APIView):
    """
    Actualizar estado de una venta (ej. pendiente -> confirmado -> enviado -> entregado).
    """
    def put(self, request, pk):
        try:
            db = firestore.client()
            doc_ref = db.collection('ventas').document(pk)
            doc = doc_ref.get()
            if not doc.exists:
                return Response(
                    {"status": "error", "message": "Venta no encontrada."},
                    status=status.HTTP_404_NOT_FOUND
                )

            data = request.data
            update_data = {}
            if 'estado' in data:
                update_data['estado'] = str(data['estado']).lower()
            if 'notas' in data:
                update_data['notas'] = str(data['notas'])

            if update_data:
                doc_ref.update(update_data)

            actualizado = doc_ref.get().to_dict()
            actualizado['id'] = pk

            return Response(
                {
                    "status": "success",
                    "message": "Estado de venta actualizado exitosamente.",
                    "data": actualizado
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al actualizar venta {pk}: {str(e)}")
            return Response(
                {"status": "error", "message": f"Fallo al actualizar venta: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )