/**
 * Expo Router compatibility wrapper for Next.js layout.tsx
 *
 * This wrapper handles:
 * - Async layout component loading (Next.js layouts can be async)
 * - URL params conversion (Next.js uses async params, Expo Router uses hooks)
 * - Children prop forwarding via Slot
 * - Loading states with ActivityIndicator
 * - Error handling
 * - Type-safe params forwarding
 *
 * PRODUCTION-READY: This wrapper is designed to work with the actual src/app/[locale]
 * layout.tsx when we migrate to using that as the root.
 */

import { Slot, useLocalSearchParams } from "expo-router";
import { parseError } from "next-vibe/shared/utils";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Import the Next.js layout component
import LayoutComponent from "./layout";

/**
 * Wrapper component that converts Expo Router's synchronous params
 * to Next.js 15's async params format for layouts
 */
export default function LocaleLayoutWrapper(): React.ReactElement {
  const params = useLocalSearchParams<{ locale: CountryLanguage }>();
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const logger = useMemo(
    () => createEndpointLogger(true, Date.now(), params.locale),
    [params.locale],
  );
  const { t } = simpleT(params.locale);

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
            params: Promise.resolve({
              locale: params.locale,
            }),
            children: slotElement,
          });

          if (!cancelled) {
            setContent(result);
          }
        } catch (err) {
          if (!cancelled) {
            logger.error("Failed to load layout", parseError(err));
            setError(
              err instanceof Error
                ? err
                : new Error(
                    t(
                      "app-native._layout.failedToLoadLayout",
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
            "app-native._layout.failedToLoadLayout",
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

  // Render the loaded layout content
  return content;
}
