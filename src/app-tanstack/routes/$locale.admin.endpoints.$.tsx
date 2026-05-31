// AUTO-GENERATED from src/app/[locale]/admin/endpoints/[...slug]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/admin/endpoints/[...slug]/page";
import type { CountryLanguage } from "@/i18n/core/config";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/admin/endpoints/[...slug]/page");
    const p = toNextParams(data);
    return tanstackLoader({
      params: Promise.resolve({
        ...p,
        slug: (p["_splat"] ?? "").split("/").filter(Boolean),
      } as { locale: CountryLanguage; slug: string[] }),
    });
  });

export const Route = createFileRoute("/$locale/admin/endpoints/$")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Page {...Route.useLoaderData()} />,
});
