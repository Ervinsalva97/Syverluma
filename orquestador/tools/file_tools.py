import os
from crewai_tools import FileReadTool, FileWriterTool, DirectoryReadTool

MONOREPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# Herramienta de lectura de archivos
lector_archivos = FileReadTool()

# Herramienta de exploración de directorios dentro de Syverluma
explorador_archivos = DirectoryReadTool(directory=MONOREPO_ROOT)

# Herramienta de escritura de archivos con raíz en el Monorepo
escritor_archivos = FileWriterTool()
