// AUTO-GENERATED from src/app/[locale]/threads/[...path]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/app/[locale]/threads/[...path]/page";

import { toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      params: Record<string, string>;
      search: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { tanstackLoader } =
      await import("@/app/[locale]/threads/[...path]/page");
    const p = toNextParams(data.params);
    return tanstackLoader({
      params: Promise.resolve({
        ...p,
        path: (p["_splat"] ?? "").split("/").filter(Boolean),
      } as { locale: CountryLanguage; path: string[] }),
      searchParams: Promise.resolve(data.search),
    });
  });

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/threads/$")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) =>
    loadData({ data: { params: params as Record<string, string>, search } }),
  component: PageComponent,
});
