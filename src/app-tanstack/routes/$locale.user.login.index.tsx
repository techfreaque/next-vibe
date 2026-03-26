// AUTO-GENERATED from src/app/[locale]/user/(other)/login/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toNextParams } from "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
import { TanstackPage as Page } from "@/app/[locale]/user/(other)/login/page";
import { TanstackPage as GroupLayout } from "@/app/[locale]/user/(other)/layout";

const loadData = createServerFn({ method: "GET" })
  .inputValidator((data: { params: Record<string, string>; search: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/user/(other)/login/page");
        return tanstackLoader({ params: Promise.resolve(toNextParams(data.params)), searchParams: Promise.resolve(data.search) });
  });

export const Route = createFileRoute("/$locale/user/login/")({
  staleTime: 0,
  validateSearch: (search: Record<string, string>) => search,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ params, deps: { search } }) => loadData({ data: { params: params as Record<string, string>, search } }),
  component: () => <GroupLayout><Page {...Route.useLoaderData()} /></GroupLayout>,
});
