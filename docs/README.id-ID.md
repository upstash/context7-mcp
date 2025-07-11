# Context7 MCP - Dokumentasi Ter-Update Untuk Setiap Prompt

[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithery badge](https://smithery.ai/badge/@upstash/context7-mcp)](https://smithery.ai/server/@upstash/context7-mcp) [<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Context7%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)

[![中文文档](https://img.shields.io/badge/docs-中文版-yellow)](./README.zh-CN.md) [![한국어 문서](https://img.shields.io/badge/docs-한국어-green)](./README.ko.md) [![Documentación en Español](https://img.shields.io/badge/docs-Español-orange)](./README.es.md) [![Documentation en Français](https://img.shields.io/badge/docs-Français-blue)](./README.fr.md) [![Documentação em Português (Brasil)](<https://img.shields.io/badge/docs-Português%20(Brasil)-purple>)](./README.pt-BR.md) [![Dokumentasi Bahasa Indonesia](https://img.shields.io/badge/docs-Bahasa%20Indonesia-red)](./README.id-ID.md)

## ❌ Tanpa Context7

LLM mengandalkan informasi yang sudah lama atau umum tentang library yang Anda gunakan, bukan yang terbaru.

Hasilnya anda akan mendapatkan:

- ❌ Contoh kode sudah usang dan berdasarkan data pelatihan yang sudah lama
- ❌ API yang dikarang yang sebetulnya tidak ada sama sekali
- ❌ Jawaban umum untuk versi paket lama

## ✅ Dengan Context7

Context7 MCP mengambil dokumentasi dan contoh kode terkini, spesifik versi langsung dari sumbernya — dan menempatkannya langsung ke dalam prompt Anda.

Tambahkan `gunakan context7` ke prompt Anda di Cursor:

```txt
Buat proyek Next.js dasar dengan app router. gunakan context7
```

```txt
Buat skrip untuk menghapus baris di mana kota adalah "" berdasarkan kredensial PostgreSQL. gunakan context7
```

Context7 mengambil contoh kode dan dokumentasi terkini langsung ke dalam konteks LLM Anda.

- 1️⃣ Tulis prompt Anda secara natural
- 2️⃣ Beri tahu LLM untuk `use context7`
- 3️⃣ Dapatkan jawaban dengan kode yang berfungsi

Tidak perlu beralih tab, tidak ada API yang dikarang yang sebetulnya tidak ada sama sekali, tidak akan menghasilkan kode yang usang.

## 🛠️ Memulai

### Persyaratan

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop atau MCP Client lainnya

### Instalasi melalui Smithery

Untuk menginstal Context7 MCP Server untuk Claude Desktop secara otomatis melalui [Smithery](https://smithery.ai/server/@upstash/context7-mcp):

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### Instalasi di Cursor

Buka: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Tambahkan konfigurasi berikut ke dalam file Cursor `~/.cursor/mcp.json` Anda adalah pendekatan yang direkomendasikan. Lihat [Dokumentasi Cursor MCP](https://docs.cursor.com/context/model-context-protocol) untuk informasi lebih lanjut.

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
<summary>Alternatif: Menggunakan Bun</summary>

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
<summary>Alternatif: Menggunakan Deno</summary>

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

### Instalasi di Windsurf

Tambahkan ini ke file konfigurasi MCP Windsurf Anda. Lihat [Dokumentasi Windsurf MCP](https://docs.windsurf.com/windsurf/mcp) untuk informasi lebih lanjut.

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

### Instalasi di VS Code

[<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Context7%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)
[<img alt="Install in VS Code Insiders (npx)" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Context7%20MCP&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)

Tambahkan ini ke file konfigurasi MCP VS Code Anda. Lihat [Dokumentasi VS Code MCP](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) untuk informasi lebih lanjut.

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

### Instalasi di Zed

Dapat diinstal melalui [Ekstensi Zed](https://zed.dev/extensions?query=Context7) atau Anda dapat menambahkan ini ke `settings.json` Zed Anda. Lihat [Dokumentasi Zed Context Server](https://zed.dev/docs/assistant/context-servers) untuk informasi lebih lanjut.

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

### Instalasi di Claude Code

Jalankan perintah ini. Lihat [Dokumentasi Claude Code MCP](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials#set-up-model-context-protocol-mcp) untuk informasi lebih lanjut.

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### Instalasi di Claude Desktop

Tambahkan ini ke file `claude_desktop_config.json` Claude Desktop Anda. Lihat [Dokumentasi Claude Desktop MCP](https://modelcontextprotocol.io/quickstart/user) untuk informasi lebih lanjut.

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

### Instalasi di Copilot Coding Agent

Tambahkan konfigurasi berikut ke bagian `mcp` pada file konfigurasi Copilot Coding Agent Anda (Repository->Settings->Copilot->Coding agent->MCP configuration):

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

Untuk informasi lebih lanjut, lihat [dokumentasi resmi GitHub](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp).

### Menggunakan Docker

Jika Anda lebih suka menjalankan server MCP dalam kontainer Docker:

1.  **Membuat Image Docker:**

    Pertama, buat `Dockerfile` di root proyek (atau di mana pun Anda suka):

    <details>
    <summary>Klik untuk melihat konten Dockerfile</summary>

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    # Instal versi terbaru secara global
    RUN npm install -g @upstash/context7-mcp@latest

    # Ekspos port default jika diperlukan (opsional, tergantung pada interaksi klien MCP)
    # EXPOSE 3000

    # Perintah default untuk menjalankan server
    CMD ["context7-mcp"]
    ```

    </details>

    Kemudian, buat image menggunakan tag (misalnya, `context7-mcp`). **Pastikan Docker Desktop (atau daemon Docker) sedang berjalan.** Jalankan perintah berikut di direktori yang sama di mana Anda menyimpan `Dockerfile`:

    ```bash
    docker build -t context7-mcp .
    ```

2.  **Konfigurasi MCP Client Anda:**

    Perbarui konfigurasi MCP client Anda untuk menggunakan perintah Docker.

    _Contoh untuk cline_mcp_settings.json:_

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

    _Catatan: Ini adalah contoh konfigurasi. Silakan merujuk ke contoh spesifik untuk MCP client Anda (seperti Cursor, VS Code, dll.) sebelumnya dalam README ini untuk menyesuaikan struktur (misalnya, `mcpServers` vs `servers`). Juga, pastikan nama image di `args` cocok dengan tag yang digunakan selama perintah `docker build`._

### Alat yang Tersedia

- `resolve-library-id`: Menyelesaikan nama library umum menjadi ID library yang kompatibel dengan Context7.
  - `libraryName` (wajib)
- `get-library-docs`: Mengambil dokumentasi untuk library menggunakan ID library yang kompatibel dengan Context7.
  - `context7CompatibleLibraryID` (wajib)
  - `topic` (opsional): Fokuskan dokumentasi pada topik tertentu (misalnya, "routing", "hooks")
  - `tokens` (opsional, default 10000): Jumlah maksimum token yang akan dihasilkan. Nilai kurang dari 10000 secara otomatis ditingkatkan menjadi 10000.

## Pengembangan

Kloning proyek dan instal dependensi:

```bash
bun i
```

Build:

```bash
bun run build
```

### Contoh Konfigurasi Lokal

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

### Pengujian dengan MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## Pemecahan Masalah

### ERR_MODULE_NOT_FOUND

Jika Anda melihat kesalahan ini, coba gunakan `bunx` sebagai pengganti `npx`.

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

Ini sering menyelesaikan masalah resolusi modul, terutama di lingkungan di mana `npx` tidak menginstal atau menyelesaikan paket dengan benar.

### Masalah Resolusi ESM

Jika Anda mengalami kesalahan seperti: `Error: Cannot find module 'uriTemplate.js'` coba jalankan dengan flag `--experimental-vm-modules`:

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

### Kesalahan MCP Client

1. Coba hapus `@latest` dari nama paket.

2. Coba gunakan `bunx` sebagai alternatif.

3. Coba gunakan `deno` sebagai alternatif.

4. Pastikan Anda menggunakan Node v18 atau lebih tinggi untuk memiliki dukungan fetch native dengan `npx`.

## Disclaimer

Proyek Context7 adalah kontribusi komunitas dan meskipun kami berusaha untuk mempertahankan kualitas tinggi, kami tidak dapat menjamin keakuratan, kelengkapan, atau keamanan semua dokumentasi library. Proyek yang terdaftar di Context7 dikembangkan dan dikelola oleh pemiliknya masing-masing, bukan oleh Context7. Jika Anda menemukan konten yang mencurigakan, tidak pantas, atau berpotensi berbahaya, silakan gunakan tombol "Report" di halaman proyek untuk memberi tahu kami segera. Kami menganggap semua laporan dengan serius dan akan meninjau konten yang ditandai segera untuk menjaga integritas dan keamanan platform kami. Dengan menggunakan Context7, Anda mengakui bahwa Anda melakukannya atas kebijaksanaan dan risiko Anda sendiri.

## Context7 Di Media

- [Better Stack: "Free Tool Makes Cursor 10x Smarter"](https://youtu.be/52FC3qObp9E)
- [Cole Medin: "This is Hands Down the BEST MCP Server for AI Coding Assistants"](https://www.youtube.com/watch?v=G7gK8H6u7Rs)
- [Income stream surfers: "Context7 + SequentialThinking MCPs: Is This AGI?"](https://www.youtube.com/watch?v=-ggvzyLpK6o)
- [Julian Goldie SEO: "Context7: New MCP AI Agent Update"](https://www.youtube.com/watch?v=CTZm6fBYisc)
- [JeredBlu: "Context 7 MCP: Get Documentation Instantly + VS Code Setup"](https://www.youtube.com/watch?v=-ls0D-rtET4)
- [Income stream surfers: "Context7: The New MCP Server That Will CHANGE AI Coding"](https://www.youtube.com/watch?v=PS-2Azb-C3M)

## Grafik Riwayat Bintang

[![Star History Chart](https://api.star-history.com/svg?repos=upstash/context7&type=Date)](https://www.star-history.com/#upstash/context7&Date)

## Lisensi

MIT
