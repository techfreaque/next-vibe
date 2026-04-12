// AUTO-GENERATED from src/app/[locale]/user/(auth)/signup/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TanstackPage as Layout } from "@/app/[locale]/user/(auth)/signup/layout";

const loadData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { tanstackLoader } = await import("@/app/[locale]/user/(auth)/signup/layout");
    return tanstackLoader();
  });

export const Route = createFileRoute("/$locale/user/_auth/signup")({
  staleTime: Infinity,
  loader: () => loadData(),
  component: () => <Layout {...Route.useLoaderData()}><Outlet /></Layout>,
});
