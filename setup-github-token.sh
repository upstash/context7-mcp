#!/bin/bash

# Script para configurar de forma segura el token de GitHub como variable de entorno

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configuración segura de token de GitHub para MCP${NC}"
echo "Este script configurará tu token de GitHub como una variable de entorno."
echo "Esto permitirá que los servidores MCP accedan a GitHub sin exponer el token en archivos de configuración."
echo ""

# Solicitar el token de GitHub
read -p "Ingresa tu token de GitHub: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: No se proporcionó un token.${NC}"
    exit 1
fi

# Detectar el shell que está usando el usuario
SHELL_TYPE=$(basename "$SHELL")
SHELL_CONFIG=""

if [ "$SHELL_TYPE" = "zsh" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ "$SHELL_TYPE" = "bash" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    echo -e "${YELLOW}No se pudo detectar automáticamente tu shell.${NC}"
    echo "Selecciona tu shell:"
    echo "1) zsh"
    echo "2) bash"
    read -p "Opción (1/2): " SHELL_OPTION
    
    if [ "$SHELL_OPTION" = "1" ]; then
        SHELL_CONFIG="$HOME/.zshrc"
    elif [ "$SHELL_OPTION" = "2" ]; then
        SHELL_CONFIG="$HOME/.bashrc"
    else
        echo -e "${RED}Opción no válida.${NC}"
        exit 1
    fi
fi

# Verificar si la variable ya existe en el archivo de configuración
if grep -q "export GITHUB_TOKEN=" "$SHELL_CONFIG"; then
    echo -e "${YELLOW}Se encontró una configuración existente de GITHUB_TOKEN.${NC}"
    read -p "¿Deseas sobrescribirla? (s/n): " OVERWRITE
    
    if [ "$OVERWRITE" = "s" ] || [ "$OVERWRITE" = "S" ]; then
        # Eliminar la línea existente
        sed -i '' '/export GITHUB_TOKEN=/d' "$SHELL_CONFIG"
    else
        echo -e "${YELLOW}Configuración cancelada.${NC}"
        exit 0
    fi
fi

# Añadir la variable de entorno al archivo de configuración del shell
echo "export GITHUB_TOKEN=\"$GITHUB_TOKEN\"" >> "$SHELL_CONFIG"

echo -e "${GREEN}¡Token configurado correctamente!${NC}"
echo "La variable de entorno GITHUB_TOKEN ha sido añadida a $SHELL_CONFIG"
echo ""
echo "Para aplicar los cambios en la sesión actual, ejecuta:"
echo -e "${YELLOW}source $SHELL_CONFIG${NC}"
echo ""
echo "Recuerda reiniciar VS Code y Claude Desktop para que los cambios surtan efecto."

# Aplicar los cambios inmediatamente
source "$SHELL_CONFIG"

# Verificar que la variable está disponible
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}Verificación exitosa: La variable GITHUB_TOKEN está disponible.${NC}"
else
    echo -e "${YELLOW}Advertencia: La variable GITHUB_TOKEN no está disponible en esta sesión.${NC}"
    echo "Ejecuta 'source $SHELL_CONFIG' manualmente para cargar la variable."
fi
