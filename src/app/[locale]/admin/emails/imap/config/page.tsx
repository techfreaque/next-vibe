/**
 * IMAP Configuration Admin Page
 * Page for managing IMAP server configuration
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { ImapConfigurationManagement } from "@/app/api/[locale]/emails/imap-client/_components/imap-configuration-management";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ImapConfigPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Configuration Page Component
 */
export default async function ImapConfigPage({
  params,
}: ImapConfigPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Get JWT user for client components
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Verify admin access (will redirect if not admin)
  if (user.isPublic || !user.roles.includes(UserRole.ADMIN)) {
    const { redirect } = await import("next-vibe-ui/lib/redirect");
    redirect(
      `/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/admin/emails/imap/config`)}`,
    );
  }

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.config.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.config.description")}
        </P>
      </Div>

      <ImapConfigurationManagement user={user} />
    </Div>
  );
}
