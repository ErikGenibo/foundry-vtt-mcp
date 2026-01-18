# Foundry MCP Bridge Connection Troubleshooting

## Issue Summary
The Foundry MCP Bridge module (v0.6.2) cannot establish a WebSocket connection to the MCP server.

## Environment
- **Foundry Access URL:** `http://69.220.156.78:30000/game` (public IP, HTTP)
- **MCP Server Config:** localhost:31415 (from `.mcp.json`)
- **Foundry Module Target:** `ws://192.168.1.64:31415/foundry-mcp` (LAN IP)
- **Platform:** Windows

## Error Logs (from Foundry F12 Console)
```
WebSocket connection to 'ws://192.168.1.64:31415/foundry-mcp' failed:
[foundry-mcp-bridge] Heartbeat: Connection lost
[foundry-mcp-bridge] Failed to start bridge: Error: WebSocket connection failed
⚠️ Lost connection to AI model - Auto-reconnect disabled
```

## Diagnostics Performed

### 1. TCP Port Check
```powershell
netstat -an | findstr 31415
# Result: TCP 0.0.0.0:31415 LISTENING - Server IS listening on all interfaces
```

### 2. Network Connectivity Test
```powershell
Test-NetConnection -ComputerName 192.168.1.64 -Port 31415
# Result: TcpTestSucceeded: True - Port IS reachable
```

### 3. MCP Server Status
- Claude can connect to MCP server process (via `/mcp` reconnect)
- MCP server returns error: "Foundry VTT module not connected"
- This confirms: Claude → MCP Server ✅, but MCP Server → Foundry ❌

## Architecture Understanding

```
┌─────────────────┐     stdio      ┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Claude Code   │ ◄────────────► │   MCP Server    │ ◄─────────────► │  Foundry VTT    │
│   (CLI)         │                │   (Node.js)     │                 │  (Browser)      │
└─────────────────┘                │   Port 31415    │                 │  MCP Bridge Mod │
                                   └─────────────────┘                 └─────────────────┘
```

- MCP Server listens on port 31415, namespace `/foundry-mcp`
- Foundry module (in browser) connects OUT to MCP Server via WebSocket
- Connection type: auto-detects WebRTC for HTTPS, WebSocket for HTTP

## Actual Network Topology (CORRECTED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HOME NETWORK (same LAN)                                                    │
│                                                                             │
│   ┌───────────────────────────┐         ┌───────────────────────────┐       │
│   │   LAPTOP (192.168.1.64)   │         │   DESKTOP (192.168.1.81)  │       │
│   │                           │         │                           │       │
│   │   - Claude Code           │         │   - Foundry VTT (:30000)  │       │
│   │   - MCP Server (:31415)   │         │                           │       │
│   │   - Browser ◄─────────────┼─────────┼── HTTP to Foundry         │       │
│   │       │                   │         │                           │       │
│   │       │ WebSocket to      │         │                           │       │
│   │       │ localhost:31415   │         │                           │       │
│   │       │ FAILING ✗         │         │                           │       │
│   │       ▼                   │         │                           │       │
│   │   MCP Server              │         │                           │       │
│   └───────────────────────────┘         └───────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Current situation:**
- Browser on laptop connects to Foundry on desktop (http://69.220.156.78:30000 or http://192.168.1.81:30000)
- MCP Bridge module in browser tries to connect to MCP server on SAME MACHINE (laptop) at ws://192.168.1.64:31415
- TCP connectivity confirmed working (Test-NetConnection succeeds)
- WebSocket connection still fails

**MCP Bridge Module Settings:**
- Connection type: auto
- Websocket server host: `192.168.1.64` (laptop - where MCP server runs)
- Allow write operations: checked

**Mystery:** Browser and MCP server are on the SAME machine (laptop), TCP works, but WebSocket fails.

## RESOLVED (2026-01-18)

**Connection is now working!**

The connection established during troubleshooting. Likely causes of the initial failure:
- MCP server wasn't fully started when Foundry module tried to connect
- Timing issue - module gave up before server was ready
- The `/mcp` reconnect in Claude Code may have restarted the MCP server properly

**Verified working:**
```
World: Big Damn Heroes
System: Pathfinder 2e v7.7.4
Foundry: v13.351
Users: 2 GMs active
```

**Key lesson:** If connection fails, try:
1. Reload Foundry (F5) to restart the MCP Bridge module
2. Run `/mcp` in Claude Code to reconnect the MCP server
3. Ensure MCP server is fully started before Foundry tries to connect

## Configuration Files

### .mcp.json
```json
{
  "mcpServers": {
    "foundry": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\egoos\\Chronicler\\foundry-mcp\\packages\\mcp-server\\dist\\index.js"],
      "env": {
        "FOUNDRY_HOST": "localhost",
        "FOUNDRY_PORT": "31415"
      },
      "cwd": "C:\\Users\\egoos\\Chronicler\\foundry-mcp\\packages\\mcp-server"
    }
  }
}
```

### MCP Server Defaults (config.ts)
- `host`: localhost (from env or default)
- `port`: 31415
- `namespace`: `/foundry-mcp`
- `connectionType`: auto

## Next Steps
1. Determine browser location (local vs remote)
2. If local: change Foundry module setting to use `localhost` instead of `192.168.1.64`
3. If remote: either run browser locally OR set up port forwarding for 31415

---
*Last updated: 2026-01-18*
