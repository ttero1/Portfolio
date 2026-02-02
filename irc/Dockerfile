
#irc
# ---------- BUILD STAGE ----------
FROM debian:bookworm AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN make

# ---------- RUNTIME STAGE ----------
FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /build/ircserv ./ircserv

EXPOSE 6667

CMD ["./ircserv", "6667", "password"]
