// AUTO-GENERATED from src/_pages/story/blog/whats-new-may-2026/page.tsx. Add "use custom" to this file to preserve customizations.
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { resolvePageHead } from "next-vibe/platforms/web/frameworks/tanstack-start/page-head";
import type { JSX } from "react";

import { TanstackPage as Page } from "@/_pages/story/blog/whats-new-may-2026/page";

import { runPageLoader, toNextParams } from "../nextjs-compat-wrapper";

const loadData = createServerFn({ method: "GET" })
  .validator((data: Record<string, string>) => data)
  .handler(async ({ data }) =>
    runPageLoader(async () => {
      const page = await import("@/_pages/story/blog/whats-new-may-2026/page");
      const layout0 = await import("@/_pages/layout");
      const [pageData, head] = await Promise.all([
        page.tanstackLoader({
          params: Promise.resolve(toNextParams(data)),
        }),
        resolvePageHead([
          () =>
            layout0.generateMetadata({
              params: Promise.resolve(toNextParams(data)),
            }),
          () =>
            page.generateMetadata({
              params: Promise.resolve(toNextParams(data)),
            }),
        ]),
      ]);
      return { page: pageData, head };
    }),
  );

function PageComponent(): JSX.Element {
  return <Page {...Route.useLoaderData().page} />;
}

export const Route = createFileRoute("/$locale/story/blog/whats-new-may-2026/")(
  {
    staleTime: 0,
    loader: ({ params }) =>
      loadData({ data: params as Record<string, string> }),
    head: ({ loaderData }) => loaderData?.head ?? {},
    component: PageComponent,
  },
);
