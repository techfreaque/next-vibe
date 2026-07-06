// AUTO-GENERATED from src/app/[locale]/story/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Layout } from "@/app/[locale]/story/layout";

import { toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/story/layout");
    return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

function LayoutComponent(): JSX.Element {
  return (
    <Layout {...Route.useLoaderData()}>
      <Outlet />
    </Layout>
  );
}

export const Route = createFileRoute("/$locale/story")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: LayoutComponent,
});
