import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface Props {
  params: Promise<{
    locale: CountryLanguage;
    jobId: string;
  }>;
}

export default async function JobPostingPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  redirect(`/${locale}/story/careers`);
}
