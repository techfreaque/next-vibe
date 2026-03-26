/**
 * TanStack Start implementation of Next.js navigation hooks
 * Mirrors the web/hooks/use-navigation.tsx interface
 */
import {
  useLocation,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";

/**
 * Get the router instance
 * Compatible with Next.js useRouter (subset of functionality)
 */
export function useRouter(): {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
} {
  const navigate = useNavigate();

  return {
    push: (url: string): void => {
      void navigate({ href: url });
    },
    replace: (url: string): void => {
      void navigate({ href: url, replace: true });
    },
    back: (): void => {
      window.history.back();
    },
  };
}

/**
 * Get the current pathname
 * Compatible with Next.js usePathname
 */
export function usePathname(): string {
  return useLocation().pathname;
}

export { useParams, useSearch as useSearchParams };
export { notFound } from "../lib/not-found";
