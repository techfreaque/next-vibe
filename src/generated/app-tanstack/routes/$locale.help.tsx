// AUTO-GENERATED from src/_pages/help/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { JSX } from "react";

import { TanstackPage as Layout } from "@/_pages/help/layout";

import { runPageLoader } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" }).handler(async () =>
  runPageLoader(async () => {
    const { tanstackLoader } = await import("@/_pages/help/layout");
    return tanstackLoader();
  }),
);

function LayoutComponent(): JSX.Element {
  return (
    <Layout {...Route.useLoaderData()}>
      <Outlet />
    </Layout>
  );
}

export const Route = createFileRoute("/$locale/help")({
  staleTime: Infinity,
  loader: () => loadData(),
  component: LayoutComponent,
});
