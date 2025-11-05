import { redirect } from "next/navigation";

import { DEFAULT_FOLDER_IDS } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

interface ChatPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * Root chat page - redirects to appropriate default folder based on auth status
 * Authenticated users -> /threads/private
 * Public users -> /threads/public
 */
export default async function ChatPage({
  params,
}: ChatPageProps): Promise<never> {
  const { locale } = await params;
  const logger = createEndpointLogger(true, Date.now(), locale);

  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );

  const user = userResponse.success ? userResponse.data : undefined;
  const isAuthenticated = user !== undefined && !user.isPublic;

  // Redirect to appropriate default folder
  const defaultFolder = isAuthenticated
    ? DEFAULT_FOLDER_IDS.PRIVATE
    : DEFAULT_FOLDER_IDS.PUBLIC;

  redirect(`/${locale}/threads/${defaultFolder}`);
}
