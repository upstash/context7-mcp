#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import { env as processEnv } from 'process';

// Función para probar un MCP
async function testMCP(name, command, args, env = {}) {
  console.log(`\n\n===== Probando MCP: ${name} =====`);
  console.log(`Comando: ${command} ${args.join(' ')}`);

  return new Promise((resolve) => {
    const childProcess = spawn(command, args, {
      env: { ...processEnv, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Configurar timeout para terminar el proceso después de 10 segundos
    const timeout = setTimeout(() => {
      console.log(`\n✅ ${name} se inició correctamente (detenido después de 10 segundos)`);
      childProcess.kill();
      resolve(true);
    }, 10000);

    // Manejar salida estándar
    childProcess.stdout.on('data', (data) => {
      console.log(`[${name} stdout]: ${data.toString().trim()}`);
    });

    // Manejar errores
    childProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output.includes('running') || output.includes('started') || output.includes('listening')) {
        console.log(`\n✅ ${name} se inició correctamente`);
        clearTimeout(timeout);
        childProcess.kill();
        resolve(true);
      } else {
        console.log(`[${name} stderr]: ${output}`);
      }
    });

    // Manejar cierre del proceso
    childProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`\n❌ ${name} falló con código de salida ${code}`);
        clearTimeout(timeout);
        resolve(false);
      }
    });

    // Manejar errores del proceso
    childProcess.on('error', (err) => {
      console.log(`\n❌ ${name} error: ${err.message}`);
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

// Función principal
async function main() {
  console.log('Iniciando pruebas de MCP para VS Code...');

  // Definir los MCP a probar
  const mcps = [
    {
      name: 'Context7',
      command: 'npx',
      args: ['-y', '@upstash/context7-mcp@latest']
    },
    {
      name: 'Puppeteer',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer']
    },
    {
      name: 'Sequential Thinking',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking']
    },
    {
      name: 'GitHub',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE'
      }
    }
  ];

  // Probar cada MCP
  const results = {};
  for (const mcp of mcps) {
    results[mcp.name] = await testMCP(mcp.name, mcp.command, mcp.args, mcp.env);
  }

  // Mostrar resumen
  console.log('\n\n===== Resumen de pruebas =====');
  for (const [name, success] of Object.entries(results)) {
    console.log(`${success ? '✅' : '❌'} ${name}: ${success ? 'Funcionando' : 'Falló'}`);
  }

  console.log('\n===== Descripción de cada MCP =====');
  console.log('Context7: Proporciona documentación actualizada y ejemplos de código para bibliotecas y frameworks.');
  console.log('Puppeteer: Permite la automatización de navegadores web para realizar tareas como scraping o testing.');
  console.log('Sequential Thinking: Ayuda a los modelos de IA a resolver problemas complejos paso a paso.');
  console.log('GitHub: Proporciona acceso a la API de GitHub para interactuar con repositorios, issues, PRs, etc.');
}

// Ejecutar el programa principal
main().catch(err => {
  console.error('Error en el programa principal:', err);
  process.exit(1);
});
