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
