// AUTO-GENERATED from src/_pages/tools/[...toolPath]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "../../../vibe/core/i18n/core/config";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/tools/[...toolPath]/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .validator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const { tanstackLoader } =
        await import("@/_pages/tools/[...toolPath]/page");
      const p = toNextParams(data);
      return tanstackLoader({
        params: Promise.resolve({
          ...p,
          toolPath: (p["_splat"] ?? "").split("/").filter(Boolean),
        } as { locale: CountryLanguage; toolPath: string[] }),
      });
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/tools/$")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
