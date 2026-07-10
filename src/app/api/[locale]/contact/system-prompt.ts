/* eslint-disable i18next/no-literal-string */
import "server-only";

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";

import { CONTACT_FORM_ALIAS } from "./constants";

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const contactFragment: SystemPromptFragment = {
  id: "contact",
  placement: "leading",
  priority: 500,
  build: async (params) => {
    const emailNote = params.user.isPublic
      ? "User not logged in - submit without email if not provided. Never ask for it."
      : "User is logged in - leave email field empty.";

    return `## Contact Support
Tool: \`${CONTACT_FORM_ALIAS}\` - use for bugs, billing, complaints, or anything needing a human.
Always confirm before submitting (show what will be sent). Never submit silently. Pass \`callbackMode: "endLoop"\` - terminal action, always last.
If user seems frustrated or stuck, offer: "Want me to ping our support team?"
${emailNote}`;
  },
};
