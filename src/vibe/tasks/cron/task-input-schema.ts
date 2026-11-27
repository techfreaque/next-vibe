import { z } from "zod";

import type { WidgetData } from "../../core/utils/json";
import { taskInputSchema } from "./db";

/** Accept a typed task input or its JSON representation from a text editor. */
export function makeTaskInputRequestSchema(errors: {
  invalidJson: string;
  notObject: string;
}): z.ZodType<
  z.output<typeof taskInputSchema>,
  string | z.input<typeof taskInputSchema>
> {
  return z.union([z.string(), taskInputSchema]).transform((value, ctx) => {
    if (typeof value !== "string") {
      return value;
    }
    if (!value.trim()) {
      return {};
    }
    let parsedJson: WidgetData;
    try {
      parsedJson = JSON.parse(value);
    } catch {
      ctx.addIssue({ code: "custom", message: errors.invalidJson });
      return z.NEVER;
    }
    const parsed = taskInputSchema.safeParse(parsedJson);
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: errors.notObject });
      return z.NEVER;
    }
    return parsed.data;
  });
}

export function formatTaskInput(
  value: string | Record<string, WidgetData> | undefined,
): string {
  if (value === undefined) {
    return "";
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}
