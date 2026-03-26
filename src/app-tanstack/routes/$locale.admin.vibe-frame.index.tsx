// AUTO-GENERATED from src/app/[locale]/admin/vibe-frame/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/admin/vibe-frame/page";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/admin/vibe-frame/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

export const Route = createFileRoute("/$locale/admin/vibe-frame/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Page {...Route.useLoaderData()} />,
});
