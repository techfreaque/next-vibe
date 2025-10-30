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
import { ActivityIndicator, Text, View } from "react-native";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
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
 */
type AnyNextPageComponent =
  // Standard async page with Promise params
  | ((props: NextPageProps<ExpoRouterParams>) => Promise<JSX.Element>)
  // Sync page with Promise params
  | ((props: NextPageProps<ExpoRouterParams>) => JSX.Element)
  // Page that redirects (returns never)
  | ((props: NextPageProps<ExpoRouterParams>) => never)
  // Legacy sync params (non-Next.js 15)
  | ((props: {
      params: ExpoRouterParams;
    }) => Promise<JSX.Element> | JSX.Element | never)
  // Any other Next.js page shape with generic props
  | ((
      // eslint-disable-next-line no-restricted-syntax
      props: Record<string, unknown>,
    ) => Promise<JSX.Element> | JSX.Element | never);

/**
 * Creates a wrapper for Next.js page components to work in Expo Router
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
>(PageComponent: AnyNextPageComponent): () => React.ReactElement {
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
            // Call the async page component with Next.js 15 format params
            const result = await PageComponent({
              params: Promise.resolve(params),
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
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {t(
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
            )}
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {error.message}
          </Text>
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
 */
type AnyNextLayoutComponent =
  // Standard async layout with Promise params
  | ((props: NextLayoutProps<ExpoRouterParams>) => Promise<JSX.Element>)
  // Sync layout with Promise params
  | ((props: NextLayoutProps<ExpoRouterParams>) => JSX.Element)
  // Legacy sync params (non-Next.js 15)
  | ((props: {
      params: ExpoRouterParams;
      children: React.ReactNode;
    }) => Promise<JSX.Element> | JSX.Element)
  // Any other Next.js layout shape
  | ((props: any) => Promise<JSX.Element> | JSX.Element);

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
>(LayoutComponent: AnyNextLayoutComponent): () => React.ReactElement {
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
            // Call the async layout component with Next.js 15 format params
            const result = await LayoutComponent({
              params: Promise.resolve(params),
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
  PageComponent: AnyNextPageComponent,
  options: WrapperOptions = {},
): () => React.ReactElement {
  return function PageWrapperWithOptions(): React.ReactElement {
    const routeParams = useLocalSearchParams<TParams>();
    const params = useMemo(
      () => ({ ...routeParams, ...options.additionalParams }) as TParams,
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
            const result = await PageComponent({
              params: Promise.resolve(params),
            });

            if (!cancelled) {
              setContent(result);
            }
          } catch (err) {
            if (!cancelled) {
              logger.error("Failed to load page", err);
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
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {t(
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.failedToLoadPage",
            )}
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {error.message}
          </Text>
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
