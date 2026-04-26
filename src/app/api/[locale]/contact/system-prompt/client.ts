"use client";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { ContactData } from "./prompt";

export function useContactData(params: SystemPromptClientParams): ContactData {
  return { isLoggedIn: !params.user.isPublic };
}
