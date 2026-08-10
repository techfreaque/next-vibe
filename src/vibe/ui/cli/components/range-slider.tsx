import { Text } from "ink";
import type { JSX } from "react";

import type {
  RangeSliderOption,
  RangeSliderProps,
} from "../../web/ui/range-slider";

export type {
  RangeSliderOption,
  RangeSliderProps,
} from "../../web/ui/range-slider";

// CLI: show selected range as "minLabel..maxLabel" - no drag UI in terminal
export function RangeSlider({
  options,
  minIndex,
  maxIndex,
}: RangeSliderProps): JSX.Element {
  const minOpt = options[minIndex];
  const maxOpt = options[maxIndex];
  const minLabel = minOpt?.label ?? String(minIndex);
  const maxLabel = maxOpt?.label ?? String(maxIndex);
  return (
    <Text>
      {minLabel}..{maxLabel}
    </Text>
  );
}
