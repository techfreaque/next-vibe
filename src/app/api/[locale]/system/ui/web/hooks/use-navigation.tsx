// Re-export Next.js navigation hooks for web
export {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

/**
 * Returns push/replace helpers that update the browser URL without triggering
 * Next.js router navigation. Next.js doesn't patch pushState/replaceState, so
 * raw calls are safe.
 */
export function useSilentHistory(): {
  pushState: (url: string) => void;
  replaceState: (url: string) => void;
} {
  return {
    pushState: (url: string): void => {
      window.history.pushState(null, "", url);
    },
    replaceState: (url: string): void => {
      window.history.replaceState(null, "", url);
    },
  };
}
