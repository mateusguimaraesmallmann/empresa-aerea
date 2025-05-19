#!/bin/bash

echo "🚀 Iniciando build completo da aplicação Empresa Aérea..."

# 1. Parar e remover containers e volumes antigos
echo "🧹 Limpando containers e volumes anteriores..."
docker-compose -f empresa-aerea-compose.yaml down -v

# 2. Build do front-end Vite (React)
echo "🎨 Realizando build do front-end..."
cd ./front-end
npm install
npm run build
cd ..

# 3. Subir containers com build forçado
echo "🐳 Subindo os containers com Docker Compose..."
docker-compose -f empresa-aerea-compose.yaml up --build