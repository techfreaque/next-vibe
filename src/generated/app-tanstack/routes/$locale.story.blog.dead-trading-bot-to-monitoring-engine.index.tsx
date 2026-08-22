// AUTO-GENERATED from src/_pages/story/blog/dead-trading-bot-to-monitoring-engine/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/story/blog/dead-trading-bot-to-monitoring-engine/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .validator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const { tanstackLoader } =
        await import("@/_pages/story/blog/dead-trading-bot-to-monitoring-engine/page");
      return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute(
  "/$locale/story/blog/dead-trading-bot-to-monitoring-engine/",
)({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
