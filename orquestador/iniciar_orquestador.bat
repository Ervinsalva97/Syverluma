@echo off
title Syverluma - Orquestador Corporativo de Agentes
cd /d "%~dp0"
echo ======================================================================
echo   Iniciando Orquestador Multi-Agente - Corporacion Syverluma S.A.C.
echo ======================================================================
echo.

if exist "venv\Scripts\activate.bat" (
    call "venv\Scripts\activate.bat"
) else (
    echo [!] No se encontro el entorno virtual en orquestador\venv
    pause
    exit /b 1
)

python main.py
pause
