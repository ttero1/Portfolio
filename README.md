# Portfolio IRC Demo

A small portfolio project that showcases a full IRC stack:

- **IRC server (C++20)** — a minimal RFC-style IRC implementation (42 ft_irc).
- **WebSocket proxy (Node.js)** — bridges browser WebSocket clients to the IRC TCP socket.
- **React frontend (Vite + Tailwind)** — a web IRC client UI.

The stack is orchestrated with Docker Compose for a one-command demo.

## Architecture

```
Browser (React) ──WS──> Proxy (Node, ws://:3001) ──TCP──> IRC Server (:6667)
```

- The frontend requests `/config.json` at runtime to learn the WebSocket URL.
- The Dockerized frontend writes `config.json` from `VITE_WS_URL` on container start.

## Quick start (Docker)

### Prerequisites

- Docker + Docker Compose

### Run the full stack

```bash
docker compose up --build
```

Services and ports (host → container):

- **IRC server**: `6667:6667` (password: `password`)
- **WebSocket proxy**: `3001:3001`
- **Frontend**: `5173:4173`

Open the UI at `http://localhost:5173` and connect using the UI. By default, the proxy uses the IRC server at `irc:6667` inside Docker.

### Configure the WebSocket URL

When running the frontend container, you can set `VITE_WS_URL` (e.g. `ws://localhost:3001` or `wss://your-domain`). Docker Compose does not set this by default; the frontend will fall back to `ws://localhost:3001` if `config.json` is empty.

Example:

```bash
VITE_WS_URL=ws://localhost:3001 docker compose up --build
```

## Local development (optional)

You can run each service directly on your host instead of Docker.

### IRC server

```bash
cd irc
make
./ircserv 6667 password
```

### WebSocket proxy

```bash
cd proxy
npm install
IRC_HOST=127.0.0.1 IRC_PORT=6667 node index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` and ensure the WebSocket URL points at `ws://localhost:3001`.

## Project structure

```
.
├── frontend/   # React + Vite web client
├── proxy/      # WebSocket → IRC TCP bridge (Node)
└── irc/        # C++20 IRC server
```

## Notes

- The IRC server enforces simple password rules (alphanumeric, 3–20 chars) and only accepts port `6660–6669` or `6697`.

See `irc/README.md` for detailed IRC server usage and supported commands.
