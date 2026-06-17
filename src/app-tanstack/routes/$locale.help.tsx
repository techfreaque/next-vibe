// AUTO-GENERATED from src/app/[locale]/help/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TanstackPage as Layout } from "@/app/[locale]/help/layout";

const loadData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { tanstackLoader } = await import("@/app/[locale]/help/layout");
    return tanstackLoader();
  });

export const Route = createFileRoute("/$locale/help")({
  staleTime: Infinity,
  loader: () => loadData(),
  component: () => <Layout {...Route.useLoaderData()}><Outlet /></Layout>,
});
