// AUTO-GENERATED from src/_pages/threads/[...path]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "../../../vibe/core/i18n/core/config";
import { resolvePageHead } from "next-vibe/platforms/web/frameworks/tanstack-start/page-head";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/threads/[...path]/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .validator(
    (data: {
      params: Record<string, string>;
      search: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const page = await import("@/_pages/threads/[...path]/page");
      const layout0 = await import("@/_pages/layout");
      const [pageData, head] = await Promise.all([
        page.tanstackLoader({
          params: Promise.resolve({
            ...toNextParams(data.params),
            path: (data.params["_splat"] ?? "").split("/").filter(Boolean),
          } as { locale: CountryLanguage; path: string[] }),
          searchParams: Promise.resolve(data.search),
        }),
        resolvePageHead([
          () =>
            layout0.generateMetadata({
              params: Promise.resolve({
                ...toNextParams(data.params),
                path: (data.params["_splat"] ?? "").split("/").filter(Boolean),
              } as { locale: CountryLanguage; path: string[] }),
            }),
        ]),
      ]);
      return { page: pageData, head };
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData().page} />;
}

export const Route = createFileRoute("/$locale/threads/$")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) =>
    loadData({ data: { params: params as Record<string, string>, search } }),
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: PageComponent,
});
