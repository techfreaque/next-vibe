import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import {
  generateMetadata as verificationMetadata,
  tanstackLoader as verificationLoader,
  TanstackPage as VerificationPage,
  type VerifyEmailPageData,
} from "./[token]/page";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return verificationMetadata({
    params: Promise.resolve({ locale, token: "" }),
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<VerifyEmailPageData> {
  const { locale } = await params;
  return verificationLoader({ params: Promise.resolve({ locale, token: "" }) });
}

export function TanstackPage(data: VerifyEmailPageData): JSX.Element {
  return <VerificationPage {...data} />;
}

export default async function VerifyEmailPage({
  params,
}: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader({ params })} />;
}
