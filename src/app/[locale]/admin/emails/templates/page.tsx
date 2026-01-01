/**
 * Email Templates Preview Overview Page
 * Lists all email templates grouped by category
 */

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import {
  getAllTemplateMetadata,
  getTemplatesByCategory,
} from "@/app/api/[locale]/emails/registry/generated";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailTemplatesPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function EmailTemplatesPage({
  params,
}: EmailTemplatesPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Get all templates and group by category
  const allTemplates = getAllTemplateMetadata();
  const categories = [
    ...new Set(allTemplates.map((template) => template.category)),
  ].toSorted();

  const templatesByCategory = categories.map((category) => ({
    category,
    templates: getTemplatesByCategory(category),
  }));

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Header */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.templates.overview.description")}
        </P>
      </Div>

      {/* Templates by Category */}
      {templatesByCategory.map(({ category, templates }) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category}</CardTitle>
            <P className="text-sm text-gray-600 dark:text-gray-400">
              {templates.length}{" "}
              {templates.length === 1
                ? t("app.admin.emails.templates.overview.template")
                : t("app.admin.emails.templates.overview.templates")}
            </P>
          </CardHeader>
          <CardContent>
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                // Translate metadata fields (they contain translation keys)
                const translatedName = t(template.name);
                const translatedDescription = t(template.description);

                return (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {translatedName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <P className="text-sm text-gray-600 dark:text-gray-400">
                        {translatedDescription}
                      </P>

                      <Div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                        <P>
                          {t("app.admin.emails.templates.overview.version")}:{" "}
                          {template.version}
                        </P>
                        <P>
                          {t("app.admin.emails.templates.overview.id")}:{" "}
                          {template.id}
                        </P>
                      </Div>

                      <Button asChild className="w-full">
                        <Link
                          href={`/${locale}/admin/emails/templates/${template.id}`}
                        >
                          {t(
                            "app.admin.emails.templates.overview.view_preview",
                          )}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <P className="text-gray-600 dark:text-gray-400">
            {t("app.admin.emails.templates.overview.total")}
          </P>
          <P className="font-medium text-lg">
            {allTemplates.length}{" "}
            {allTemplates.length === 1
              ? t("app.admin.emails.templates.overview.template")
              : t("app.admin.emails.templates.overview.templates")}
          </P>
        </CardContent>
      </Card>
    </Div>
  );
}
