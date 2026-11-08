// AUTO-GENERATED from src/_pages/tools/[...toolPath]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "../../../vibe/core/i18n/core/config";
import { resolvePageHead } from "next-vibe/platforms/web/frameworks/tanstack-start/page-head";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/tools/[...toolPath]/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .validator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const page = await import("@/_pages/tools/[...toolPath]/page");
      const layout0 = await import("@/_pages/layout");
      const [pageData, head] = await Promise.all([
        page.tanstackLoader({
          params: Promise.resolve({
            ...toNextParams(data),
            toolPath: (data["_splat"] ?? "").split("/").filter(Boolean),
          } as { locale: CountryLanguage; toolPath: string[] }),
        }),
        resolvePageHead([
          () =>
            layout0.generateMetadata({
              params: Promise.resolve({
                ...toNextParams(data),
                toolPath: (data["_splat"] ?? "").split("/").filter(Boolean),
              } as { locale: CountryLanguage; toolPath: string[] }),
            }),
        ]),
      ]);
      return { page: pageData, head };
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData().page} />;
}

export const Route = createFileRoute("/$locale/tools/$")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: PageComponent,
});
