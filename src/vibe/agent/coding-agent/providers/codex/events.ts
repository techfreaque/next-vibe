import type { ThreadItem } from "./protocol";

/** One line, trimmed. */
export function oneLine(text: string, limit: number): string {
  const flat = text.trim().replace(/\s*\r?\n\s*/g, " / ");
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

/** Whether the item is the agent's answer for the turn (as opposed to progress narration). */
export function isFinalAnswer(item: ThreadItem): boolean {
  return item.type === "agentMessage" && item.phase === "final_answer";
}

/** The entry an item adds to the transcript, if it belongs there. */
export function transcriptEntry(item: ThreadItem): string | undefined {
  switch (item.type) {
    case "agentMessage":
      return item.text ? `## agent\n\n${item.text}\n` : undefined;
    case "commandExecution": {
      const code =
        item.exitCode === null || item.exitCode === undefined
          ? (item.status ?? "?")
          : `exit ${item.exitCode}`;
      return `- \`${oneLine(item.command ?? "", 200)}\` → ${code}\n`;
    }
    case "fileChange": {
      const paths = (item.changes ?? [])
        .map((change) => change.path)
        .filter(Boolean);
      return paths.length > 0 ? `- edited ${paths.join(", ")}\n` : undefined;
    }
    default:
      return undefined;
  }
}
