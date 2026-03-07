# Invest in unbottled.ai / next-vibe

**From $5,000 upward — [hi@unbottled.ai](mailto:hi@unbottled.ai)**

---

## The Market Signal

[OpenClaw](https://openclaw.ai) went from zero to 200k GitHub stars in three months — the fastest-growing open source project in recent memory. It proved the demand: people want an AI that _actually does things_, with no corporate filter deciding what's allowed.

It also proved the ceiling. Local CLI only. Accessed via WhatsApp or Telegram. No web UI, no multi-user, no role-based access control. A security audit found 512 vulnerabilities — 8 critical — exposing 30,000+ instances to remote takeover. It works for solo developers. It doesn't scale beyond that.

---

## What We Built Instead

### The Architecture: next-vibe

**[next-vibe](https://github.com/techfreaque/next-vibe)** is the framework. Its core idea: describe a feature once and every platform reads it natively.

A single `definition.ts` is the living contract — schemas, validation, UI, permissions, error types, translations, examples. The framework compiles it into:

**Web API · React UI · React Native · CLI · tRPC · AI Tool schema · MCP server · Remote Skills · Cron Tasks · Electron**

Not generated code that drifts apart. One contract. Change it once — the web form, the CLI flags, the AI function-calling schema, the mobile screen all update. Delete the folder — the feature ceases to exist everywhere at once.

Every feature is one self-contained folder:

```
contact/
  definition.ts   — contract: schemas, permissions, UI hints, error types
  repository.ts   — business logic and DB queries
  route.ts        — exposes to all platforms
  db.ts           — database schema, colocated
  widget.tsx      — custom UI if needed
  i18n/           — translations
```

No mental map required. An AI coding agent opens one folder, understands the full contract, and ships a correct change. This is how our AI admin (Thea) extends the platform autonomously today — and how Claude Code works on this codebase without breaking things.

**Security by design, not by accident.** Role-based access is defined in the contract — `allowedRoles` per endpoint, tool access scoped per character and user role at the framework level. The opposite of OpenClaw's bolt-on approach.

### The Products

**[unbottled.ai](https://unbottled.ai)** — the hosted consumer platform. 42 models (GPT-5.2, Claude, Gemini + genuinely uncensored options). Zero setup. User-controlled censorship. Full agent loop, characters with persistent memory, skills, cron tasks, multi-model comparison. No terminal access — safe by design for general users.

**next-vibe self-hosted** — the full power-user platform. Everything above plus terminal access, SSH, browser automation, Claude Code integration, and direct system access. Role-based tool permissions mean admins control exactly what each user or character can touch. The real OpenClaw alternative — multi-user, type-safe, and secure by design.

---

## The Comparison

|                          | OpenClaw            | next-vibe self-hosted       | unbottled.ai          |
| ------------------------ | ------------------- | --------------------------- | --------------------- |
| Setup                    | Local CLI           | Self-hosted                 | Zero setup            |
| Interface                | WhatsApp / Telegram | Web, Native, CLI, MCP       | Web, Native, CLI, MCP |
| Terminal / system access | Yes                 | Yes                         | No                    |
| Multi-user               | No                  | Yes                         | Yes                   |
| Role-based tool access   | No                  | Yes                         | Yes                   |
| Security model           | 512 vulns found     | Enforced at framework level | Hosted, managed       |
| Models                   | 1 at a time         | Any                         | 42+, switchable       |

OpenClaw proved the demand. We built the architecture — for both audiences.

---

## Why Now

The infrastructure is built. 18 months of foundational work. OpenClaw's audience is actively looking for something that scales beyond a solo developer's mac mini.

Investment goes toward user acquisition and the community layer — shared characters, public threads, forums — that creates the network effect moat.

**[hi@unbottled.ai](mailto:hi@unbottled.ai) · [unbottled.ai](https://unbottled.ai) · [github](https://github.com/techfreaque/next-vibe)**
