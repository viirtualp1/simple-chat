# Simple Chat

Real-time chat app built with **Vue 3 + Quasar + Pinia + TypeScript**.  

Frontend follows **Feature-Sliced Design (FSD)**

WebSocket client is layered (transport → connection manager → protocol → message bus)

> **Production deploy:** frontend on **[Vercel](https://vercel.com)**, WebSocket server on **[Render](https://render.com)**.

---

## Local development

### Prerequisites

- Node.js 20+
- npm

### Frontend

```bash
npm install
cp .env.example .env
# VITE_WS_URL=ws://localhost:8080
npm run dev
```

### WebSocket server

```bash
cd simple-chat-server
npm install
npm run dev
```

Server listens on port **8080** by default (`PORT` env on Render).

---

## Architecture

### Feature-Sliced Design

Code is split into layers by responsibility:


| Domain                                  | Layer      | Slice          |
| --------------------------------------- | ---------- | -------------- |
| Chat store, message types, list item UI | `entities` | `chat`         |
| Filter state (search, sort)             | `entities` | `chat-filter`  |
| Search / sort logic                     | `features` | `filter-chats` |
| Select chat, mark as read               | `features` | `select-chat`  |
| Send message                            | `features` | `send-message` |
| Contacts sidebar                        | `widgets`  | `chat-sidebar` |
| Chat panel                              | `widgets`  | `chat-window`  |
| WS client                               | `shared`   | `ws`           |


---

### WebSocket client

UI and Pinia stores **do not use raw `WebSocket`**. The client in `shared/ws/` is built in layers:

```txt
┌─────────────────────────────┐
│  UI / Pinia (entities/chat) │  subscribe via wsIntegration
├─────────────────────────────┤
│  Message Bus                │  pub/sub: wsClient.on('chat.message')
├─────────────────────────────┤
│  Protocol                   │  envelope { type, id, payload, timestamp }
├─────────────────────────────┤
│  Connection Manager         │  reconnect, heartbeat, offline queue
├─────────────────────────────┤
│  Transport                  │  WebSocket wrapper
└─────────────────────────────┘
```

**Connection Manager** handles:

- Exponential backoff + jitter on reconnect
- Ping/pong heartbeat
- `online` / `offline` detection
- Message queue while disconnected
- Visibility API (slower heartbeat when tab is hidden)

---

## Responsive layout


| Breakpoint                | Behavior                                                           |
| ------------------------- | ------------------------------------------------------------------ |
| Desktop (≥1024px)         | Sidebar + chat side by side                                        |
| Mobile / tablet (<1024px) | Fullscreen contacts → tap opens chat → back button returns to list |


---

## Tech stack

- **Vue 3** (Composition API, `<script setup>`)
- **Quasar 2**
- **Pinia**
- **TypeScript**
- **Vue Router** (hash mode)
- **ws** (Node WebSocket server)
- **Zod**, **date-fns**, **@vueuse/core**

---

## License

ISC (server) / project defaults — see package files.