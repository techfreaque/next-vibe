// AUTO-GENERATED from src/app/[locale]/subscription/overview/page.tsx. Add "use custom" to this file to preserve customizations.
import type { JSX } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "../nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/subscription/overview/page";

const loadData = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      params: Record<string, string>;
      search: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { tanstackLoader } =
      await import("@/app/[locale]/subscription/overview/page");
    return tanstackLoader({
      params: Promise.resolve(toNextParams(data.params)),
      searchParams: Promise.resolve(data.search),
    });
  });

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/subscription/overview/")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) =>
    loadData({ data: { params: params as Record<string, string>, search } }),
  component: PageComponent,
});
