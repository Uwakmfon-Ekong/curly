# curl→fetch

> Convert cURL commands to `fetch()` or `axios` instantly. No more manual translation.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- **Auto-converts as you type** — debounced, instant feedback
- **fetch() and axios** — toggle between both outputs
- **Smart JSON detection** — wraps body in `JSON.stringify()` automatically
- **Handles everything** — `-X`, `-H`, `-d`, `-u` (Basic Auth → Base64), `--data-raw`, `--data-binary`, `-A`, and more
- **Parsed breakdown** — shows method, URL, header count at a glance
- **Copy to clipboard** — one click
- **Keyboard shortcut** — `⌘ + Enter` to convert
- **Syntax highlighting** — color-coded output

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
curl-to-fetch/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main page (server component)
│   └── globals.css       # Global styles + syntax token classes
├── components/
│   ├── Converter.tsx     # Main converter UI (client component)
│   ├── CopyButton.tsx    # Copy to clipboard with feedback
│   ├── ModeToggle.tsx    # fetch / axios switcher
│   └── ParsedInfo.tsx    # Parsed cURL breakdown display
└── lib/
    ├── parser.ts         # cURL parser + code generators
    └── highlight.ts      # Syntax highlighter
```

## Supported cURL flags

| Flag | What it does |
|------|-------------|
| `-X`, `--request` | HTTP method |
| `-H`, `--header` | Request headers |
| `-d`, `--data`, `--data-raw`, `--data-binary` | Request body |
| `-u`, `--user` | Basic auth (auto-encodes to Base64) |
| `-A`, `--user-agent` | User-Agent header |
| `-e`, `--referer` | Referer header |
| `-L`, `-s`, `-k`, `-v`, `-i` | Silently ignored |

## Build for production

```bash
npm run build
npm start
```

## Deploy

Optimized for [Vercel](https://vercel.com) — just push and deploy:

```bash
vercel
```

Or deploy to any platform that supports Next.js.

## Tech Stack

- **Next.js 14** — App Router, server + client components
- **TypeScript** — fully typed
- **Tailwind CSS** — utility-first styling
- **JetBrains Mono + Syne** — fonts
- Zero external runtime dependencies for the converter logic
