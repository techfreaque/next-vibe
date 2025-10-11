/**
 * Template Import Hooks Usage Examples - Server-Side Implementation
 *
 * This file demonstrates comprehensive server-side patterns following the business-info model.
 * It serves as a complete role model for implementing template-api endpoints with:
 *
 * 1. Server-side data fetching with repository patterns
 * 2. Proper authentication and authorization checks
 * 3. Metadata generation for SEO optimization
 * 4. Error handling and redirect logic
 * 5. Type-safe parameter handling
 * 6. Clean separation of server/client concerns
 * 7. Comprehensive translation key structure
 * 8. Multiple page implementation examples
 * 9. Advanced error handling patterns
 * 10. Performance optimization techniques
 *
 * Architecture Pattern:
 * - Server-side: Authentication, data fetching, metadata, redirects, initial state
 * - Client-side: Form handling, user interactions, state management, real-time updates
 *
 * Translation Structure:
 * All translation keys follow the pattern: templateApi.import.{section}.{key}
 * See translations.example.json for the complete translation structure.
 *
 * Following the business-info pattern for optimal performance and maintainability.
 */

import "server-only";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { TemplateImportForm } from "./hooks.example.client";

// =============================================================================
// METADATA GENERATION EXAMPLES
// =============================================================================

/**
 * Metadata Generation Example for Template Import Page
 *
 * This function generates SEO-optimized metadata following the business-info pattern.
 * It demonstrates proper localization, dynamic content, and comprehensive SEO setup.
 *
 * Usage in page.tsx:
 * ```tsx
 * export const generateMetadata = generateTemplateImportMetadata;
 * ```
 */
export async function generateTemplateImportMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return metadataGenerator(locale, {
    path: "app/template/import",
    title: "templateApiImport.templateApi.import.meta.title",
    description: "templateApiImport.templateApi.import.meta.description",
    category: "templateApiImport.templateApi.import.meta.category",
    image: "https://socialmediaservice.center/images/template-import.jpg",
    imageAlt: "templateApiImport.templateApi.import.meta.imageAlt",
    keywords: [
      "templateApiImport.templateApi.import.meta.keywords.templateManagement",
      "templateApiImport.templateApi.import.meta.keywords.bulkImport",
      "templateApiImport.templateApi.import.meta.keywords.csvImport",
      "templateApiImport.templateApi.import.meta.keywords.jsonImport",
      "templateApiImport.templateApi.import.meta.keywords.xmlImport",
    ],
  });
}

// =============================================================================
// SERVER-SIDE PAGE IMPLEMENTATIONS
// =============================================================================

/**
 * Server-Side Example: Template Import Page
 *
 * This is the main template import page implementation following the business-info pattern.
 * It demonstrates comprehensive server-side data fetching, authentication, and error handling.
 *
 * Key Features:
 * - Authentication verification with redirect handling
 * - User data fetching with proper error handling
 * - Type-safe parameter handling
 * - Clean separation of concerns
 * - Proper callback URL handling for post-login redirects
 *
 * Example usage in page.tsx:
 * ```tsx
 * import { generateTemplateImportMetadata, TemplateImportServerSide } from "@/app/api/[locale]/v1/core/template-api/import/hooks.example";
 *
 * export const generateMetadata = generateTemplateImportMetadata;
 * export default TemplateImportServerSide;
 * ```
 */
export async function TemplateImportServerSide({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<ReactElement> {
  const { locale } = await params;

  // Fetch user data with proper error handling
  const userResponse = await userRepository.getUserByAuth({
    detailLevel: "complete",
  });

  const user = userResponse.success ? userResponse.data : undefined;

  // Redirect to login if user is not authenticated
  if (!user?.id) {
    redirect(
      `/${locale}/user/login?callbackUrl=/${locale}/app/template/import`,
    );
  }

  // Get translations for server-side rendering
  const { t } = simpleT(locale);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("templateApiImport.templateApi.import.page.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("templateApiImport.templateApi.import.page.description")}
        </p>
      </div>

      {/* Main Import Form */}
      <TemplateImportForm locale={locale} />
    </div>
  );
}
