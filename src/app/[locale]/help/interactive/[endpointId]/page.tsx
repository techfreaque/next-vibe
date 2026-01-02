/**
 * Help Interactive Endpoint Page
 * Displays a specific endpoint by ID for direct linking and refresh support
 */

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX } from "react";

import { HelpInteractiveView } from "@/app/api/[locale]/system/help/interactive/_components/help-interactive-view";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface HelpInteractiveEndpointPageProps {
  params: Promise<{ locale: CountryLanguage; endpointId: string }>;
}

export default async function HelpInteractiveEndpointPage({
  params,
}: HelpInteractiveEndpointPageProps): Promise<JSX.Element> {
  const { locale, endpointId } = await params;

  // Get user for permission filtering
  const user = await requireAdminUser(locale, `/${locale}/help/interactive/${endpointId}`);

  // Decode the endpoint ID (format: path_parts_METHOD, e.g., users_list_GET)
  const decodedEndpointId = decodeURIComponent(endpointId);

  return (
    <PageLayout scrollable={true}>
      <HelpInteractiveView locale={locale} user={user} initialEndpointId={decodedEndpointId} />
    </PageLayout>
  );
}
