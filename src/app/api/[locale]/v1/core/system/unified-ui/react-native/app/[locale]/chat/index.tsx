/**
 * Expo Router compatibility wrapper for Next.js page.tsx
 *
 * This wrapper handles:
 * - Async component loading (Next.js pages can be async Server Components)
 * - URL params conversion (Next.js uses async params, Expo Router uses hooks)
 * - Loading states with ActivityIndicator
 * - Error handling
 * - Type-safe params forwarding
 *
 * PRODUCTION-READY: This wrapper is designed to work with the actual src/app/[locale]
 * page.tsx when we migrate to using that as the root.
 */

import { useLocalSearchParams } from "expo-router";
import type React from "react";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Import the Next.js page component
import PageComponent from "./page";

/**
 * Wrapper component that converts Expo Router's synchronous params
 * to Next.js 15's async params format
 */
export default function LocaleIndexWrapper(): React.ReactElement {
  const params = useLocalSearchParams<{ locale: CountryLanguage }>();
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
            params: Promise.resolve({
              locale: params.locale,
            }),
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
                      "app.api.v1.core.system.unifiedUi.react-native.app.index.failedToLoadPage",
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
  }, [logger, params.locale, t]);

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
            "app.api.v1.core.system.unifiedUi.react-native.app.index.failedToLoadPage",
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
}
