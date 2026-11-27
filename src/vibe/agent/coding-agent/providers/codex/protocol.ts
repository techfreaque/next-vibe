/** The JSON values and the messages of `codex app-server` the runner reads, as zod schemas (no assertions on wire data). */

import { z } from "zod";

export type Json = string | number | boolean | null | Json[] | JsonObject;
export interface JsonObject {
  [key: string]: Json | undefined;
}

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema),
  ]),
);
export const jsonObjectSchema = z.record(z.string(), jsonSchema);

/** One line of the app-server: a response, a notification or a request of the server. */
export const incomingSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  method: z.string().optional(),
  params: jsonObjectSchema.optional(),
  result: jsonSchema.optional(),
  error: z
    .object({ code: z.number().optional(), message: z.string().optional() })
    .optional(),
});

export const threadOpenedSchema = z.object({
  thread: z.object({ id: z.string() }),
});
export const threadItemSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  phase: z.string().nullish(),
  command: z.string().optional(),
  exitCode: z.number().nullish(),
  status: z.string().optional(),
  changes: z.array(z.object({ path: z.string().optional() })).optional(),
});
export type ThreadItem = z.infer<typeof threadItemSchema>;

const turnResultSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  items: z.array(threadItemSchema).optional(),
  error: z.object({ message: z.string() }).nullish(),
});
export type TurnResult = z.infer<typeof turnResultSchema>;

export const turnStartedResultSchema = z.object({
  turn: turnResultSchema.extend({
    id: z.string(),
    status: z.string().optional(),
  }),
});

export const turnStartedSchema = z.object({
  threadId: z.string(),
  turn: z.object({ id: z.string() }),
});
export const itemCompletedSchema = z.object({
  threadId: z.string(),
  item: threadItemSchema,
});
export const turnCompletedSchema = z.object({
  threadId: z.string(),
  turn: turnResultSchema,
});
export const errorNotificationSchema = z.object({
  threadId: z.string().optional(),
  willRetry: z.boolean().optional(),
  error: z.object({ message: z.string() }).optional(),
});
