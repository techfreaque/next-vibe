/**
 * Bridged attachments: an image/audio/video attachment the active model
 * cannot take natively reaches it as a text description made by a bridge
 * model (vision / audio / video-to-text). The description is cached on the
 * message as a variant tagged with the attachment's id, so later turns reuse
 * it instead of bridging the same file again: no repeated bridge cost, and
 * the model reads the same description every turn (a fresh description per
 * turn could contradict what it said about the file before).
 *
 * Shared by the history converter (cache hit) and the gap-fill executor
 * (first bridge), so both produce the identical text part.
 */

import type { ProviderOptions } from "@ai-sdk/provider-utils";

import type { MessageVariant } from "../core/modality-resolver";

/** providerOptions namespace carrying our own per-part data (ignored by providers). */
const PART_META_NAMESPACE = "vibe";

/** How a bridged attachment of this mime type is labelled for the model. */
export function bridgeLabelsFor(mimeType: string): {
  label: "image" | "video" | "audio";
  descriptor: "vision" | "audio";
} | null {
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/")) {
    return { label: "image", descriptor: "vision" };
  }
  if (mime.startsWith("video/")) {
    return { label: "video", descriptor: "vision" };
  }
  if (mime.startsWith("audio/")) {
    return { label: "audio", descriptor: "audio" };
  }
  return null;
}

/** The text part the model reads in place of a bridged attachment. */
export function formatBridgedAttachmentText(
  label: string,
  descriptor: string,
  description: string,
): string {
  return `[${label} attachment - system-injected ${descriptor} description (you cannot see the raw file)]:\n${description}`;
}

/**
 * The cached description for one attachment, or null. A variant tagged with
 * the attachment id wins. Untagged (older) text variants were written per
 * message, so they only identify the file when the message has a single
 * bridgeable attachment.
 */
export function cachedAttachmentDescription(
  variants: readonly MessageVariant[] | undefined,
  attachmentId: string,
  bridgeableAttachmentCount: number,
): string | null {
  const textVariants = (variants ?? []).filter(
    (v) => v.modality === "text" && v.content.trim() !== "",
  );
  const tagged = textVariants.findLast((v) => v.attachmentId === attachmentId);
  if (tagged) {
    return tagged.content;
  }
  if (bridgeableAttachmentCount === 1) {
    const untagged = textVariants.findLast((v) => v.attachmentId === undefined);
    if (untagged) {
      return untagged.content;
    }
  }
  return null;
}

/** providerOptions tagging an image/file part with its attachment id. */
export function attachmentPartOptions(attachmentId: string): ProviderOptions {
  return { [PART_META_NAMESPACE]: { attachmentId } };
}

/** The attachment id a part was tagged with by the converter, if any. */
export function attachmentIdOfPart(part: {
  providerOptions?: ProviderOptions;
}): string | undefined {
  const value = part.providerOptions?.[PART_META_NAMESPACE]?.["attachmentId"];
  return typeof value === "string" ? value : undefined;
}
