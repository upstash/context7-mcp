# Configuración segura de MCP para Augment Code y Claude Desktop

Este documento proporciona instrucciones para configurar de forma segura los servidores MCP (Model Context Protocol) en Augment Code y Claude Desktop.

## Consideraciones de seguridad

Los archivos de configuración de MCP pueden contener tokens de acceso y otras credenciales sensibles. Para mantener estas credenciales seguras:

1. **No incluyas tokens directamente en los archivos de configuración** que se subirán a repositorios públicos o compartidos.
2. **Usa variables de entorno** para almacenar y acceder a tokens sensibles.
3. **Añade los archivos de configuración con credenciales a .gitignore** para evitar que se suban accidentalmente.

## Configuración segura para GitHub MCP

### Opción 1: Usar variables de entorno en el sistema

1. Configura una variable de entorno en tu sistema:

   **macOS/Linux:**
   ```bash
   echo 'export GITHUB_TOKEN="tu_token_aquí"' >> ~/.zshrc
   # O para bash
   echo 'export GITHUB_TOKEN="tu_token_aquí"' >> ~/.bashrc
   source ~/.zshrc  # O source ~/.bashrc
   ```

   **Windows:**
   ```
   setx GITHUB_TOKEN "tu_token_aquí"
   ```

2. Modifica los archivos de configuración para usar la variable de entorno:

   **Para VS Code (settings.json):**
   ```json
   "env": {
     "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
   }
   ```

   **Para Claude Desktop (claude_desktop_config.json):**
   ```json
   "env": {
     "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
   }
   ```

### Opción 2: Usar un archivo .env local (para scripts)

1. Crea un archivo `.env` en tu directorio de trabajo:
   ```
   GITHUB_TOKEN=tu_token_aquí
   ```

2. Asegúrate de añadir `.env` a tu `.gitignore`:
   ```
   echo ".env" >> .gitignore
   ```

3. En tus scripts JavaScript, carga las variables de entorno:
   ```javascript
   // Al inicio del script
   import dotenv from 'dotenv';
   dotenv.config();

   // Luego usa process.env.GITHUB_TOKEN
   const githubToken = process.env.GITHUB_TOKEN;
   ```

## Verificación de la configuración

Para verificar que tu configuración es segura:

1. Ejecuta el script de prueba con la variable de entorno:
   ```bash
   GITHUB_TOKEN=tu_token_aquí node test-mcp.js
   ```

2. Verifica que no hay tokens hardcodeados en ningún archivo antes de hacer commit:
   ```bash
   grep -r "GITHUB_TOKEN" --include="*.json" --include="*.js" .
   ```

## Archivos actualizados

Los siguientes archivos han sido actualizados para usar variables de entorno:

1. `augment-settings.json`
2. `claude_desktop_config.json`
3. `test-mcp-augment.js`
4. `test-mcp.js`
5. `mcp.json`

## Próximos pasos

1. Configura la variable de entorno `GITHUB_TOKEN` en tu sistema.
2. Reinicia VS Code y Claude Desktop para que los cambios surtan efecto.
3. Prueba los MCP para verificar que funcionan correctamente con la nueva configuración.
