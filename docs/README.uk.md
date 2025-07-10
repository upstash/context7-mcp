# Context7 MCP — Актуальна документація з прикладами коду для будь-якого запиту

[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithery badge](https://smithery.ai/badge/@upstash/context7-mcp)](https://smithery.ai/server/@upstash/context7-mcp) [<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Context7%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)

[![繁體中文](https://img.shields.io/badge/docs-繁體中文-yellow)](./README.zh-TW.md) [![简体中文](https://img.shields.io/badge/docs-简体中文-yellow)](./README.zh-CN.md) [![日本語](https://img.shields.io/badge/docs-日本語-b7003a)](./README.ja.md) [![한국어 문서](https://img.shields.io/badge/docs-한국어-green)](./README.ko.md) [![Documentación en Español](https://img.shields.io/badge/docs-Español-orange)](./README.es.md) [![Documentation en Français](https://img.shields.io/badge/docs-Français-blue)](./README.fr.md) [![Documentação em Português (Brasil)](<https://img.shields.io/badge/docs-Português%20(Brasil)-purple>)](./README.pt-BR.md) [![Documentazione in italiano](https://img.shields.io/badge/docs-Italian-red)](./README.it.md) [![Dokumentasi Bahasa Indonesia](https://img.shields.io/badge/docs-Bahasa%20Indonesia-pink)](./README.id-ID.md) [![Dokumentation auf Deutsch](https://img.shields.io/badge/docs-Deutsch-darkgreen)](./README.de.md) [![Документация на русском языке](https://img.shields.io/badge/docs-Русский-darkblue)](./README.ru.md) [![Українська документація](https://img.shields.io/badge/docs-Українська-lightblue)](./README.uk.md) [![Türkçe Doküman](https://img.shields.io/badge/docs-Türkçe-blue)](./README.tr.md) [![Arabic Documentation](https://img.shields.io/badge/docs-Arabic-white)](./README.ar.md)

## ❌ Без Context7

Великі мовні моделі покладаються на застарілу або узагальнену інформацію про бібліотеки, які ви використовуєте. Внаслідок цього ви отримуєте:

- ❌ Застарілі приклади коду, що базуються на даних навчання кількарічної давності
- ❌ «Галюцинації» — API, які взагалі не існують
- ❌ Узагальнені відповіді для старих версій пакунків

## ✅ З Context7

Context7 MCP отримує актуальну, специфічну для версії документацію та приклади коду безпосередньо з джерела — і вбудовує їх прямо у ваш промпт.

Додайте `use context7` до вашого запиту в Cursor:

\`\`\`txt
Create a Next.js middleware that checks for a valid JWT in cookies and redirects unauthenticated users to `/login`. use context7
\`\`\`

\`\`\`txt
Configure a Cloudflare Worker script to cache JSON API responses for five minutes. use context7
\`\`\`

Context7 завантажує свіжі приклади коду й документацію безпосередньо в контекст вашої великої мовної моделі.

- 1️⃣ Написуйте ваш промпт природно
- 2️⃣ Скажіть ШІ використати `use context7`
- 3️⃣ Отримайте робочі відповіді з кодом

Без перемикання між вкладками, без неіснуючих API та без застарілого коду.

## 📚 Додавання проєктів

Ознайомтеся з нашим [посібником з додавання проєктів](./adding-projects.md), щоб дізнатися, як додати (або оновити) ваші улюблені бібліотеки в Context7.

## 🛠️ Встановлення

### Системні вимоги

- Node.js ≥ v18.0.0
- Cursor, Windsurf, Claude Desktop або інший MCP-клієнт

<details>
<summary><b>Встановлення через Smithery</b></summary>

Для автоматичного встановлення Context7 MCP Server для будь-якого клієнта через [Smithery](https://smithery.ai/server/@upstash/context7-mcp):

\`\`\`bash
npx -y @smithery/cli@latest install @upstash/context7-mcp --client <CLIENT_NAME> --key <YOUR_SMITHERY_KEY>
\`\`\`

Ваш ключ Smithery можна знайти на [сторінці Smithery.ai](https://smithery.ai/server/@upstash/context7-mcp).

</details>

<details>
<summary><b>Встановлення в Cursor</b></summary>

Перейдіть до: `Settings` → `Cursor Settings` → `MCP` → `Add new global MCP server`

Рекомендується вставити наступну конфігурацію у файл `~/.cursor/mcp.json`. Також можна встановити для конкретного проєкту, створивши `.cursor/mcp.json` у теці проєкту. Детальніше див. у [документації Cursor MCP](https://docs.cursor.com/context/model-context-protocol).

> Починаючи з Cursor 1.0, ви можете просто натиснути кнопку встановлення нижче для миттєвої інсталяції.

#### Підключення до віддаленого сервера Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=context7&config=eyJ1cmwiOiJodHRwczovL21jcC5jb250ZXh0Ny5jb20vbWNwIn0%3D)

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
\`\`\`

#### Підключення до локального сервера Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=context7&config=eyJjb21tYW5kIjoibnB4IC15IEB1cHN0YXNoL2NvbnRleHQ3LW1jcCJ9)

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
\`\`\`

<details>
<summary>Альтернатива: використання Bun</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=context7&config=eyJjb21tYW5kIjoiYnVueCAteSBAdXBzdGFzaC9jb250ZXh0Ny1tY3AifQ%3D%3D)

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
\`\`\`

</details>

<details>
<summary>Альтернатива: використання Deno</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=context7&config=eyJjb21tYW5kIjoiZGVubyBydW4gLS1hbGxvdy1lbnYgLS1hbGxvdy1uZXQgbnBtOkB1cHN0YXNoL2NvbnRleHQ3LW1jcCJ9)

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "command": "deno",
      "args": ["run", "--allow-env=NO_DEPRECATION,TRACE_DEPRECATION", "--allow-net", "npm:@upstash/context7-mcp"]
    }
  }
}
\`\`\`

</details>

</details>

<details>
<summary><b>Встановлення в Windsurf</b></summary>

Додайте це до вашого конфігураційного файлу Windsurf MCP. Детальніше див. у [документації Windsurf MCP](https://docs.windsurf.com/windsurf/mcp).

#### Підключення до віддаленого сервера Windsurf

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/sse"
    }
  }
}
\`\`\`

#### Підключення до локального сервера Windsurf

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
\`\`\`

</details>

## 🔨 Доступні інструменти

Context7 MCP надає наступні інструменти, які можуть використовувати великі мовні моделі:

- `resolve-library-id`: Перетворює загальну назву бібліотеки на сумісний з Context7 ідентифікатор бібліотеки.
  - `libraryName` (обов'язково): Назва бібліотеки для пошуку

- `get-library-docs`: Отримує документацію для бібліотеки, використовуючи сумісний з Context7 ідентифікатор бібліотеки.
  - `context7CompatibleLibraryID` (обов'язково): Точний сумісний з Context7 ідентифікатор бібліотеки (наприклад, `/mongodb/docs`, `/vercel/next.js`)
  - `topic` (необов'язково): Сфокусувати документацію на конкретній темі (наприклад, "routing", "hooks")
  - `tokens` (необов'язково, за замовчуванням 10000): Максимальна кількість токенів для повернення

## 🛟 Поради

### Додайте правило

> Якщо ви не хочете додавати `use context7` до кожного промпту, ви можете визначити просте правило у вашому файлі `.windsurfrules` в Windsurf або в розділі `Cursor Settings > Rules` в Cursor, щоб автоматично викликати Context7 для будь-яких запитань про код:
> 
> \`\`\`toml
> [[calls]]
> match = "when the user requests code examples, setup or configuration steps, or library/API documentation"
> tool  = "context7"
> \`\`\`

### Використовуйте ідентифікатор бібліотеки

> Якщо ви вже точно знаєте, яку бібліотеку хочете використовувати, додайте її ідентифікатор Context7 до вашого промпту:
> 
> \`\`\`txt
> implement basic authentication with supabase. use library /supabase/supabase for api and docs
> \`\`\`

## 💻 Розробка

Склонуйте проєкт і встановіть залежності:

\`\`\`bash
bun i
\`\`\`

Збирання:

\`\`\`bash
bun run build
\`\`\`

Запуск сервера:

\`\`\`bash
bun run dist/index.js
\`\`\`

### Аргументи командного рядка

`context7-mcp` приймає наступні прапори CLI:

- `--transport <stdio|http|sse>` — Транспорт для використання (`stdio` за замовчуванням).
- `--port <number>` — Порт для прослуховування при використанні транспорту `http` або `sse` (за замовчуванням `3000`).

## 🚨 Усунення несправностей

<details>
<summary><b>Помилки "Module Not Found"</b></summary>

Якщо ви стикаєтеся з `ERR_MODULE_NOT_FOUND`, спробуйте використовувати `bunx` замість `npx`:

\`\`\`json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
\`\`\`

</details>

## ⚠️ Застереження

Проєкти Context7 створюються спільнотою, і хоча ми прагнемо підтримувати високу якість, ми не можемо гарантувати точність, повноту або безпеку всієї документації бібліотек.

## 🤝 Зв'яжіться з нами

Залишайтеся в курсі подій і приєднуйтеся до нашої спільноти:

- 📢 Слідкуйте за нами в [X](https://x.com/contextai)
- 🌐 Відвідайте наш [веб-сайт](https://context7.com)
- 💬 Приєднуйтеся до нашої [спільноти Discord](https://upstash.com/discord)

## 📄 Ліцензія

MIT