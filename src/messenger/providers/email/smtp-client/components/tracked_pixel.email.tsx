/**
 * TrackedPixel Component
 * Intentionally renders nothing: emails contain no remote resources (Max,
 * 2026-11-27), so there is no open-tracking pixel. Kept so layouts stay unchanged.
 */

import type { JSX } from "react";

export function TrackedPixel(): JSX.Element | null {
  return null;
}
