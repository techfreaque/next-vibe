import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { ContactData } from "./prompt";

export async function loadContactData(
  params: SystemPromptServerParams,
): Promise<ContactData> {
  return { isLoggedIn: !params.user.isPublic };
}
