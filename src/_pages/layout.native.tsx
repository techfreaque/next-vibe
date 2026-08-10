"use custom";

/**
 * React Native Root Layout
 * Platform-specific root layout for Expo/React Native
 * Uses shared providers from layout-shared.tsx
 * Body component already provides SafeAreaView wrapper
 */

import { PortalHost } from "@rn-primitives/portal";
import { Slot, useLocalSearchParams } from "expo-router";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Body } from "next-vibe/ui/components/body";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { RootProviders } from "./layout-shared";

/**
 * Sync, not async: this reads route params via a hook, and React does not
 * support async components that call hooks. The web layout can await directly
 * because it is a server component; here the availability lookup has to resolve
 * through state instead.
 */
export default function RootLayoutNative(): JSX.Element {
  const { locale } = useLocalSearchParams<{ locale: CountryLanguage }>();
  const [availability, setAvailability] = useState<AgentEnvAvailability | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      const resolved = await getEnvAvailability();
      // Guard against a resolve landing after unmount.
      if (active) {
        setAvailability(resolved);
      }
    };
    void load();
    return (): void => {
      active = false;
    };
  }, []);

  // RootProviders requires resolved availability, so hold the bare shell for
  // the one frame before it lands rather than feeding the providers a partial.
  if (!availability) {
    return <Body>{null}</Body>;
  }

  return (
    <Body>
      <RootProviders locale={locale} availability={availability}>
        <Slot />
        <PortalHost />
      </RootProviders>
    </Body>
  );
}
