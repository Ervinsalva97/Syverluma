# Dockerfile para Backend Django REST Framework (Syverluma ERP)
FROM python:3.11-slim

# Evitar escritura de archivos .pyc y activar stdout/stderr sin buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . /app/

# Exponer el puerto del backend Django
EXPOSE 8000

# Comando de inicio predeterminado
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
