#!/bin/bash
set -e

echo "🚀 Iniciando build completo da aplicação Empresa Aérea..."

echo "🧹 Parando containers e removendo volumes antigos..."
docker-compose -f empresa-aerea-compose.yaml down --remove-orphans

echo "🗑️  Limpando imagens não utilizadas, containers parados e redes não utilizadas..."
docker system prune -af

echo "🎨 Realizando build do front-end..."
cd ./front-end
npm install

if ! npm run build; then
  echo "❌ Erro no build do front-end. Verifique o log acima."
  exit 1
fi

cd ..

echo "🐳 Subindo os containers com Docker Compose..."
docker-compose -f empresa-aerea-compose.yaml up --build -d

echo "✅ Aplicação Empresa Aérea iniciada com sucesso!"
