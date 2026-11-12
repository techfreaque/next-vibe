/**
 * Next.js client instrumentation - runs before any app code and before
 * hydration. Only for things that must exist before the first module loads.
 * TanStack mirror: src/generated/app-tanstack/client-bootstrap.ts
 */

import { installArrayPolyfills } from "./vibe/ui/web/lib/array-polyfills";
import { installDomMutationGuard } from "./vibe/ui/web/lib/dom-mutation-guard";

installArrayPolyfills();
installDomMutationGuard();
