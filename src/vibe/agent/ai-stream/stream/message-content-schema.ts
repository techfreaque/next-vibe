import { z } from "zod";

import { AGENT_MESSAGE_LENGTH } from "../../chat/constants";

/**
 * The message text. Callers that speak the AI SDK / OpenAI message format send
 * content as a list of text parts (prod 2026-11-27: a browser POST with
 * `content` as array(3) failed with "expected string, received array"). A
 * list of TEXT parts carries no more than its joined text, so it is accepted
 * and joined; any other part type (image, file) still fails validation, since
 * attachments travel in `attachments`.
 */
const messageTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});
export const messageContentSchema = z
  .union([z.string(), z.array(messageTextPartSchema)])
  .transform((content) =>
    typeof content === "string"
      ? content
      : content.map((part) => part.text).join("\n"),
  )
  .pipe(z.string().max(AGENT_MESSAGE_LENGTH));
