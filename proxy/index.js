import { WebSocketServer } from "ws";
import net from "net";
import http from "http";

const IRC_HOST = process.env.IRC_HOST || "127.0.0.1";
const IRC_PORT = Number(process.env.IRC_PORT || 6667);

const server = http.createServer((req, res) => {
  // CORS for local frontend dev server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

server.listen(3001, "0.0.0.0", () => {
  console.log("HTTP + WS server listening on http://0.0.0.0:3001");
});

wss.on("connection", (ws) => {
  console.log("Web client connected");

  const irc = net.createConnection({
    host: IRC_HOST,
    port: IRC_PORT,
  });

  irc.on("connect", () => {
    console.log(`Connected to IRC ${IRC_HOST}:${IRC_PORT}`);
  });

  ws.on("message", (msg) => {
    if (!irc.destroyed) {
      irc.write(msg.toString() + "\r\n");
    }
  });

  irc.on("data", (data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(data.toString());
    }
  });

  irc.on("error", (err) => {
    console.error("IRC socket error:", err.message);
    if (ws.readyState === ws.OPEN) ws.close();
  });

  ws.on("close", () => {
    if (!irc.destroyed) irc.end();
  });

  irc.on("close", () => {
    if (ws.readyState === ws.OPEN) ws.close();
  });
});