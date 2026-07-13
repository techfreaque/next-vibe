/**
 * Reusable wrappers for Next.js async components in Expo Router
 *
 * These utilities handle the conversion between:
 * - Next.js 15's async params format
 * - Expo Router's synchronous useLocalSearchParams hook
 *
 * Key features:
 * - Async component loading with proper React 19 compatibility
 * - Type-safe params forwarding
 * - Loading and error states
 * - Cancellation support
 * - Logger integration
 *
 * Usage:
 * ```tsx
 * // For pages (with loading/error UI)
 * import { createPageWrapper } from "./nextjs-compat-wrapper";
 * import PageComponent from "next-vibe/platforms/react-native/page";
 * export default createPageWrapper(PageComponent);
 *
 * // For layouts (Slot-based, no custom UI)
 * import { createLayoutWrapper } from "./nextjs-compat-wrapper";
 * import LayoutComponent from "next-vibe/platforms/react-native/layout";
 * export default createLayoutWrapper(LayoutComponent);
 * ```
 */

import { Slot, useLocalSearchParams } from "expo-router";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { createEndpointLogger } from "next-vibe/logger/server";
import { scopedTranslation as reactNativeScopedTranslation } from "next-vibe/platforms/react-native/i18n";
import { Span } from "next-vibe/ui/ui/span";
import type React from "react";
import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { envClient } from "@/_old/config/env-client";

/**
 * Next.js 15 async component props format
 */
interface AsyncPageRouterProps {
  params: Promise<PageRouterParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
interface AsyncLayoutRouterProps extends AsyncPageRouterProps {
  children: React.ReactNode;
}

/**
 * Next.js 15 sync component props format
 */
interface SyncPageRouterProps {
  params: PageRouterParams;
  searchParams?: Record<string, string | string[] | undefined>;
}
interface SyncLayoutRouterProps extends SyncPageRouterProps {
  children: React.ReactNode;
}

/**
 * Expo Router params with locale
 */
interface PageRouterParams extends Record<string, string | string[]> {
  locale: CountryLanguage;
}

/**
 * Type for any Next.js page component (handles various signatures)
 * Using a single flexible signature to avoid intersection type issues
 */
type AnyNextComponent = AnyNextSyncPageComponent | AnyNextAsyncPageComponent;
type AnyNextSyncPageComponent = (
  props: SyncLayoutRouterProps,
) => JSX.Element | never;

type AnyNextAsyncPageComponent = (
  props: AsyncLayoutRouterProps,
) => Promise<JSX.Element>;

/**
 * Creates a wrapper for Next.js page components with lazy loading and error boundaries
 *
 * Features:
 * - Dynamic import with error handling
 * - Full loading and error UI
 * - ActivityIndicator during load
 * - Error display with message
 * - Async component resolution
 * - Handles server-only import errors gracefully
 *
 * @param importFn - Function that dynamically imports the page component
 * @returns A synchronous Expo Router compatible component
 */
export function createPageWrapperWithImport(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Dynamic imports: Module exports are unknown until runtime. This is the standard TypeScript type for dynamic import() return values.
  importFn: () => Promise<Record<string, unknown>>,
): () => React.ReactElement {
  return function PageWrapper(): React.ReactElement {
    const params = useLocalSearchParams<PageRouterParams>();

    const [content, setContent] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(false, params.locale),
      [params.locale],
    );
    // Serialize params for stable dependency comparison
    const paramsKey = useMemo(() => JSON.stringify(params), [params]);

    useEffect(() => {
      let cancelled = false;

      void (async (): Promise<void> => {
        try {
          // Dynamically import the component
          const componentModule = await importFn();
          const PageComponent = componentModule.default as AnyNextComponent;
          const result = await renderedComponent(PageComponent, params, null);

          if (!cancelled) {
            setContent(result);
          }
        } catch (err) {
          if (!cancelled) {
            const parsedError = parseError(err);
            const errorMessage = parsedError.message;

            // Check if this is a server-only or Node.js module error
            const isServerOnlyError =
              errorMessage.includes("server-only") ||
              errorMessage.includes("Node standard library") ||
              errorMessage.includes("node:") ||
              errorMessage.includes("Module not found");

            if (isServerOnlyError) {
              logger.warn(
                "Page uses server-only features not available in React Native. " +
                  "A .native override is needed for this route.",
                { error: parsedError, route: params },
              );
            } else {
              logger.error("Failed to load page", { error: parsedError });
              if (envClient.NODE_ENV !== "production") {
                // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Development debugging: Re-throw in dev mode so developers see full stack trace. In production, error is logged and handled via state.
                throw err;
              }
            }

            setError(
              err instanceof Error
                ? err
                : new Error(
                    reactNativeScopedTranslation
                      .scopedT(params.locale)
                      .t("errors.failedToLoadPage"),
                  ),
            );
          }
        }
      })();

      return (): void => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- params used via paramsKey for stable comparison
    }, [logger, paramsKey]);

    // Error state
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Span style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {reactNativeScopedTranslation
              .scopedT(params.locale)
              .t("errors.failedToLoadPage")}
          </Span>
          <Span style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {error.message}
          </Span>
        </View>
      );
    }

    // Loading state
    if (!content) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return content;
  };
}

/**
 * Creates a wrapper for Next.js layout components with dynamic import
 *
 * Features:
 * - Dynamic import with error handling
 * - Uses Slot for children rendering
 * - No custom loading/error UI (layout route constraint)
 * - Falls back to Slot on error
 * - Async component resolution with React 19 compatibility
 * - Handles server-only import errors gracefully
 *
 * @param importFn - Function that dynamically imports the layout component
 * @returns A synchronous Expo Router compatible component
 */
export function createLayoutWrapperWithImport(
  importFn: () => Promise<{ default: AnyNextComponent }>,
): () => React.ReactElement {
  return function LayoutWrapper(): React.ReactElement {
    const params = useLocalSearchParams<PageRouterParams>();
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(false, params.locale),
      [params.locale],
    );

    useEffect(() => {
      let cancelled = false;

      const slotElement = <Slot />;

      // Use queueMicrotask to defer promise creation outside of React's render phase
      // This prevents React 19's Suspense from detecting an uncached promise
      queueMicrotask(() => {
        void (async (): Promise<void> => {
          try {
            const layoutModule = await importFn();
            const LayoutComponent = layoutModule.default;

            const result = await renderedComponent(
              LayoutComponent,
              params,
              slotElement,
            );

            if (!cancelled) {
              setContent(result);
            }
          } catch (err) {
            if (!cancelled) {
              logger.error("Failed to load layout", { error: parseError(err) });
              // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- React error boundary: Layout errors must be thrown so React's error boundary can catch and display them properly to the user.
              throw err;
            }
          }
        })();
      });

      return (): void => {
        cancelled = true;
      };
    }, [logger, params]);

    // Render the loaded layout content or Slot while loading
    // Layout routes must only contain Screen children, so we can't show custom loading/error UI
    return content ?? <Slot />;
  };
}

async function renderedComponent(
  Component: AnyNextComponent,
  params: PageRouterParams,
  children: ReactNode | null,
): Promise<JSX.Element> {
  if (isAsyncComponent(Component)) {
    const paramsPromise: Promise<PageRouterParams> = Promise.resolve(params);
    return await Component({
      params: paramsPromise,
      children,
    });
  }
  return <Component params={params}> {children}</Component>;
}

function isAsyncComponent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _PageComponent: AnyNextComponent,
): _PageComponent is AnyNextAsyncPageComponent {
  return true;
  // TODO figure out a way to check if component is async
  // return typeof PageComponent.then === "function";
}
