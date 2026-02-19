# Mission Control Dashboard

Next.js dashboard for managing AI agent teams, tasks, and real-time OpenClaw subagent sessions. Backed by Convex for live updates across all clients.

## Features

- **Team Hierarchy** — 5-layer AI agent escalation structure (L1 Engineer → L5 Editor) with per-agent status, session history, and cost tracking
- **OpenClaw Integration** — Spin up, steer, and kill subagent sessions via live API routes backed by Convex
- **Kanban Board** — Drag-and-drop task management across Recurring / Backlog / In Progress / Review / Done
- **Content Pipeline** — 6-stage workflow: Ideas → Scripting → Thumbnail → Filming → Editing → Published
- **Calendar** — Cron job visualization and scheduled event tracking
- **Memory System** — Searchable document store with category tagging
- **Real-time** — All state synced instantly via Convex subscriptions

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Convex** — real-time database and serverless mutations/queries
- **TailwindCSS** — dark mission-control theme
- **React** with hooks for local UI state

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sessions/spawn/route.ts   # POST → Convex createAgentSession
│   │   └── subagents/route.ts        # GET list / POST kill|steer
│   └── page.tsx
├── components/
│   ├── team/
│   │   ├── TeamBoard.tsx             # Main team view, handleSpinAgent
│   │   ├── OpenClawIntegration.ts    # fetch wrapper for all subagent ops
│   │   ├── AgentSessionList.tsx
│   │   └── TeamHierarchy.tsx
│   ├── dashboard/                    # Kanban board
│   ├── content/                      # Content pipeline
│   ├── calendar/
│   └── memory/
convex/
├── schema.ts                         # DB schema (team_members, agent_sessions, ...)
├── team.ts                           # getAgentSessions, createAgentSession, completeAgentSession
└── seedTeam.ts
```

## OpenClaw API Routes

### `POST /api/sessions/spawn`
Spin up a new agent session.

```json
// Request
{ "agentId": "<team_member_id>", "taskTitle": "...", "priority": "medium" }

// Response
{ "sessionId": "<agent_session_id>", "status": "running" }
```

### `GET /api/subagents?action=list`
Returns all currently running sessions.

### `POST /api/subagents`
```json
// Kill a session
{ "action": "kill", "target": "<sessionId>" }

// Steer a session
{ "action": "steer", "target": "<sessionId>", "message": "..." }
```

## Getting Started

### 1. Install

```bash
git clone https://github.com/kunekune/mission-control-dashboard
cd mission-control-dashboard
npm install
```

### 2. Set up Convex

```bash
npx convex dev
# Copy the deployment URL shown in the terminal
```

### 3. Configure environment

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run

```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

```bash
# Deploy Convex backend
npx convex deploy

# Deploy frontend (Vercel)
vercel --prod
# Set NEXT_PUBLIC_CONVEX_URL in Vercel environment variables
```

## License

MIT
