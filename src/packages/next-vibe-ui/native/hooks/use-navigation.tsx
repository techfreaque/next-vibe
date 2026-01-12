/**
 * React Native implementation of Next.js navigation hooks
 * Uses Expo Router for navigation
 */
import {
  usePathname as useExpoPathname,
  useRouter as useExpoRouter,
} from "expo-router";

/**
 * Get the current pathname
 * Compatible with Next.js usePathname
 */
export function usePathname(): string {
  return useExpoPathname();
}

/**
 * Get the router instance
 * Compatible with Next.js useRouter (subset of functionality)
 */
export function useRouter(): {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
} {
  const router = useExpoRouter();

  return {
    push: (href: string): void => {
      router.push(href);
    },
    replace: (href: string): void => {
      router.replace(href);
    },
    back: (): void => {
      router.back();
    },
  };
}

/**
 * Get route params
 * Compatible with Next.js useParams
 */
export function useParams(): Record<string, string | string[]> {
  // Expo Router's useLocalSearchParams or useGlobalSearchParams can be used
  // For now returning empty object as placeholder
  return {};
}

/**
 * Get search params
 * Compatible with Next.js useSearchParams
 */
export function useSearchParams(): URLSearchParams {
  // Placeholder for React Native implementation
  return new URLSearchParams();
}
