import { Redirect } from "expo-router";

import { defaultLocale } from "@/i18n/core/config";

/**
 * Root Index - Redirects to default locale
 * Works for both Next.js and Expo Router
 */
export default function RootIndex(): React.ReactElement {
  return <Redirect href={`/${defaultLocale}`} />;
}
