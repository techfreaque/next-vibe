// AUTO-GENERATED from src/app/[locale]/shared/[token]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/app/[locale]/shared/[token]/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const { tanstackLoader } =
        await import("@/app/[locale]/shared/[token]/page");
      return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/shared/$token/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
