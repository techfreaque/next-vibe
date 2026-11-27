# Coding Agents

One unified toolset for both human interactive coding sessions and named, persistent sub-agents.

- **One-shot / interactive (Claude Code, OpenCode, Codex, Antigravity):** pass a prompt directly, or pass `--interactiveMode=true` to launch a live terminal window that reports back when finished.
- **Named persistent agents (Codex, Antigravity):** pass an agent name and `--prompt` / `--promptFile`. Reuse the same name to resume the conversation; steer a running turn mid-flight with `coding-agent-say`; stop a turn with `coding-agent-interrupt`; inspect active and saved agents plus recent transcripts with `coding-agent-list`.

```bash
# One-shot or interactive session
vibe coding-agent "Fix the failing login test and run the suite"
vibe coding-agent "Refactor the billing module" --interactiveMode=true

# Named persistent sub-agents (Codex default for new names, or --provider=antigravity)
vibe coding-agent fix-login --promptFile=.tmp/briefs/fix-login.md
vibe coding-agent review-login --provider=antigravity --prompt="Review the login flow"

# Mid-turn steering, status + transcript tail, and interrupt
vibe coding-agent-say fix-login --message="Also cover the logout path"
vibe coding-agent-say review-login --message="Focus on OAuth callbacks only"
vibe coding-agent-list
vibe coding-agent-list review-login --lines=20
vibe coding-agent-interrupt review-login
```

Short aliases `subagent-run`, `agent-say`, `agent-list`, `agent-status` and `agent-interrupt` also point to these endpoints.

## Resuming and Fresh Starts

After a turn ends, run the same name with a new prompt to resume. The saved provider, model, effort, sandbox and working directory carry over. Pass `--fresh` to start a new conversation, including when switching providers.

Put the task, file scope, constraints and verification in the brief. New Codex and Antigravity conversations receive [the shared preamble](preamble.md). Use `--cwd` to choose the working directory. Providers inherit the caller's environment and sign-in.

## Providers

- **Claude Code** (`claude-code`, default for unnamed calls): uses the `claude` CLI in batch (`-p`) or interactive terminal mode with automatic `complete-task` revival.
- **OpenCode** (`open-code`): uses the `opencode` CLI in batch (`opencode run`) or interactive TUI mode.
- **Codex** (`codex`, default for new named agents): starts `codex app-server` per turn over JSON-RPC stdio. Mid-turn `coding-agent-say` calls `turn/steer`; `coding-agent-interrupt` calls `turn/interrupt`. Defaults to `gpt-6.2-sol`, `high` reasoning effort and `workspace-write` sandbox. Override with `--model`, `--effort`, `--sandbox`, or env `CODEX_MODEL` / `CODEX_EFFORT`. Set `PCV_CODEX_BIN` to an absolute executable path to override discovery.
- **Antigravity** (`antigravity`): uses `agy acp` (Agent Client Protocol JSON-RPC stdio server) and defaults to Gemini 4 Neon High (`gemini-4-neon-high`). Use `agy models` to list model IDs and `--model` / `--effort` to override. First-time sign-in is available via `agy acp --login`. Mid-turn `coding-agent-say` sends a concurrent `session/prompt` on the active ACP session without aborting an in-progress tool call or losing context. `coding-agent-interrupt` sends `session/cancel`, and subsequent runs resume via `session/resume`. The runner passes `--dangerously-skip-permissions`. Set `PCV_AGY_BIN` to an absolute executable path to override discovery.
- **MCP:** `vibe setup` merges the shared Antigravity CLI config at `~/.gemini/config/mcp_config.json` alongside `.mcp.json`, `.codex/config.toml`, and `opencode.json`.

## State & Transcripts

Persistent agent state lives in `~/.cache/pcv-subagents` (override with `PCV_SUBAGENTS_HOME`). Each agent's folder under `agents/<name>/` stores `meta.json` and `transcript.md` (plus `codex.log` or `agy-usage.jsonl`). Running agents publish a loopback TCP control channel in `running/<name>.json` for the lifetime of the turn.
