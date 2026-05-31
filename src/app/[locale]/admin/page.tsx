export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";
import type { CountryLanguage } from "@/i18n/core/config";

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Record<string, never>> {
  const { locale } = await params;
  redirect(`/${locale}/admin/endpoints`);
}

export function TanstackPage(): JSX.Element {
  return <></>;
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  await tanstackLoader({ params });
  return <TanstackPage />;
}
