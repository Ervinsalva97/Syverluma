# Syverluma Monorepo

Estructura base de la arquitectura del monorepo Syverluma.

## Estructura
- `/frontend`: Aplicación web moderna en Next.js (Preparado para despliegue en Vercel)
- `/backend`: Servicios API en Django (Preparado para despliegue en Railway / Docker)

## Seguridad (Regla Verum)
Las variables de entorno (`.env`, `.env.local`), dependencias (`node_modules`, `venv`) y archivos compilados están estrictamente excluidos del control de versiones mediante `.gitignore`.
