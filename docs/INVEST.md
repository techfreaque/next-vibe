# Invest in unbottled.ai / next-vibe

**Tickets from $5,000 - [hi@unbottled.ai](mailto:hi@unbottled.ai)**

---

## The Market Signal

[OpenClaw](https://openclaw.ai) hit 200k GitHub stars in three months. The demand is proven: people want an AI that _does things_, with no corporate filter deciding what's allowed.

The ceiling is proven too. Local CLI only. Driven through WhatsApp or Telegram. No web UI, no multi-user, no role-based access. A security audit found 512 vulnerabilities - 8 critical - and 30,000+ exposed instances. Great for one developer. Breaks past that.

---

## What We Built Instead

### The Architecture: next-vibe

**[next-vibe](https://github.com/techfreaque/next-vibe)** is the framework. One idea: describe a feature once, and every platform reads it natively.

A single `definition.ts` is the contract - schemas, validation, UI, permissions, error types, translations, examples. The framework turns it into:

**Web API · React UI · React Native · CLI · MCP server · AI tool schema · Cron jobs · Remote skills · tRPC · Electron · Embeddable widgets**

No generated code that drifts. Change the contract once - the web form, the CLI flags, the AI tool schema and the mobile screen all follow. Delete the folder - the feature is gone everywhere.

Every feature is one self-contained folder:

```text
contact/
  definition.ts   - contract: schemas, permissions, UI hints, error types
  repository.ts   - business logic and DB queries
  route.ts        - exposes it to every platform
  db.ts           - database schema, colocated
  widget.tsx      - custom UI for every platform
  i18n/           - translations (EN, DE, PL)
```

550+ features ship in this shape today. Strict TypeScript: no `any`, no casts. An AI coding agent opens one folder, sees the whole contract and ships a correct change. That is how Thea, our AI admin, extends the platform - and how Claude Code works on this codebase without breaking it.

**Security in the contract, not bolted on.** `allowedRoles` per endpoint. Tool access scoped per skill and per user role at the framework level. Every customer-facing endpoint is covered by end-to-end tests that drive the real page in a real browser.

### The Products

**[unbottled.ai](https://unbottled.ai)** - the hosted platform. Zero setup. 197 models across chat, image, video, music and voice - 113 of them chat models from Anthropic, OpenAI, Google, xAI, DeepSeek, Moonshot, Mistral, Meta and more. Every model carries a content level - **mainstream**, **open** or **uncensored** - and the user picks. Nobody filters for them. Agent loop, skills, persistent memory, scheduled tasks, web search, media generation. No terminal access - safe for general users.

**next-vibe self-hosted** - the full power-user platform. Everything above, plus terminal, SSH, browser automation, desktop control and a coding agent that hands real code changes to Claude Code or OpenCode - headless, or live in a terminal window. Bring your own API keys. No Docker required: it runs on embedded Postgres. Role-based tool permissions decide exactly what each user and skill can touch.

**Instances that work together.** Run next-vibe on your laptop and on a server, connect them, and they act as one system. Ours are Hermes (local) and Thea (cloud). Threads run across instances in both directions. Tools execute where they live. If the instance running a turn has no provider key, the caller takes the loop back and finishes it.

---

## The Comparison

|                          | OpenClaw            | next-vibe self-hosted       | unbottled.ai                    |
| ------------------------ | ------------------- | --------------------------- | ------------------------------- |
| Setup                    | Local CLI           | Self-hosted, no Docker      | Zero setup                      |
| Interface                | WhatsApp / Telegram | Web, Native, CLI, MCP       | Web, Native, CLI, MCP           |
| Terminal / system access | Yes                 | Yes                         | No                              |
| Multi-user               | No                  | Yes                         | Yes                             |
| Role-based tool access   | No                  | Yes                         | Yes                             |
| Content filtering        | Provider default    | Per model, user's choice    | Per model, user's choice        |
| Multi-instance           | No                  | Two-way remote threads      | Model provider for self-hosters |
| Security model           | 512 vulns found     | Enforced at framework level | Hosted, managed                 |

OpenClaw proved the demand. We built the architecture - for both audiences.

---

## How It Makes Money

**Credits, priced openly.** 1 credit = $0.01. Model costs pass through with a flat 30% markup.

- **Free:** 20 credits a month.
- **Subscription:** $8/month or $88/year - 800 credits a month.
- **Credit packs:** $5 for 500 credits.

**Referrals that compound.** Users earn 10% of every payment from people they refer - recurring, for as long as those people pay. A further 10% upline pool decays across five levels. Publish a skill and another member's link brings someone in: the skill creator earns 5% on top. At most 20% of any payment goes to referrals. Paid out in BTC or USDC from $40, or as credits.

**Self-hosting is free.** No license fee, no seat count. Self-hosters pay their providers directly - or connect to unbottled.ai and use it as their model provider.

---

## Open Source

Framework core under GPL-3.0 - improvements flow back. Everything else under MIT. The code is public on [GitHub](https://github.com/techfreaque/next-vibe). No vendor lock-in for anyone who builds on it.

---

## Why Now

The infrastructure is built. In development since March 2025. Production-grade: every customer-facing endpoint under end-to-end test, uncensored models sourced from Venice, NanoGPT, FreedomGPT and uncensored.ai, the model catalog current to this month.

OpenClaw's audience is looking for something that scales past one developer's Mac mini. We have it.

Investment goes into user acquisition and the community layer - shared skills, public threads, the skill economy - that turns users into a network-effect moat.

**[hi@unbottled.ai](mailto:hi@unbottled.ai) · [unbottled.ai](https://unbottled.ai) · [github](https://github.com/techfreaque/next-vibe)**
