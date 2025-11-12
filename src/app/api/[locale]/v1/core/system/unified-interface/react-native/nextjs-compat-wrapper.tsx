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
 * import { createPageWrapper } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/utils/nextjs-compat-wrapper";
 * import PageComponent from "./page";
 * export default createPageWrapper(PageComponent);
 *
 * // For layouts (Slot-based, no custom UI)
 * import { createLayoutWrapper } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/utils/nextjs-compat-wrapper";
 * import LayoutComponent from "./layout";
 * export default createLayoutWrapper(LayoutComponent);
 * ```
 */

import { Slot, useLocalSearchParams } from "expo-router";
import type React from "react";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Span } from "next-vibe-ui/ui/span";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Base params type for routing
 */
export type RouteParams = Record<string, string | string[] | number | boolean>;

/**
 * Next.js 15 page component props format
 */
export interface NextPageProps<TParams extends RouteParams = RouteParams> {
  params: Promise<TParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Next.js 15 layout component props format
 */
export interface NextLayoutProps<TParams extends RouteParams = RouteParams> {
  params: Promise<TParams>;
  children: React.ReactNode;
}

/**
 * Expo Router params with locale
 */
export interface ExpoRouterParams extends Record<string, string | string[]> {
  locale: CountryLanguage;
}

/**
 * Type for any Next.js page component (handles various signatures)
 * Using a single flexible signature to avoid intersection type issues
 */
export type AnyNextPageComponent<
  _TParams extends RouteParams = ExpoRouterParams,
> =
  // eslint-disable-next-line typescript-eslint/no-explicit-any -- Need flexible type to support various Next.js component signatures
  (props: any) => Promise<JSX.Element> | JSX.Element | never;

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
export function createPageWrapperWithImport<
  TParams extends ExpoRouterParams = ExpoRouterParams,
>(importFn: () => Promise<Record<string, unknown>>): () => React.ReactElement {
  return function PageWrapper(): React.ReactElement {
    const params = useLocalSearchParams<TParams>();

    const [content, setContent] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(true, Date.now(), params.locale),
      [params.locale],
    );
    const { t } = useMemo(() => simpleT(params.locale), [params.locale]);
    useEffect(() => {
      let cancelled = false;

      void (async (): Promise<void> => {
        try {
          // Dynamically import the component
          const componentModule = await importFn();
          const PageComponent =
            componentModule.default as AnyNextPageComponent<TParams>;

          // Create a proper Promise<TParams> for Next.js 15 async params
          const paramsPromise: Promise<TParams> = Promise.resolve(params);
          // Call the async page component with Next.js 15 format params
          const result = await PageComponent({
            params: paramsPromise,
          });

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
            }

            setError(
              err instanceof Error
                ? err
                : new Error(
                    t(
                      "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
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
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
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
export function createPageWrapper<
  TParams extends ExpoRouterParams = ExpoRouterParams,
>(PageComponent: AnyNextPageComponent<TParams>): () => React.ReactElement {
  return function PageWrapper(): React.ReactElement {
    const params = useLocalSearchParams<TParams>();
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(true, Date.now(), params.locale),
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
            // Create a proper Promise<TParams> for Next.js 15 async params
            const paramsPromise: Promise<TParams> = Promise.resolve(params);
            // Call the async page component with Next.js 15 format params
            const result = await PageComponent({
              params: paramsPromise,
            });

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
                        "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
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
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
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
 * Type for any Next.js layout component (handles various signatures)
 * Using a single flexible signature to avoid intersection type issues
 */
type AnyNextLayoutComponent<_TParams extends RouteParams = ExpoRouterParams> =
  // eslint-disable-next-line typescript-eslint/no-explicit-any -- Need flexible type to support various Next.js component signatures
  (props: any) => Promise<JSX.Element> | JSX.Element;

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
export function createLayoutWrapper<
  TParams extends ExpoRouterParams = ExpoRouterParams,
>(LayoutComponent: AnyNextLayoutComponent<TParams>): () => React.ReactElement {
  return function LayoutWrapper(): React.ReactElement {
    const params = useLocalSearchParams<TParams>();
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(true, Date.now(), params.locale),
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
            // Create a proper Promise<TParams> for Next.js 15 async params
            const paramsPromise: Promise<TParams> = Promise.resolve(params);
            // Call the async layout component with Next.js 15 format params
            const result = await LayoutComponent({
              params: paramsPromise,
              children: slotElement,
            });

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
export function createLayoutWrapperWithImport<
  TParams extends ExpoRouterParams = ExpoRouterParams,
>(
  importFn: () => Promise<{ default: AnyNextLayoutComponent<TParams> }>,
): () => React.ReactElement {
  return function LayoutWrapper(): React.ReactElement {
    const params = useLocalSearchParams<TParams>();
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(true, Date.now(), params.locale),
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
            // Dynamically import the component
            const layoutModule = await importFn();
            const LayoutComponent = layoutModule.default;

            // Create a proper Promise<TParams> for Next.js 15 async params
            const paramsPromise: Promise<TParams> = Promise.resolve(params);
            // Call the async layout component with Next.js 15 format params
            const result = await LayoutComponent({
              params: paramsPromise,
              children: slotElement,
            });

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
 * Advanced wrapper options for custom behavior
 */
export interface WrapperOptions {
  /**
   * Custom loading component (page wrapper only)
   */
  loadingComponent?: React.ReactElement;
  /**
   * Custom error component renderer (page wrapper only)
   */
  errorComponent?: (
    error: Error,
    locale: CountryLanguage,
  ) => React.ReactElement;
  /**
   * Additional params to merge with route params
   */
  additionalParams?: RouteParams;
}

/**
 * Creates a page wrapper with custom options
 */
export function createPageWrapperWithOptions<
  TParams extends ExpoRouterParams = ExpoRouterParams,
>(
  PageComponent: AnyNextPageComponent<TParams>,
  options: WrapperOptions = {},
): () => React.ReactElement {
  return function PageWrapperWithOptions(): React.ReactElement {
    const routeParams = useLocalSearchParams<TParams>();
    const params: TParams = useMemo(
      () => ({ ...routeParams, ...options.additionalParams }),
      [routeParams],
    );
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const logger = useMemo(
      () => createEndpointLogger(true, Date.now(), params.locale),
      [params.locale],
    );
    const { t } = simpleT(params.locale);

    useEffect(() => {
      let cancelled = false;

      queueMicrotask(() => {
        void (async (): Promise<void> => {
          try {
            // Create a proper Promise<TParams> for Next.js 15 async params
            const paramsPromise: Promise<TParams> = Promise.resolve(params);
            const result = await PageComponent({
              params: paramsPromise,
            });

            if (!cancelled) {
              setContent(result);
            }
          } catch (err) {
            if (!cancelled) {
              logger.error("Failed to load page", { error: parseError(err) });
              setError(
                err instanceof Error
                  ? err
                  : new Error(
                      t(
                        "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
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

    // Error state with custom component
    if (error) {
      if (options.errorComponent) {
        return options.errorComponent(error, params.locale);
      }

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
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
            )}
          </Span>
          <Span style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {error.message}
          </Span>
        </View>
      );
    }

    // Loading state with custom component
    if (!content) {
      if (options.loadingComponent) {
        return options.loadingComponent;
      }

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
