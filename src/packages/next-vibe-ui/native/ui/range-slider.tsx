/**
 * Range Slider Component - Native Stub
 * This is a placeholder for native implementation
 */

import type { JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { RangeSliderProps } from "../../web/ui/range-slider";

export function RangeSlider<TTranslationKey extends string = TranslationKey>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: RangeSliderProps<TTranslationKey>,
): JSX.Element {
  return <></>;
}

export type {
  RangeSliderOption,
  RangeSliderProps,
} from "../../web/ui/range-slider";
