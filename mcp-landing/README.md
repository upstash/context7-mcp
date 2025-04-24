# Landing Page de Model Context Protocol (MCP)

Esta es una landing page moderna que explica qué es MCP (Model Context Protocol) y cómo probar los principales servidores MCP de forma local.

## Características

- Diseño moderno con Bootstrap 5
- Explicación detallada de MCP y sus beneficios
- Información sobre los principales servidores MCP
- Instrucciones para configurar y probar MCP localmente
- Demostración interactiva simulada
- Ejemplos de código en JavaScript y Python
- Formulario de contacto
- Diseño totalmente responsive

## Estructura del proyecto

```
mcp-landing-page/
├── css/
│   └── styles.css
├── img/
│   └── favicon.svg
├── js/
│   └── main.js
├── index.html
├── test-mcp.js
├── package.json
└── README.md
```

## Cómo usar

1. Clona este repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd mcp-landing-page
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia un servidor local:
   ```bash
   npm start
   ```

4. Prueba los servidores MCP:
   ```bash
   npm run test-mcp
   ```

## Servidores MCP incluidos

- **Context7**: Proporciona documentación actualizada y ejemplos de código para bibliotecas y frameworks.
- **Puppeteer**: Permite la automatización de navegadores web para realizar tareas como scraping o testing.
- **Sequential Thinking**: Ayuda a los modelos de IA a resolver problemas complejos paso a paso.
- **GitHub**: Proporciona acceso a la API de GitHub para interactuar con repositorios, issues, PRs, etc.

## Configuración de GitHub MCP

Para utilizar el servidor MCP de GitHub, necesitas configurar un token de acceso personal:

1. Crea un token en GitHub: https://github.com/settings/tokens
2. Configura la variable de entorno `GITHUB_TOKEN` en tu sistema:
   ```bash
   export GITHUB_TOKEN="tu_token_aquí"
   ```

## Licencia

MIT
