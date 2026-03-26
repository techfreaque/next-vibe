import { createRootRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TanstackPage as RootLayout } from "@/app/[locale]/layout";
import type { CountryLanguage } from "@/i18n/core/config";

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
  loader: ({ location }) => {
    const locale = location.pathname.split("/")[1] ?? "";
    return loadLayout({ data: { locale } });
  },
  shellComponent: ({ children }) => (
    <RootLayout {...Route.useLoaderData()}>{children}</RootLayout>
  ),
  component: () => <Outlet />,
});
