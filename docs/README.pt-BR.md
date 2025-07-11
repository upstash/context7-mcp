# Context7 MCP - Documentação Atualizada Para Qualquer Prompt

[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithery badge](https://smithery.ai/badge/@upstash/context7-mcp)](https://smithery.ai/server/@upstash/context7-mcp) [<img alt="Instalar no VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Context7%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)

[![中文文档](https://img.shields.io/badge/docs-中文版-yellow)](./docs/README.zh-CN.md) [![한국어 문서](https://img.shields.io/badge/docs-한국어-green)](./docs/README.ko.md) [![Documentación en Español](https://img.shields.io/badge/docs-Español-orange)](./docs/README.es.md) [![Documentation en Français](https://img.shields.io/badge/docs-Français-blue)](./docs/README.fr.md)

## ❌ Sem o Context7

Os LLMs dependem de informações desatualizadas ou genéricas sobre as bibliotecas que você usa. Você obtém:

- ❌ Exemplos de código desatualizados e baseados em dados de treinamento de anos atrás
- ❌ APIs alucinadas que nem existem
- ❌ Respostas genéricas para versões antigas de pacotes

## ✅ Com o Context7

O Context7 MCP extrai documentação e exemplos de código atualizados e específicos para cada versão diretamente da fonte — e os coloca diretamente em seu prompt.

Adicione `use context7` ao seu prompt no Cursor:

```txt
Create a basic Next.js project with app router. use context7
```

```txt
Create a script to delete the rows where the city is "" given PostgreSQL credentials. use context7
```

O Context7 busca exemplos de código e documentação atualizados diretamente para o contexto do seu LLM.

- 1️⃣ Escreva seu prompt naturalmente
- 2️⃣ Diga ao LLM para `use context7`
- 3️⃣ Obtenha respostas com código funcional

Sem alternar entre abas, sem APIs alucinadas que não existem, sem gerações de código desatualizadas.

## 🛠️ Primeiros Passos

### Requisitos

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop ou outro Cliente MCP

### Instalando via Smithery

Para instalar o Servidor Context7 MCP para Claude Desktop automaticamente via [Smithery](https://smithery.ai/server/@upstash/context7-mcp):

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### Instalar no Cursor

Vá para: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Colar a seguinte configuração no seu arquivo Cursor `~/.cursor/mcp.json` é a abordagem recomendada. Veja a [documentação do Cursor MCP](https://docs.cursor.com/context/model-context-protocol) para mais informações.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

<details>
<summary>Alternativa: Usar Bun</summary>

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

</details>

<details>
<summary>Alternativa: Usar Deno</summary>

```json
{
  "mcpServers": {
    "context7": {
      "command": "deno",
      "args": ["run", "--allow-net", "npm:@upstash/context7-mcp"]
    }
  }
}
```

</details>

### Instalar no Windsurf

Adicione isto ao seu arquivo de configuração MCP do Windsurf. Veja a [documentação do Windsurf MCP](https://docs.windsurf.com/windsurf/mcp) para mais informações.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Instalar no VS Code

[<img alt="Instalar no VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Context7%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)
[<img alt="Instalar no VS Code Insiders (npx)" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Context7%20MCP&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)

Adicione isto ao seu arquivo de configuração MCP do VS Code. Veja a [documentação do VS Code MCP](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) para mais informações.

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Instalar no Zed

Pode ser instalado via [Extensões do Zed](https://zed.dev/extensions?query=Context7) ou você pode adicionar isto ao seu `settings.json` do Zed. Veja a [documentação de Servidores de Contexto do Zed](https://zed.dev/docs/assistant/context-servers) para mais informações.

```json
{
  "context_servers": {
    "Context7": {
      "command": {
        "path": "npx",
        "args": ["-y", "@upstash/context7-mcp@latest"]
      },
      "settings": {}
    }
  }
}
```

### Instalar no Claude Code

Execute este comando. Veja a [documentação do Claude Code MCP](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials#set-up-model-context-protocol-mcp) para mais informações.

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### Instalar no Claude Desktop

Adicione isto ao seu arquivo `claude_desktop_config.json` do Claude Desktop. Veja a [documentação do Claude Desktop MCP](https://modelcontextprotocol.io/quickstart/user) para mais informações.

```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Instalação no Copilot Coding Agent

Adicione a seguinte configuração à seção `mcp` do seu arquivo de configuração do Copilot Coding Agent (Repository->Settings->Copilot->Coding agent->MCP configuration):

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "tools": [
        "get-library-docs",
        "resolve-library-id"
      ]
    }
  }
}
```

Para mais informações, consulte a [documentação oficial do GitHub](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp).

### Usando Docker

Se você preferir executar o servidor MCP em um contêiner Docker:

1.  **Construa a Imagem Docker:**

    Primeiro, crie um `Dockerfile` na raiz do projeto (ou onde preferir):

    <details>
    <summary>Clique para ver o conteúdo do Dockerfile</summary>

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    # Instala a versão mais recente globalmente
    RUN npm install -g @upstash/context7-mcp@latest

    # Expõe a porta padrão se necessário (opcional, depende da interação do cliente MCP)
    # EXPOSE 3000

    # Comando padrão para executar o servidor
    CMD ["context7-mcp"]
    ```

    </details>

    Em seguida, construa a imagem usando uma tag (por exemplo, `context7-mcp`). **Certifique-se de que o Docker Desktop (ou o daemon do Docker) esteja em execução.** Execute o seguinte comando no mesmo diretório onde você salvou o `Dockerfile`:

    ```bash
    docker build -t context7-mcp .
    ```

2.  **Configure Seu Cliente MCP:**

    Atualize a configuração do seu cliente MCP para usar o comando Docker.

    _Exemplo para um cline_mcp_settings.json:_

    ```json
    {
      "mcpServers": {
        "Сontext7": {
          "autoApprove": [],
          "disabled": false,
          "timeout": 60,
          "command": "docker",
          "args": ["run", "-i", "--rm", "context7-mcp"],
          "transportType": "stdio"
        }
      }
    }
    ```

    _Nota: Este é um exemplo de configuração. Consulte os exemplos específicos para o seu cliente MCP (como Cursor, VS Code, etc.) mencionados anteriormente neste README para adaptar a estrutura (por exemplo, `mcpServers` vs `servers`). Além disso, certifique-se de que o nome da imagem em `args` corresponda à tag usada durante o comando `docker build`._

### Ferramentas Disponíveis

- `resolve-library-id`: Resolve um nome geral de biblioteca em um ID de biblioteca compatível com Context7.
  - `libraryName` (obrigatório)
- `get-library-docs`: Busca documentação para uma biblioteca usando um ID de biblioteca compatível com Context7.
  - `context7CompatibleLibraryID` (obrigatório)
  - `topic` (opcional): Concentra a documentação em um tópico específico (por exemplo, "routing", "hooks")
  - `tokens` (opcional, padrão 10000): Número máximo de tokens a retornar. Valores menores que 10000 são automaticamente aumentados para 10000.

## Desenvolvimento

Clone o projeto e instale as dependências:

```bash
bun i
```

Compilação:

```bash
bun run build
```

### Exemplo de Configuração Local

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["tsx", "/path/to/folder/context7-mcp/src/index.ts"]
    }
  }
}
```

### Testando com o MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## Solução de Problemas

### ERR_MODULE_NOT_FOUND

Se você vir este erro, tente usar `bunx` em vez de `npx`.

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Isso geralmente resolve problemas de resolução de módulos, especialmente em ambientes onde o `npx` não instala ou resolve pacotes adequadamente.

### Problemas de Resolução ESM

Se você encontrar um erro como: `Error: Cannot find module 'uriTemplate.js'` tente executar com a flag `--experimental-vm-modules`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "--node-options=--experimental-vm-modules", "@upstash/context7-mcp@1.0.6"]
    }
  }
}
```

### Erros do Cliente MCP

1. Tente remover `@latest` do nome do pacote.

2. Tente usar `bunx` como alternativa.

3. Tente usar `deno` como alternativa.

4. Certifique-se de estar usando o Node v18 ou superior para ter suporte nativo ao fetch com `npx`.

## Aviso Legal

Os projetos Context7 são contribuições da comunidade e, embora nos esforcemos para manter alta qualidade, não podemos garantir a precisão, completude ou segurança de toda a documentação da biblioteca. Os projetos listados no Context7 são desenvolvidos e mantidos por seus respectivos proprietários, não pelo Context7. Se você encontrar qualquer conteúdo suspeito, inadequado ou potencialmente prejudicial, use o botão "Report" na página do projeto para nos notificar imediatamente. Levamos todos os relatórios a sério e revisaremos o conteúdo sinalizado prontamente para manter a integridade e segurança de nossa plataforma. Ao usar o Context7, você reconhece que o faz por sua própria conta e risco.

## Context7 na Mídia

- [Better Stack: "Free Tool Makes Cursor 10x Smarter"](https://youtu.be/52FC3qObp9E)
- [Cole Medin: "This is Hands Down the BEST MCP Server for AI Coding Assistants"](https://www.youtube.com/watch?v=G7gK8H6u7Rs)
- [Income stream surfers: "Context7 + SequentialThinking MCPs: Is This AGI?"](https://www.youtube.com/watch?v=-ggvzyLpK6o)
- [Julian Goldie SEO: "Context7: New MCP AI Agent Update"](https://www.youtube.com/watch?v=CTZm6fBYisc)
- [JeredBlu: "Context 7 MCP: Get Documentation Instantly + VS Code Setup"](https://www.youtube.com/watch?v=-ls0D-rtET4)
- [Income stream surfers: "Context7: The New MCP Server That Will CHANGE AI Coding"](https://www.youtube.com/watch?v=PS-2Azb-C3M)

## Histórico de Estrelas

[![Star History Chart](https://api.star-history.com/svg?repos=upstash/context7&type=Date)](https://www.star-history.com/#upstash/context7&Date)

## Licença

MIT
