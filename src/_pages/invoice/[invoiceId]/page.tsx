/**
 * Public Invoice Page
 * The link customers get in the invoice email: /[locale]/invoice/[invoiceId]?token=…
 * The HMAC token is the only credential — no account needed.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { scopedTranslation } from "@/payment/invoice/[invoiceId]/public-view/i18n";

import { type InvoicePageData, InvoicePublicPage } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; invoiceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  // Invoices are private documents — never indexed
  return { title: t("get.title"), robots: { index: false, follow: false } };
}

export async function tanstackLoader({
  params,
  searchParams,
}: Props): Promise<InvoicePageData> {
  const { locale, invoiceId } = await params;
  const query = await searchParams;
  const logger = createEndpointLogger(false, locale);
  const viewer: JwtPayloadType = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  return {
    locale,
    invoiceId,
    token: typeof query["token"] === "string" ? query["token"] : "",
    viewer,
    platform: Platform.NEXT_PAGE,
  };
}

export function TanstackPage(data: InvoicePageData): JSX.Element {
  return <InvoicePublicPage {...data} />;
}

export default async function InvoicePage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
