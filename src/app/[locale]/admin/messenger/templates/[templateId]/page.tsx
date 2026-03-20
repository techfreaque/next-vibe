/**
 * Individual Email Template Preview Page
 * Server-side preview generation with client-side test email sending
 */

export const dynamic = "force-dynamic";

import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import {
  getAllTemplateIds,
  getTemplate,
  getTranslatedTemplateMetadata,
  translatePreviewFields,
} from "@/app/api/[locale]/messenger/registry/generated";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailPreviewClient } from "../_components/email-preview-client";

interface EmailTemplatePreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    templateId: string;
  }>;
}

export interface EmailTemplatePreviewPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  templateId: string;
  translatedName: string;
  translatedDescription: string;
  templateMeta: {
    id: string;
    version: string;
    category: string;
    path: string;
  };
  previewFields: ReturnType<typeof translatePreviewFields>;
  exampleProps: Record<string, string | number | boolean>;
  previousTemplateId: string | null;
  nextTemplateId: string | null;
  backLabel: string;
  previousLabel: string;
  nextLabel: string;
  idLabel: string;
  versionLabel: string;
  categoryLabel: string;
  pathLabel: string;
}

export async function generateStaticParams(): Promise<
  Array<{ templateId: string }>
> {
  const templateIds = getAllTemplateIds();
  return templateIds.map((id) => ({ templateId: id }));
}

export async function tanstackLoader({
  params,
}: EmailTemplatePreviewPageProps): Promise<EmailTemplatePreviewPageData> {
  const { locale, templateId } = await params;
  const { t } = simpleT(locale);
  const user = await requireAdminUser(locale);

  // Load full template and metadata in parallel (server-side only)
  const [template, translatedMeta] = await Promise.all([
    getTemplate(templateId),
    getTranslatedTemplateMetadata(templateId, locale),
  ]);

  if (!template || !translatedMeta) {
    notFound();
  }

  // Extract serializable data for client component (pre-translated)
  const previewFields = translatePreviewFields(template, locale);
  const exampleProps = template.exampleProps;

  // Get all templates for navigation
  const allTemplateIds = getAllTemplateIds();
  const currentIndex = allTemplateIds.indexOf(templateId);
  const previousTemplateId =
    currentIndex > 0 ? allTemplateIds[currentIndex - 1] : null;
  const nextTemplateId =
    currentIndex < allTemplateIds.length - 1
      ? allTemplateIds[currentIndex + 1]
      : null;

  return {
    locale,
    user,
    templateId,
    translatedName: translatedMeta.name,
    translatedDescription: translatedMeta.description,
    templateMeta: {
      id: translatedMeta.id,
      version: translatedMeta.version,
      category: translatedMeta.category,
      path: translatedMeta.path,
    },
    previewFields,
    exampleProps: exampleProps as Record<string, string | number | boolean>,
    previousTemplateId,
    nextTemplateId,
    backLabel: t("app.admin.emails.templates.preview.back_to_templates"),
    previousLabel: t("app.admin.emails.templates.preview.previous"),
    nextLabel: t("app.admin.emails.templates.preview.next"),
    idLabel: t("app.admin.emails.templates.preview.id"),
    versionLabel: t("app.admin.emails.templates.preview.version"),
    categoryLabel: t("app.admin.emails.templates.preview.category"),
    pathLabel: t("app.admin.emails.templates.preview.path"),
  };
}

export function TanstackPage({
  locale,
  user,
  templateId,
  translatedName,
  translatedDescription,
  templateMeta,
  previewFields,
  exampleProps,
  previousTemplateId,
  nextTemplateId,
  backLabel,
  previousLabel,
  nextLabel,
  idLabel,
  versionLabel,
  categoryLabel,
  pathLabel,
}: EmailTemplatePreviewPageData): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-6">
      {/* Navigation Header */}
      <Div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/${locale}/admin/messenger/templates`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Link>
        </Button>

        <Div className="flex gap-2">
          {previousTemplateId && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/${locale}/admin/messenger/templates/${previousTemplateId}`}
              >
                {previousLabel}
              </Link>
            </Button>
          )}
          {nextTemplateId && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/${locale}/admin/messenger/templates/${nextTemplateId}`}
              >
                {nextLabel}
              </Link>
            </Button>
          )}
        </Div>
      </Div>

      {/* Template Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{translatedName}</CardTitle>
          <P className="text-sm text-gray-600 dark:text-gray-400">
            {translatedDescription}
          </P>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Div>
              <P className="text-gray-500 dark:text-gray-400">{idLabel}</P>
              <P className="font-medium">{templateMeta.id}</P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">{versionLabel}</P>
              <P className="font-medium">{templateMeta.version}</P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">
                {categoryLabel}
              </P>
              <P className="font-medium capitalize">{templateMeta.category}</P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">{pathLabel}</P>
              <Span className="font-mono text-xs text-gray-600">
                {templateMeta.path}
              </Span>
            </Div>
          </Div>
        </CardContent>
      </Card>

      {/* Email Preview */}
      <EmailPreviewClient
        locale={locale}
        templateId={templateId}
        templateName={translatedName}
        previewFields={previewFields}
        exampleProps={exampleProps}
        user={user}
      />
    </Div>
  );
}

export default async function EmailTemplatePreviewPage({
  params,
}: EmailTemplatePreviewPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
