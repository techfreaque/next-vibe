import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 *
 * Lives here rather than in `core/`: tailwind class merging is a UI concern,
 * and keeping it out of the foundation layer keeps `clsx`/`tailwind-merge` off
 * core's dependency surface.
 *
 * Not under `ui/` either — that namespace is platform-swapped
 * (`next-vibe/ui/*` resolves to `ui/web`, `ui/native` or `ui/cli` depending on
 * the build), so anything under it must exist once per platform tree. `cn` is
 * platform-agnostic: one pure implementation serves web, native and CLI alike.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
