// AUTO-GENERATED from src/app/[locale]/story/build-a-skill/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/app/[locale]/story/build-a-skill/page";

import { toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } =
      await import("@/app/[locale]/story/build-a-skill/page");
    return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData()} />;
}

export const Route = createFileRoute("/$locale/story/build-a-skill/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
