/**
 * Business Info Layout
 * Provides navigation and layout for business information forms
 */

import "server-only";

import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { BusinessInfoLayoutClient } from "./_components/business-info-layout-client";

// NavItem interface exported for use in client components
export interface NavItem {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
  segment: string;
}

interface BusinessInfoLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function BusinessInfoLayout({
  children,
  params,
}: BusinessInfoLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <BusinessInfoLayoutClient locale={locale}>
      {children}
    </BusinessInfoLayoutClient>
  );
}
