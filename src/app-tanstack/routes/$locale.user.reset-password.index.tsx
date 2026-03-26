// AUTO-GENERATED from src/app/[locale]/user/(other)/reset-password/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/user/(other)/reset-password/page";
import { TanstackPage as GroupLayout } from "@/app/[locale]/user/(other)/layout";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/user/(other)/reset-password/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

export const Route = createFileRoute("/$locale/user/reset-password/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <GroupLayout><Page {...Route.useLoaderData()} /></GroupLayout>,
});
