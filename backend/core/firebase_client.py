import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

_db_instance = None

def get_firestore_client():
    """
    Inicializa el SDK de Firebase Admin utilizando el certificado especificado en .env
    y retorna la instancia del cliente Cloud Firestore.
    """
    global _db_instance
    if _db_instance is not None:
        return _db_instance

    # Obtener la ruta del archivo de credenciales desde .env
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
    
    # Si la ruta es relativa, resolverla desde el directorio raíz del backend
    if not os.path.isabs(cred_path):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cred_path = os.path.join(base_dir, cred_path)

    if cred_path and os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        _db_instance = firestore.client()
        return _db_instance
    else:
        # Fallback de seguridad si el archivo JSON no está disponible en el entorno
        return None
