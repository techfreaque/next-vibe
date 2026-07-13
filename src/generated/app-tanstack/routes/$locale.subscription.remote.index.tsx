// AUTO-GENERATED from src/_pages/subscription/remote/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/subscription/remote/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      params: Record<string, string>;
      search: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const { tanstackLoader } =
        await import("@/_pages/subscription/remote/page");
      return tanstackLoader({
        params: Promise.resolve(toNextParams(data.params)),
        searchParams: Promise.resolve(data.search),
      });
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/subscription/remote/")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) =>
    loadData({ data: { params: params as Record<string, string>, search } }),
  component: PageComponent,
});
