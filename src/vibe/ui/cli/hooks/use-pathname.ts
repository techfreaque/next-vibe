/**
 * CLI usePathname — the ui/cli counterpart of ui/web/hooks/use-pathname.
 *
 * The web hook wraps next/navigation's usePathname. A terminal has no URL, so the
 * CLI answer already lives in ./use-navigation (which stubs the whole
 * params/pathname/router/searchParams surface). Re-exported here so the module path
 * matches the web layout and widget code importing "next-vibe/ui/hooks/use-pathname"
 * resolves on both surfaces.
 */

export { usePathname } from "./use-navigation";
