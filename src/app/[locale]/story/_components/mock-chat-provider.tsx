"use client";

/**
 * Lightweight mock ChatBootProvider for landing page chat demo.
 * Provides a mock ChatBootValue so the real chat components
 * can render without the full chat infrastructure.
 */

import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import type { ChatBootValue } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

const MOCK_USER: ChatBootValue["user"] = {
  isPublic: false,
  id: "00000000-0000-0000-0000-000000000000",
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.ADMIN],
};

const MOCK_ENV: AgentEnvAvailability = {
  openRouter: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: false,
  freedomGPT: false,
  gabAI: false,
  veniceAI: false,
  scrappey: false,
};

const MOCK_CREDITS: ChatBootValue["initialCredits"] = {
  total: 0,
  expiring: 0,
  permanent: 0,
  earned: 0,
  free: 0,
  expiresAt: null,
};

export function MockChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const mockValue = useMemo(
    (): ChatBootValue => ({
      user: MOCK_USER,
      locale: "en-US",
      logger: createEndpointLogger(false, Date.now(), "en-US"),
      initialCredits: MOCK_CREDITS,
      envAvailability: MOCK_ENV,
      rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
    }),
    [],
  );

  return (
    <ChatBootContext.Provider value={mockValue}>
      {children}
    </ChatBootContext.Provider>
  );
}
