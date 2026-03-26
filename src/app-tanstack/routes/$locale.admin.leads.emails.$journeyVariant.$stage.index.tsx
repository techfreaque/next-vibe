// AUTO-GENERATED from src/app/[locale]/admin/leads/emails/[journeyVariant]/[stage]/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/admin/leads/emails/[journeyVariant]/[stage]/page";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: Record<string, string>) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/admin/leads/emails/[journeyVariant]/[stage]/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });
  });

export const Route = createFileRoute("/$locale/admin/leads/emails/$journeyVariant/$stage/")({
  staleTime: 0,
  loader: ({ params }) => loadData({ data: params as Record<string, string> }),
  component: () => <Page {...Route.useLoaderData()} />,
});
