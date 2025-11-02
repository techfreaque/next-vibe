import type { JSX } from "react";

import { ChatProvider } from "@/app/[locale]/chat/features/chat/context";
import type { CountryLanguage } from "@/i18n/core/config";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { ChatInterface } from "@/app/[locale]/chat/components/chat-interface";

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
            detailLevel: UserDetailLevel.MINIMAL,
            roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        },
        locale,
        logger,
    );

    const user = userResponse.success ? userResponse.data : undefined;
    return (
        <ChatProvider locale={locale}>
            <ChatInterface user={user} />
        </ChatProvider>
    );
}
