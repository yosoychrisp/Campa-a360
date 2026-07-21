#!/bin/sh
set -e

echo "Inicializando base de datos y usuario administrador..."
python -m app.initial_data

echo "Iniciando servidor..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
