/// <reference types="vite/client" />
// import "next-vibe/ui/tanstack/global-css";

import { TanstackPage as RootLayout } from "@root-layout/layout";
import { createRootRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { viewportToHead } from "next-vibe/platforms/web/frameworks/tanstack-start/page-head";
import { Body } from "next-vibe/ui/components/body";
import { Head } from "next-vibe/ui/components/head";
import { Html } from "next-vibe/ui/components/html";
import { Scripts } from "next-vibe/ui/components/scripts";
import globalsUrl from "next-vibe/ui/globals.css?url";

const loadLayout = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    // `viewport` is a server-only export (stripped from the client bundle),
    // so it is resolved here and shipped as head data.
    const { tanstackLoader, viewport } = await import("@root-layout/layout");
    const layout = await tanstackLoader({
      params: Promise.resolve({ locale: data.locale as CountryLanguage }),
    });
    return { layout, viewportMeta: viewportToHead(viewport) };
  });

export const Route = createRootRoute({
  staleTime: 0,
  loader: ({ location }) => {
    const locale = location.pathname.split("/")[1] ?? "";
    return loadLayout({ data: { locale } });
  },
  // Page-specific title/description/canonical/hreflang/OG/robots come from
  // each generated page route's head() (resolved from generateMetadata).
  head: ({ loaderData }) => ({
    meta: [{ charSet: "utf-8" }, ...(loaderData?.viewportMeta ?? [])],
    links: [
      { rel: "stylesheet", href: globalsUrl },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/images/apple-icon.png" },
    ],
  }),
  errorComponent: ErrorComponent,
  shellComponent: function ShellComponent({ children }) {
    const layout = Route.useLoaderData()?.layout;
    if (layout) {
      return <RootLayout {...layout}>{children}</RootLayout>;
    }

    // The router still renders its error or not-found child if the loader failed.
    return (
      <Html>
        <Head>{null}</Head>
        <Body>
          {children}
          <Scripts />
        </Body>
      </Html>
    );
  },
  component: () => <Outlet />,
});
