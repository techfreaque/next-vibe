// AUTO-GENERATED from src/app/[locale]/story/blog/skill-sharing-economy/page.tsx. Add "use custom" to this file to preserve customizations.
import type { JSX } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/story/blog/skill-sharing-economy/page";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/story/blog/skill-sharing-economy/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

function PageComponent(): JSX.Element { return <Page {...Route.useLoaderData()} />; }

export const Route = createFileRoute("/$locale/story/blog/skill-sharing-economy/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: PageComponent,
});
