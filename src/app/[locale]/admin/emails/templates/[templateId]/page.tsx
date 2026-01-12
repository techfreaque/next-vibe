/**
 * Individual Email Template Preview Page
 * Server-side preview generation with client-side test email sending
 */

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
  getTemplateMetadata,
} from "@/app/api/[locale]/emails/registry/generated";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailPreviewClient } from "../_components/email-preview-client";

interface EmailTemplatePreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    templateId: string;
  }>;
}

export async function generateStaticParams(): Promise<
  Array<{ templateId: string }>
> {
  const templateIds = getAllTemplateIds();
  return templateIds.map((id) => ({ templateId: id }));
}

export default async function EmailTemplatePreviewPage({
  params,
}: EmailTemplatePreviewPageProps): Promise<React.JSX.Element> {
  const { locale, templateId } = await params;
  const { t } = simpleT(locale);

  // Get template metadata
  const templateMetadata = getTemplateMetadata(templateId);

  if (!templateMetadata) {
    notFound();
  }

  // Load full template to get previewFields (server-side only)
  const template = await getTemplate(templateId);

  if (!template) {
    notFound();
  }

  // Extract serializable data for client component
  const previewFields = template.meta.previewFields;
  const exampleProps = template.exampleProps;

  // Translate metadata fields (they contain translation keys)
  const translatedName = t(templateMetadata.name);
  const translatedDescription = t(templateMetadata.description);

  // Get all templates for navigation
  const allTemplateIds = getAllTemplateIds();
  const currentIndex = allTemplateIds.indexOf(templateId);
  const previousTemplateId =
    currentIndex > 0 ? allTemplateIds[currentIndex - 1] : null;
  const nextTemplateId =
    currentIndex < allTemplateIds.length - 1
      ? allTemplateIds[currentIndex + 1]
      : null;

  return (
    <Div className="flex flex-col gap-6">
      {/* Navigation Header */}
      <Div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/${locale}/admin/emails/templates`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("app.admin.emails.templates.preview.back_to_templates")}
          </Link>
        </Button>

        <Div className="flex gap-2">
          {previousTemplateId && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/${locale}/admin/emails/templates/${previousTemplateId}`}
              >
                {t("app.admin.emails.templates.preview.previous")}
              </Link>
            </Button>
          )}
          {nextTemplateId && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/${locale}/admin/emails/templates/${nextTemplateId}`}
              >
                {t("app.admin.emails.templates.preview.next")}
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
              <P className="text-gray-500 dark:text-gray-400">
                {t("app.admin.emails.templates.preview.id")}
              </P>
              <P className="font-medium">{templateMetadata.id}</P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">
                {t("app.admin.emails.templates.preview.version")}
              </P>
              <P className="font-medium">{templateMetadata.version}</P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">
                {t("app.admin.emails.templates.preview.category")}
              </P>
              <P className="font-medium capitalize">
                {templateMetadata.category}
              </P>
            </Div>
            <Div>
              <P className="text-gray-500 dark:text-gray-400">
                {t("app.admin.emails.templates.preview.path")}
              </P>
              <Span className="font-mono text-xs text-gray-600">
                {templateMetadata.path}
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
        exampleProps={exampleProps as Record<string, string | number | boolean>}
      />
    </Div>
  );
}
