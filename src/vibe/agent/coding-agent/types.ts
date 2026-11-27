import { z } from "zod";

import {
  codingAgentProviderSchema,
  type finishedStatusSchema,
  type sandboxSchema,
  type successfulStatusSchema,
} from "./enum";

export type CodingAgentProviderValue = z.infer<
  typeof codingAgentProviderSchema
>;
export type Sandbox = z.infer<typeof sandboxSchema>;
export type RunStatus = z.infer<typeof finishedStatusSchema>;
export type SuccessfulRunStatus = z.infer<typeof successfulStatusSchema>;

export interface CodingAgentRequest {
  prompt: string;
  model?: string;
  interactiveMode?: boolean;
  taskTitle?: string;
  cwd?: string;
}

export interface CodingAgentResponse {
  output: string;
  durationMs: number;
  name?: string;
  threadId?: string;
  status?: SuccessfulRunStatus;
  taskId?: string;
  hint?: string;
  terminalPending?: boolean;
}

export interface RunResult {
  name: string;
  /** The provider conversation ID. Running the same name continues it. */
  threadId: string;
  status: RunStatus;
  /** The agent's final message. */
  message: string;
  error?: string | undefined;
}

/** What a running agent publishes so say, interrupt and list can reach it. */
export const runningInfoSchema = z.object({
  name: z.string(),
  pid: z.number().int().positive(),
  port: z.number().int().min(1).max(65535),
  token: z.string().regex(/^[a-f0-9]{48}$/),
  cwd: z.string(),
  threadId: z.string(),
  startedAt: z.string(),
  provider: codingAgentProviderSchema.optional(),
});
export type RunningInfo = z.infer<typeof runningInfoSchema>;

export const agentErrorCodeSchema = z.enum([
  "invalid",
  "conflict",
  "not_found",
  "unavailable",
]);
export type AgentErrorCode = z.infer<typeof agentErrorCodeSchema>;

export class AgentError extends Error {
  readonly code: AgentErrorCode;
  constructor(code: AgentErrorCode, message: string) {
    super(message);
    this.name = "AgentError";
    this.code = code;
  }
}
