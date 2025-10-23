import { Redirect } from "expo-router";
import { useEffect } from "react";

import { defaultLocale } from "@/i18n/core/config";

/**
 * Root Index - Redirects to default locale
 * Works for both Next.js and Expo Router
 */
export default function RootIndex(): React.ReactElement {
  useEffect(() => {
    console.log("Redirecting to default locale:", defaultLocale);
  }, []);

  return <Redirect href={`/${defaultLocale}`} />;
}
