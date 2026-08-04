/// <reference types="vite/client" />
// import "next-vibe/ui/tanstack/global-css";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import globalsUrl from "next-vibe/ui/globals.css?url";

import { TanstackPage as RootLayout } from "@/_pages/layout";

const loadLayout = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const { tanstackLoader } = await import("@/_pages/layout");
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
  shellComponent: function ShellComponent({ children }) {
    return <RootLayout {...Route.useLoaderData()}>{children}</RootLayout>;
  },
  component: () => <Outlet />,
});
