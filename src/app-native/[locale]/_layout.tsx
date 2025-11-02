"use custom"

/**
 * React Native Root Layout
 * Platform-specific root layout for Expo/React Native
 * Uses shared providers from layout-shared.tsx
 */

import {
  Slot,
  useLocalSearchParams } from "expo-router";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { RootProviders } from "@/app/[locale]/layout-shared";
import Body from "@/packages/next-vibe-ui/native/ui/body";

export default function RootLayoutNative(): JSX.Element {
  const { locale } = useLocalSearchParams<{ locale: CountryLanguage }>();
  return (
    <Body>
      <RootProviders locale={locale}>
        <Slot />
      </RootProviders> 
    </Body> 
  );
}
