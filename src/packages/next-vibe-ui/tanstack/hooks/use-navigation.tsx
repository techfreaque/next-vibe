/**
 * TanStack Start implementation of Next.js navigation hooks
 * Mirrors the web/hooks/use-navigation.tsx interface
 */
import { useMemo, useRef } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
import { useMemo, useRef } from "react";
  useRouter as useTanStackRouter,
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

export { useParams };

/**
 * Get current URL search params
 * Compatible with Next.js useSearchParams - works without specifying a route
 */
export function useSearchParams(): URLSearchParams {
  const { searchStr } = useLocation();
  return new URLSearchParams(searchStr);
}

/**
 * Returns push/replace helpers that update the browser URL without triggering
 * TanStack Router's navigation pipeline (no loader re-run, no re-render).
 * Used for encoding ephemeral UI state (e.g. nav stack) in the URL.
 */
export function useSilentHistory(): {
  pushState: (url: string) => void;
  replaceState: (url: string) => void;
} {
  const router = useTanStackRouter();
  // Stable refs so the returned object identity is preserved across renders
  const routerRef = useRef(router);
  routerRef.current = router;
  return useMemo(
    () => ({
      pushState: (url: string): void => {
        routerRef.current.history._ignoreSubscribers = true;
        window.history.pushState(null, "", url);
        routerRef.current.history._ignoreSubscribers = false;
      },
      replaceState: (url: string): void => {
        routerRef.current.history._ignoreSubscribers = true;
        window.history.replaceState(null, "", url);
        routerRef.current.history._ignoreSubscribers = false;
      },
    }),
    [],
  );
}

export { notFound } from "../lib/not-found";
