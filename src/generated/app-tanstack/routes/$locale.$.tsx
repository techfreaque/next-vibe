// AUTO-GENERATED from src/app/[locale]/[...notFound]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/app/[locale]/[...notFound]/page";

import { toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } =
      await import("@/app/[locale]/[...notFound]/page");
    const p = toNextParams(data);
    return tanstackLoader({
      params: Promise.resolve({
        ...p,
        notFound: (p["_splat"] ?? "").split("/").filter(Boolean),
      } as { locale: CountryLanguage; notFound: string[] }),
    });
  });

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/$")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
