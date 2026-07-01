import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { chatSettings } from "../db";

import type { CodingAgentSettingData } from "./prompt";

export async function loadCodingAgentSettingData(
  params: SystemPromptServerParams,
): Promise<CodingAgentSettingData> {
  const { user } = params;

  if (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN)) {
    return { codingAgent: null };
  }

  try {
    const rows = await db
      .select({ codingAgent: chatSettings.codingAgent })
      .from(chatSettings)
      .where(eq(chatSettings.userId, user.id))
      .limit(1);

    return { codingAgent: rows[0]?.codingAgent ?? null };
  } catch {
    return { codingAgent: null };
  }
}
