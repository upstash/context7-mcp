#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando Landing Page de MCP${NC}"
echo "Este script iniciará un servidor local para la landing page y abrirá tu navegador."
echo ""

# Verificar si npx está instalado
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Error: npx no está instalado.${NC}"
    echo "Por favor, instala Node.js y npm desde https://nodejs.org/"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install
fi

# Iniciar el servidor
echo -e "${YELLOW}Iniciando servidor...${NC}"
npx serve &
SERVER_PID=$!

# Esperar a que el servidor esté listo
sleep 2

# Abrir el navegador
echo -e "${YELLOW}Abriendo navegador...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:3000
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start http://localhost:3000
else
    echo -e "${YELLOW}No se pudo abrir el navegador automáticamente.${NC}"
    echo "Por favor, abre manualmente: http://localhost:3000"
fi

echo -e "${GREEN}¡Servidor iniciado!${NC}"
echo "La landing page está disponible en: http://localhost:3000"
echo "Presiona Ctrl+C para detener el servidor."

# Esperar a que el usuario presione Ctrl+C
wait $SERVER_PID
