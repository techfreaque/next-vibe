/**
 * TanStack client bootstrap - mirror of src/instrumentation-client.ts.
 * Imported FIRST by client.tsx: ES imports evaluate in order, so this runs
 * before any app module (model registries call toSorted at module load).
 */

import { installArrayPolyfills } from "next-vibe/ui/lib/array-polyfills";
import { installDomMutationGuard } from "next-vibe/ui/lib/dom-mutation-guard";

installArrayPolyfills();
installDomMutationGuard();
