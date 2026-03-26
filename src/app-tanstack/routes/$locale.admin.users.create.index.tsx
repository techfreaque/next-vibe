// AUTO-GENERATED from src/app/[locale]/admin/users/create/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/admin/users/create/page";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/admin/users/create/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

export const Route = createFileRoute("/$locale/admin/users/create/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Page {...Route.useLoaderData()} />,
});
