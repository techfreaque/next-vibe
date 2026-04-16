import { Text } from "ink";
import type { JSX } from "react";

import type {
  SliderRootProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
} from "../../web/ui/slider";

export type {
  SliderRootProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
} from "../../web/ui/slider";

// CLI: show value range as "min..max" — no drag UI in terminal
export function Slider({ value, min, max }: SliderRootProps): JSX.Element {
  const vals = value ?? [];
  const displayMin = vals[0] ?? min ?? 0;
  const displayMax = vals[vals.length - 1] ?? max ?? 100;
  if (vals.length === 1) {
    return <Text>{displayMin}</Text>;
  }
  return (
    <Text>
      {displayMin}..{displayMax}
    </Text>
  );
}
Slider.displayName = "Slider";

// Sub-components are no-ops in CLI — Slider renders the full representation
export function SliderTrack({ children }: SliderTrackProps): JSX.Element {
  return <>{children}</>;
}
SliderTrack.displayName = "SliderTrack";

export function SliderRange(): null {
  return null;
}
SliderRange.displayName = "SliderRange";

export function SliderThumb(): null {
  return null;
}
SliderThumb.displayName = "SliderThumb";
