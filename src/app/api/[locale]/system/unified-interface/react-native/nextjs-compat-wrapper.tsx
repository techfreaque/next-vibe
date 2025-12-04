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
 * import { createPageWrapper } from "@/app/api/[locale]/system/unified-interface/react-native/utils/nextjs-compat-wrapper";
 * import PageComponent from "./page";
 * export default createPageWrapper(PageComponent);
 *
 * // For layouts (Slot-based, no custom UI)
 * import { createLayoutWrapper } from "@/app/api/[locale]/system/unified-interface/react-native/utils/nextjs-compat-wrapper";
 * import LayoutComponent from "./layout";
 * export default createLayoutWrapper(LayoutComponent);
 * ```
 */

import { Slot, useLocalSearchParams } from "expo-router";
import type React from "react";
import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Span } from "next-vibe-ui/ui/span";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { envClient } from "@/config/env-client";

/**
 * Next.js 15 async component props format
 */
export interface AsyncPageRouterProps {
  params: Promise<PageRouterParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
export interface AsyncLayoutRouterProps extends AsyncPageRouterProps {
  children: React.ReactNode;
}

/**
 * Next.js 15 sync component props format
 */
export interface SyncPageRouterProps {
  params: PageRouterParams;
  searchParams?: Record<string, string | string[] | undefined>;
}
export interface SyncLayoutRouterProps extends SyncPageRouterProps {
  children: React.ReactNode;
}

/**
 * Expo Router params with locale
 */
export interface PageRouterParams extends Record<string, string | string[]> {
  locale: CountryLanguage;
}

/**
 * Type for any Next.js page component (handles various signatures)
 * Using a single flexible signature to avoid intersection type issues
 */
export type AnyNextComponent =
  | AnyNextSyncPageComponent
  | AnyNextAsyncPageComponent;
export type AnyNextSyncPageComponent = (
  props: SyncLayoutRouterProps,
) => JSX.Element | never;

export type AnyNextAsyncPageComponent = (
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
      () => createEndpointLogger(false, Date.now(), params.locale),
      [params.locale],
    );
    const { t } = useMemo(() => simpleT(params.locale), [params.locale]);
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
                    t(
                      "app.api.system.unifiedInterface.reactNative.errors.failedToLoadPage",
                    ),
                  ),
            );
          }
        }
      })();

      return (): void => {
        cancelled = true;
      };
      // oxlint-disable-next-line exhaustive-deps
    }, [logger, JSON.stringify(params), t]);

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
            {t(
              "app.api.system.unifiedInterface.reactNative.errors.failedToLoadPage",
            )}
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
 * Creates a wrapper for Next.js page components to work in Expo Router
 * (Legacy version with static import - kept for backwards compatibility)
 *
 * Features:
 * - Full loading and error UI
 * - ActivityIndicator during load
 * - Error display with message
 * - Async component resolution
 * - Handles various Next.js component signatures
 *
 * @param PageComponent - The Next.js page component to wrap
 * @returns A synchronous Expo Router compatible component
 */
export function createPageWrapper(
  PageComponent: AnyNextComponent,
): () => React.ReactElement {
  return function PageWrapper(): React.ReactElement {
    const params = useLocalSearchParams<PageRouterParams>();
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(false, Date.now(), params.locale),
      [params.locale],
    );
    const { t } = simpleT(params.locale);

    useEffect(() => {
      let cancelled = false;

      // Use queueMicrotask to defer promise creation outside of React's render phase
      // This prevents React 19's Suspense from detecting an uncached promise
      queueMicrotask(() => {
        void (async (): Promise<void> => {
          try {
            const result = await renderedComponent(PageComponent, params, null);

            if (!cancelled) {
              setContent(result);
            }
          } catch (err) {
            if (!cancelled) {
              const parsedError = parseError(err);
              const errorMessage = parsedError.message;

              // Check if this is a Node.js module import error (admin routes with server code)
              const isNodeModuleError =
                errorMessage.includes("Node standard library") ||
                errorMessage.includes("node:") ||
                errorMessage.includes("Module not found");

              if (isNodeModuleError) {
                logger.warn(
                  "Page uses server-only features not available in React Native. " +
                    "A .native override is needed for this route.",
                  { error: parsedError, route: params },
                );
              } else {
                logger.error("Failed to load page", { error: parsedError });
              }

              setError(
                err instanceof Error
                  ? err
                  : new Error(
                      t(
                        "app.api.system.unifiedInterface.reactNative.errors.failedToLoadPage",
                      ),
                    ),
              );
            }
          }
        })();
      });

      return (): void => {
        cancelled = true;
      };
    }, [logger, params, t]);

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
            {t(
              "app.api.system.unifiedInterface.reactNative.errors.failedToLoadPage",
            )}
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

    // Render the loaded page content
    return content;
  };
}

/**
 * Creates a wrapper for Next.js layout components to work in Expo Router
 *
 * Features:
 * - Uses Slot for children rendering
 * - No custom loading/error UI (layout route constraint)
 * - Falls back to Slot on error
 * - Async component resolution
 * - Handles various Next.js component signatures
 *
 * Note: Layout routes in Expo Router can only contain Screen children,
 * so we cannot show custom loading or error UI. Instead, we render
 * a Slot while loading or on error.
 *
 * @param LayoutComponent - The Next.js layout component to wrap
 * @returns A synchronous Expo Router compatible component
 */
export function createLayoutWrapper(
  LayoutComponent: AnyNextComponent,
): () => React.ReactElement {
  return function LayoutWrapper(): React.ReactElement {
    const params = useLocalSearchParams<PageRouterParams>();
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(false, Date.now(), params.locale),
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
              // On error, just render Slot directly
              setContent(slotElement);
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
      () => createEndpointLogger(false, Date.now(), params.locale),
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
  _PageComponent: AnyNextComponent,
): _PageComponent is AnyNextAsyncPageComponent {
  return true;
  // TODO figure out a way to check if component is async
  // return typeof PageComponent.then === "function";
}
