// AUTO-GENERATED from src/_pages/subscription/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Layout } from "@/_pages/subscription/layout";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const { tanstackLoader } = await import("@/_pages/subscription/layout");
      return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
    }),
  );

function LayoutComponent(): JSX.Element {
  return (
    <Layout {...Route.useLoaderData()}>
      <Outlet />
    </Layout>
  );
}

export const Route = createFileRoute("/$locale/subscription")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: LayoutComponent,
});
