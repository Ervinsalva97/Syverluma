import os
from crewai import Agent, Task, Crew, Process, LLM
from crewai_tools import FileWriterTool
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 1. Inicializar cerebro y herramienta (Acceso total al monorepo)
llm_base = LLM(model="gemini/gemini-3.5-flash-lite", api_key=api_key)
escritor_archivos = FileWriterTool(directory='D:/Syverluma')

# 2. Contratar a la mesa directiva
pm = Agent(
    role='Director de Proyectos',
    goal='Diseñar arquitecturas técnicas y entregar el código en texto plano para que otros lo implementen.',
    backstory='Arquitecto de software de Syverluma. Piensas en la seguridad y estructura antes de programar.',
    verbose=True,
    allow_delegation=False,
    llm=llm_base
)

ingeniero = Agent(
    role='Director de Ingeniería Full-Stack',
    goal='Tomar los diseños del PM y CREAR físicamente los archivos en el disco duro usando herramientas.',
    backstory='Desarrollador ejecutor. NO explicas código, solo usas tu FileWriterTool para guardarlo en las rutas indicadas.',
    verbose=True,
    allow_delegation=False,
    tools=[escritor_archivos],
    llm=llm_base
)

# 3. Nueva Cadena de Montaje: Conexión Real a Firestore
tarea_diseno_bd = Task(
    description='''Diseña el código Python para el backend en Django que lea datos REALES de Cloud Firestore.
    1. Modifica 'views.py' agregando una nueva vista llamada 'ProductoListView(APIView)'.
    2. Dentro de esa vista, usa 'from firebase_admin import firestore', inicializa el cliente (db = firestore.client()) y lee todos los documentos de la colección 'productos'.
    3. Devuelve los productos en formato JSON usando Response().
    4. Modifica 'urls.py' para exponer esta vista en la ruta 'api/productos/'.
    NO borres la vista de autenticación que ya existe, solo agrega la nueva.''',
    expected_output='Código fuente completo de views.py y urls.py actualizados.',
    agent=pm
)

tarea_escritura_bd = Task(
    description='''Toma el código del PM y usa FileWriterTool para SOBRESCRIBIR los archivos:
    1. D:/Syverluma/backend/core/views.py
    2. D:/Syverluma/backend/core/urls.py''',
    expected_output='Archivos views.py y urls.py guardados con éxito.',
    agent=ingeniero
)

# Actualiza las tareas en el Crew
syverluma_crew = Crew(
    agents=[pm, ingeniero],
    tasks=[tarea_diseno_bd, tarea_escritura_bd],
    process=Process.sequential 
)
# 4. Iniciar la Corporación
syverluma_crew = Crew(
    agents=[pm, ingeniero],
    tasks=[tarea_diseno_bd, tarea_escritura_bd], # <-- Esta es la línea que debes cambiar
    process=Process.sequential 
)
print("Iniciando operaciones de la corporación Syverluma (Fase: Backend Auth)...")
resultado = syverluma_crew.kickoff()

print("\n\n######################")
print("ENTREGA FINAL AL DIRECTOR:")
print(resultado)