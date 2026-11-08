/**
 * Next.js client instrumentation - runs before any app code and before
 * hydration. Only for things that must exist before the first module loads.
 */

import { installArrayPolyfills } from "./vibe/ui/web/lib/array-polyfills";

installArrayPolyfills();
