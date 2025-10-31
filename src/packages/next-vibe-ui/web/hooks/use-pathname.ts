import { usePathname as useNextPathname } from "next/navigation";

/**
 * Platform-agnostic usePathname hook for web
 * Uses Next.js usePathname
 */
export function usePathname(): string {
  return useNextPathname();
}
