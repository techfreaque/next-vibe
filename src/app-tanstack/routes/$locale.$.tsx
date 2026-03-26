// AUTO-GENERATED from src/app/[locale]/[...notFound]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/[...notFound]/page";
import type { CountryLanguage } from "@/i18n/core/config";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/[...notFound]/page");
    const p = toNextParams(data);
    return tanstackLoader({
      params: Promise.resolve({
        ...p,
        notFound: (p["_splat"] ?? "").split("/").filter(Boolean),
      } as { locale: CountryLanguage; notFound: string[] }),
    });
  });

export const Route = createFileRoute("/$locale/$")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Page {...Route.useLoaderData()} />,
});
