import type { JSX } from "react";

import { ChatProvider } from "@/app/[locale]/chat/features/chat/context";
import type { CountryLanguage } from "@/i18n/core/config";

import { createEndpointLogger } from "../api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { UserDetailLevel } from "../api/[locale]/v1/core/user/enum";
import { userRepository } from "../api/[locale]/v1/core/user/repository";
import { UserRole } from "../api/[locale]/v1/core/user/user-roles/enum";
import { ChatInterface } from "./chat/components/chat-interface";

interface ChatPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function ChatPage({
  params,
}: ChatPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(true, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth(
    {
      locale,
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.CUSTOMER, UserRole.ADMIN],
    },
    logger,
  );

  // ChatInterface requires a private user (authenticated)
  if (
    !userResponse.success ||
    !userResponse.data ||
    userResponse.data.isPublic
  ) {
    // Redirect to login or show error
    // For now, create a minimal private user structure
    const fallbackUser = {
      id: "00000000-0000-0000-0000-000000000000",
      leadId: "00000000-0000-0000-0000-000000000000",
      isPublic: false as const,
    };
    return (
      <ChatProvider locale={locale}>
        <ChatInterface user={fallbackUser} />
      </ChatProvider>
    );
  }

  const user = userResponse.data;
  logger.debug("test", user);
  return (
    <ChatProvider locale={locale}>
      <ChatInterface user={user} />
    </ChatProvider>
  );
}
