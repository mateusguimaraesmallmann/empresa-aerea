#!/bin/bash

echo "🚀 Iniciando build completo da aplicação Empresa Aérea..."

# 1. Parar e remover containers, redes (mas NÃO os volumes)
echo "🧹 Parando containers e removendo volumes antigos..."
docker-compose -f empresa-aerea-compose.yaml down -v --remove-orphans

# 2. Limpeza geral do Docker
echo "🗑️  Limpando imagens não utilizadas, containers parados e redes não utilizadas..."
docker system prune -af

# 3. Build do front-end
#echo "🎨 Realizando build do front-end..."
#cd ./front-end
#npm install
#npm run build
#cd ..

# 4. Subir containers com build forçado
echo "🐳 Subindo os containers com Docker Compose..."
docker-compose -f empresa-aerea-compose.yaml up --build -d

echo "✅ Aplicação Empresa Aérea iniciada com sucesso!"