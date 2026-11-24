import { z } from "zod";

export const HEALTH_ALIAS = "health" as const;

export const healthRevisionSchema = z
  .string()
  .regex(/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/);
