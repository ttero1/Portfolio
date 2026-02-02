import { WebSocketServer } from "ws";
import net from "net";

const IRC_HOST = process.env.IRC_HOST || "127.0.0.1";
const IRC_PORT = process.env.IRC_PORT || 6667;

const wss = new WebSocketServer({ port: 3001, host: "0.0.0.0" });

console.log("WebSocket proxy listening on ws://0.0.0.0:3001");

wss.on("connection", (ws) => {
  console.log("Web client connected");

  const irc = net.createConnection({
    host: IRC_HOST,
    port: IRC_PORT
  });

  ws.on("message", (msg) => {
    irc.write(msg.toString() + "\r\n");
  });

  irc.on("data", (data) => {
    ws.send(data.toString());
  });

  ws.on("close", () => irc.end());
  irc.on("close", () => ws.close());
});
