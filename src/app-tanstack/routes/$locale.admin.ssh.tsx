// AUTO-GENERATED from src/app/[locale]/admin/ssh/layout.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Layout } from "@/app/[locale]/admin/ssh/layout";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/admin/ssh/layout");
    return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

export const Route = createFileRoute("/$locale/admin/ssh")({
  staleTime: Infinity,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Layout {...Route.useLoaderData()}><Outlet /></Layout>,
});
