/**
 * CLI navigation hooks — terminal has no URL bar or browser history.
 * useParams/usePathname/useRouter/useSearchParams are stubs.
 * useSilentHistory is a no-op (no browser URL to update).
 */

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

export function useParams(): Record<string, string> {
  return {};
}

export function usePathname(): string {
  return "/";
}

export function useRouter(): {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
} {
  return { push: noop, replace: noop, back: noop };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

/**
 * CLI: push/replace are no-ops — no browser URL to manage.
 */
export function useSilentHistory(): {
  pushState: (url: string) => void;
  replaceState: (url: string) => void;
} {
  return {
    pushState: noop,
    replaceState: noop,
  };
}
