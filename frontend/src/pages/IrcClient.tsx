import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function parseIRCMessage(line: string): string {
  const privmsg = line.match(/^[.:]?([^!]+)!([^\s]+) PRIVMSG ([^\s]+) ?:?(.*)$/);
  if (privmsg) {
    const [, nick, , target, message] = privmsg;
    if (target.startsWith("#")) return `<${nick}> ${message}`;
    return `[PM from ${nick}] ${message}`;
  }

  const join = line.match(/^:([^!]+)!.* JOIN :?(#\S+)/);
  if (join) return `→ ${join[1]} joined ${join[2]}`;

  const part = line.match(/^:([^!]+)!.* PART (#\S+)/);
  if (part) return `← ${part[1]} left ${part[2]}`;

  const quit = line.match(/^:([^!]+)!.* QUIT :?(.*)$/);
  if (quit) return `← ${quit[1]} quit`;

  const nick = line.match(/^:([^!]+)![^\s]+ NICK :?(.+)$/);
  if (nick) return `* ${nick[1]} is now known as ${nick[2]}`;

  const numeric = line.match(/^:([^ ]+) (\d{3}) (.+?)(?: :(.*))?$/);
  if (numeric) {
    const [, , code, params, message] = numeric;
    const text = message ?? params;
    return `[${code}] ${text}`;
  }

  const server = line.match(/^:[^ ]+ [A-Z]+ .* :(.*)$/);
  if (server) return server[1];

  if (line.startsWith("PING") || line.startsWith("PONG")) return "";
  return "";
}

export default function IrcClient() {
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  const [joinedChannels, setJoinedChannels] = useState<Set<string>>(new Set());

  // Nick is stateful
  const [myNick, setMyNick] = useState("webuser");
  const myNickRef = useRef(myNick);
  useEffect(() => {
    myNickRef.current = myNick;
  }, [myNick]);

  // Track registration state (true after 001)
  const [registered, setRegistered] = useState(false);
  const registeredRef = useRef(false);
  useEffect(() => {
    registeredRef.current = registered;
  }, [registered]);

  // Track nick request (UX)
  const pendingNickRef = useRef<string | null>(null);

  // Queue commands until registered
  const postRegisterQueueRef = useRef<string[]>([]);
  const enqueueOrSend = (cmd: string) => {
    const ws = wsRef.current;
    if (!ws) return;

    if (registeredRef.current) ws.send(cmd);
    else postRegisterQueueRef.current.push(cmd);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pickNextActive = (channels: Set<string>, current: string | null) => {
    if (current && channels.has(current)) return current;
    const it = channels.values().next();
    return it.done ? null : it.value;
  };

  useEffect(() => {
  let ws: WebSocket | null = null;
  let cancelled = false;

  async function start() {
    // Fetch runtime config served by the frontend container
    let cfg: any = {};
    try {
      const res = await fetch("/config.json", { cache: "no-store" });
      cfg = await res.json().catch(() => ({}));
    } catch {
      cfg = {};
    }

    // If wsUrl is empty/missing, fall back:
    // - localhost: ws://localhost:3001
    // - otherwise:  ws(s)://<frontend-host>
    const fallback =
      window.location.hostname === "localhost"
        ? "ws://localhost:3001"
        : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;

    const wsUrl =
      cfg.wsUrl && String(cfg.wsUrl).trim()
        ? String(cfg.wsUrl).trim()
        : fallback;

    if (cancelled) return;

    ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      // reset session state
      setRegistered(false);
      registeredRef.current = false;
      postRegisterQueueRef.current = [];
      setJoinedChannels(new Set());
      setActiveTarget(null);

      ws!.send("PASS password");
      ws!.send(`NICK ${myNickRef.current}`);
      ws!.send(`USER ${myNickRef.current} 0 b Web Client`);

      enqueueOrSend("JOIN #general");
    };

    ws.onmessage = (e) => {
      const raw = e.data as string;
      const lines = raw.split("\r\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("PING")) {
          ws!.send(line.replace("PING", "PONG"));
          continue;
        }

        // 001 => registered;
        const welcome001 = line.match(/^:[^ ]+\s+001\s+([^ ]+)\s+:/);
        if (welcome001) {
          const [, realNick] = welcome001;

          setRegistered(true);
          setMyNick(realNick);
          pendingNickRef.current = null;

          // flush queued commands (JOIN, etc.)
          const q = postRegisterQueueRef.current;
          postRegisterQueueRef.current = [];
          for (const cmd of q) wsRef.current?.send(cmd);

        }

        // Server confirms nick change:
        const nickChange = line.match(/^:([^!]+)![^\s]+ NICK :?(.+)$/);
        if (nickChange) {
          const [, oldNick, newNickRaw] = nickChange;
          const newNick = newNickRaw.trim();

          if (oldNick === myNickRef.current) {
            setMyNick(newNick);
            pendingNickRef.current = null;
          }
        }

        // 433 => nickname in use. Try a new one 
        const err433 = line.match(/^:[^ ]+ 433 ([^ ]+) ([^ ]+) :(.*)$/);
        if (err433) {
          const [, , badNick] = err433;

          const suffix = Math.floor(10 + Math.random() * 90); // 2 digits
          const newNick = `${badNick}${suffix}`;

          pendingNickRef.current = newNick;
          wsRef.current?.send(`NICK ${newNick}`);

          setMessages((prev) => [
            ...prev,
            `(!) Nick '${badNick}' is in use. Trying '${newNick}'...`,
          ]);

          continue;
        }

        // YOU JOINED a channel (server echo)
        const joinMatch = line.match(/^:([^!]+)![^\s]+\s+JOIN\s+:?(#\S+)/i);
        if (joinMatch) {
          const [, nick, channel] = joinMatch;

          if (nick === myNickRef.current) {
            setJoinedChannels((prev) => {
              const next = new Set(prev);
              next.add(channel);
              return next;
            });
            setActiveTarget(channel);
          }
        }

        // YOU PARTED a channel
        const partMatch = line.match(/^:([^!]+)![^\s]+\s+PART\s+(#\S+)/i);
        if (partMatch) {
          const [, nick, channel] = partMatch;

          if (nick === myNickRef.current) {
            setJoinedChannels((prev) => {
              const next = new Set(prev);
              next.delete(channel);
              setActiveTarget((current) =>
                pickNextActive(next, current === channel ? null : current)
              );
              return next;
            });
          }
        }

        // YOU QUIT
        const quitMatch = line.match(/^:([^!]+)![^\s]+\s+QUIT\b/i);
        if (quitMatch) {
          const [, nick] = quitMatch;

          if (nick === myNickRef.current) {
            setJoinedChannels(new Set());
            setActiveTarget(null);
            setRegistered(false);
            registeredRef.current = false;
            postRegisterQueueRef.current = [];
          }
        }

        // YOU GOT KICKED
        const kickMatch = line.match(/^:[^ ]+\s+KICK\s+(#\S+)\s+([^\s]+)/i);
        if (kickMatch) {
          const [, channel, nick] = kickMatch;

          if (nick === myNickRef.current) {
            setJoinedChannels((prev) => {
              const next = new Set(prev);
              next.delete(channel);
              setActiveTarget((current) =>
                pickNextActive(next, current === channel ? null : current)
              );
              return next;
            });
          }
        }

        const parsed = parseIRCMessage(line);
        if (parsed) setMessages((prev) => [...prev, parsed]);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onclose = () => {
      setRegistered(false);
      registeredRef.current = false;
      postRegisterQueueRef.current = [];
      setJoinedChannels(new Set());
      setActiveTarget(null);
    };
  }

  start().catch((err) => console.error("Failed to start WS:", err));

  return () => {
    cancelled = true;
    try {
      ws?.close();
    } catch {}
  };
}, []);

  

  const sendMessage = () => {
    const ws = wsRef.current;
    if (!ws || !input.trim()) return;

    if (input.startsWith("/")) {
      const cmd = input.slice(1).trim();

      // queue if not registered yet
      enqueueOrSend(cmd);

      // Track /NICK for UX (wait for server confirm)
      const nickCmd = cmd.match(/^NICK\s+(.+)$/i);
      if (nickCmd) pendingNickRef.current = nickCmd[1].trim();

      const joinCmd = cmd.match(/^JOIN\s+(#\S+)/i);
      if (joinCmd) setActiveTarget(joinCmd[1]);
    } else if (activeTarget) {
      enqueueOrSend(`PRIVMSG ${activeTarget} :${input}`);
      setMessages((prev) => [...prev, `<${myNickRef.current}> ${input}`]);
    } else {
      setMessages((prev) => [...prev, `(!) Join a channel first: try /JOIN #general`]);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        padding: 16,
        background: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "1px solid #333",
          height: 400,
          overflowY: "auto",
          padding: 8,
          marginBottom: 8,
          background: "#111",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

        

      <div style={{ color: "#888", marginBottom: 6, fontSize: 12 }}>
        Nick: {myNick}
        {pendingNickRef.current ? ` (changing to ${pendingNickRef.current}...)` : ""} |{" "}
        {registered ? "Registered" : "Registering..."} | Active: {activeTarget || "none"} | Joined:{" "}
        {joinedChannels.size ? Array.from(joinedChannels).join(", ") : "none"} | Use /command
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${activeTarget || "..."} (use /command for IRC)`}
          style={{
            flex: 1,
            padding: 8,
            background: "#111",
            color: "#0f0",
            border: "1px solid #333",
            fontFamily: "monospace",
          }}
        />
      </div>
      <button
          onClick={() => navigate("/")}
            style={{
            alignSelf: "flex-start",
            marginBottom: 10,
            padding: "6px 10px",
            background: "#111",
            color: "#0f0",
            border: "1px solid #333",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
          >
          ← Return to frontpage
        </button>
    </div>
  );
}

