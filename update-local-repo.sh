#!/bin/bash

# Script para actualizar el repositorio local después de fusionar el Pull Request

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Actualización del repositorio local después de fusionar el Pull Request${NC}"
echo "Este script actualizará tu repositorio local después de fusionar el Pull Request en GitHub."
echo ""

echo -e "${YELLOW}Instrucciones:${NC}"
echo "1. Ve a GitHub y crea un Pull Request desde 'clean-branch' a 'master'."
echo "2. Aprueba y fusiona el Pull Request."
echo "3. Ejecuta este script para actualizar tu repositorio local."
echo ""

read -p "¿Has fusionado el Pull Request en GitHub? (s/n): " MERGED

if [ "$MERGED" != "s" ] && [ "$MERGED" != "S" ]; then
    echo -e "${RED}Por favor, fusiona el Pull Request antes de continuar.${NC}"
    exit 1
fi

echo -e "${YELLOW}Actualizando el repositorio local...${NC}"

# Cambiar a la rama master
git checkout master

# Obtener los cambios remotos
git fetch origin

# Restablecer la rama master local para que coincida con la remota
git reset --hard origin/master

# Eliminar la rama clean-branch local
git branch -D clean-branch

echo -e "${GREEN}¡Repositorio local actualizado correctamente!${NC}"
echo "La rama master local ahora coincide con la remota y la rama clean-branch ha sido eliminada."
