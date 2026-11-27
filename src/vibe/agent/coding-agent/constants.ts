export const CODING_AGENT_ALIAS = "coding-agent" as const;
export const CODING_AGENT_SAY_ALIAS = "coding-agent-say" as const;
export const CODING_AGENT_INTERRUPT_ALIAS = "coding-agent-interrupt" as const;
export const CODING_AGENT_LIST_ALIAS = "coding-agent-list" as const;

export function isValidAgentName(name: string): boolean {
  return (
    /^[a-z0-9][a-z0-9_-]{0,39}$/i.test(name) &&
    !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)
  );
}
