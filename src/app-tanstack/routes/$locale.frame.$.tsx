// AUTO-GENERATED from src/app/[locale]/frame/[...path]/page.tsx. Add "use custom" to this file to preserve customizations.
import type { JSX } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "next-vibe/platforms/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/frame/[...path]/page";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: { params: Record<string, string>; search: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/frame/[...path]/page");
    const p = toNextParams(data.params);
    return tanstackLoader({
      params: Promise.resolve({
        ...p,
        path: (p["_splat"] ?? "").split("/").filter(Boolean),
      } as { locale: CountryLanguage; path: string[] }),
      searchParams: Promise.resolve(data.search),
    });
  });

function PageComponent(): JSX.Element { return <Page {...Route.useLoaderData()} />; }

export const Route = createFileRoute("/$locale/frame/$")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) => loadData({ data: { params: params as Record<string, string>, search } }),
  component: PageComponent,
});
