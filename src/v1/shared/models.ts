/**
 * Which chat models an API key's user may call. Single source: the same model
 * pool + per-user filtering the chat UI uses (provider availability, admin-only,
 * legacy -> successor).
 */

import "server-only";

import {
  type ChatModelOption,
  chatModelOptionsPool,
  ChatModelId,
  filterChatModels,
  resolveChatModelForUser,
} from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import { filterRoleModels, ApiProvider } from "next-vibe/agent/models/models";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

/** Text-in / text-out chat models only (no image/audio generators). */
function isTextChatModel(model: ChatModelOption): boolean {
  return model.inputs.includes("text") && model.outputs.includes("text");
}

/** The current (non-legacy) models this user can call right now. */
export function listUserChatModels(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  const pool = availability.unbottledForce
    ? chatModelOptionsPool.filter(
        (m) => m.apiProvider === ApiProvider.UNBOTTLED,
      )
    : chatModelOptionsPool;
  return filterRoleModels(pool, null, user, availability).filter(
    isTextChatModel,
  );
}

/**
 * One entry per model id, as GET /v1/models must list it. The pool holds one
 * option per provider route, so the same id can appear several times; each id
 * is reported as the variant a request with that id actually runs on.
 */
export function listUserCallableModels(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  const seen = new Set<string>();
  const models: ChatModelOption[] = [];
  for (const candidate of listUserChatModels(user, availability)) {
    if (seen.has(candidate.id)) {
      continue;
    }
    seen.add(candidate.id);
    const served = resolveExactModel(candidate.id, user, availability);
    models.push(served?.id === candidate.id ? served : candidate);
  }
  return models;
}

/**
 * How a request's model string is matched.
 * - openai: our id, or a vendor spelling of the same model
 *   (gpt-5.5 -> gpt-55, claude-sonnet-4-5-20250929 -> claude-sonnet-4.5).
 * - anthropic: the same, plus Claude Code's built-in Claude ids fall back to
 *   the newest Claude of that family this user can call, so Claude Code's
 *   background calls work without extra env vars.
 */
export type ModelResolveMode = "openai" | "anthropic";

const CLAUDE_FAMILIES = ["opus", "sonnet", "haiku", "fable"] as const;

/**
 * Spellings of the same model other clients send: date-stamped Anthropic ids,
 * dashed version numbers, the [1m] context suffix, -latest aliases, provider
 * prefixes (anthropic/claude-..., openai/gpt-...).
 */
export function modelIdCandidates(requested: string): string[] {
  const candidates: string[] = [requested];
  const add = (id: string): void => {
    if (id && !candidates.includes(id)) {
      candidates.push(id);
    }
  };
  let base = requested.trim().toLowerCase();
  add(base);
  base = base.replace(/^[a-z0-9-]+\//, "");
  add(base);
  base = base
    .replace(/\[[^\]]*\]$/, "")
    .replace(/-latest$/, "")
    .replace(/-\d{8}$/, "")
    .replace(/@\d{8}$/, "");
  add(base);
  // claude-sonnet-4-5 -> claude-sonnet-4.5 ; claude-opus-5-5-fast -> claude-opus-5.5-fast
  add(base.replace(/^(claude-[a-z]+-\d+)-(\d+)(?=$|-)/, "$1.$2"));
  // claude-3-5-sonnet style -> claude-sonnet-3.5
  const legacy = /^claude-(\d+)(?:-(\d+))?-([a-z]+)$/.exec(base);
  if (legacy) {
    add(`claude-${legacy[3]}-${legacy[1]}${legacy[2] ? `.${legacy[2]}` : ""}`);
  }
  // gpt-5.5 -> gpt-55 ; gpt-5.3-codex -> gpt-53-codex
  add(base.replace(/^gpt-(\d)\.(\d)(?=$|-)/, "gpt-$1$2"));
  return candidates;
}

/** Version number of a claude-<family>-X.Y id, for picking the newest. */
function claudeVersion(id: string): number {
  const match = /^claude-[a-z]+-(\d+)(?:\.(\d+))?/.exec(id);
  return match ? Number(match[1]) * 100 + Number(match[2] ?? 0) : 0;
}

/**
 * Resolution of the `model` string from a request: our id or a known vendor
 * spelling of it (legacy ids map to their successor). Returns undefined when
 * the model is unknown or not servable for this user. Only the anthropic mode
 * maps a Claude id this user cannot call to another Claude of the same family.
 */
export function resolveRequestedModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
  mode: ModelResolveMode = "openai",
): ChatModelOption | undefined {
  for (const candidate of modelIdCandidates(requested)) {
    const match = resolveExactModel(candidate, user, availability);
    if (match) {
      return match;
    }
  }
  if (mode !== "anthropic") {
    return undefined;
  }
  const family = CLAUDE_FAMILIES.find((name) =>
    new RegExp(`^(?:[a-z0-9-]+/)?claude-(?:[\\d-]+-)?${name}(?:-|$)`).test(
      requested.trim().toLowerCase(),
    ),
  );
  if (!family) {
    return undefined;
  }
  const newest = listUserCallableModels(user, availability)
    .filter((m) => new RegExp(`^claude-${family}-\\d`).test(m.id))
    .filter((m) => !m.id.endsWith("-fast"))
    .toSorted((a, b) => claudeVersion(b.id) - claudeVersion(a.id))[0];
  return newest;
}

function resolveExactModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption | undefined {
  const modelId = Object.values(ChatModelId).find((id) => id === requested);
  if (!modelId) {
    return undefined;
  }
  const resolvedId = resolveChatModelForUser(modelId, user, availability);
  const [match] = filterChatModels(
    { selectionType: ModelSelectionType.MANUAL, manualModelId: resolvedId },
    user,
    availability,
  );
  if (!match || match.id !== resolvedId || !isTextChatModel(match)) {
    return undefined;
  }
  return match;
}
