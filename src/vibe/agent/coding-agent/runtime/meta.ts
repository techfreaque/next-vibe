import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { z } from "zod";

import {
  codingAgentProviderSchema,
  finishedStatusSchema,
  sandboxSchema,
} from "../enum";
import { agentDir, isValidName } from "./paths";

const schema = z.object({
  threadId: z.string(),
  provider: codingAgentProviderSchema.optional(),
  model: z.string().optional(),
  effort: z.string().optional(),
  sandbox: sandboxSchema.optional(),
  cwd: z.string().optional(),
  startedAt: z.string().optional(),
  last: z
    .object({
      status: finishedStatusSchema,
      message: z.string(),
      finishedAt: z.string(),
      error: z.string().optional(),
    })
    .optional(),
});
export type AgentMeta = z.infer<typeof schema>;

export function readMeta(dir: string, name: string): AgentMeta | undefined {
  if (!isValidName(name)) {
    return undefined;
  }
  const file = join(agentDir(dir, name), "meta.json");
  if (!existsSync(file)) {
    return undefined;
  }
  const content = readFileSync(file, "utf8");
  try {
    const result = schema.safeParse(JSON.parse(content));
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function writeMeta(dir: string, name: string, meta: AgentMeta): void {
  const folder = agentDir(dir, name);
  mkdirSync(folder, { recursive: true, mode: 0o700 });
  const file = join(folder, "meta.json");
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(meta), { mode: 0o600 });
  renameSync(temporary, file);
}
