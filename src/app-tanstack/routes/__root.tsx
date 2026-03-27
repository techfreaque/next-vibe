/// <reference types="vite/client" />
import { TanstackPage as RootLayout } from "@/app/[locale]/layout";
import type { CountryLanguage } from "@/i18n/core/config";
import "@/packages/next-vibe-ui/tanstack/global-css";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import globalsUrl from "../../packages/next-vibe-ui/globals.css?url";

const loadLayout = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/app/[locale]/layout");
    return tanstackLoader({
      params: Promise.resolve({ locale: data.locale as CountryLanguage }),
    });
  });

export const Route = createRootRoute({
  staleTime: 0,
  head: () => ({
    links: [
      { rel: "stylesheet", href: globalsUrl },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/images/apple-icon.png" },
    ],
  }),
  loader: ({ location }) => {
    const locale = location.pathname.split("/")[1] ?? "";
    return loadLayout({ data: { locale } });
  },
  shellComponent: ({ children }) => (
    <RootLayout {...Route.useLoaderData()}>{children}</RootLayout>
  ),
  component: () => <Outlet />,
});
