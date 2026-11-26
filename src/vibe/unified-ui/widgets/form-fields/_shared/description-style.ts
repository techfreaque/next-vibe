"use client";

import { createContext, useContext } from "react";

import type { DescriptionStyle } from "../../../_shared/field-config-types";

export const CompactFieldHelpContext = createContext(false);

export function useFormFieldDescriptionStyle(
  style: DescriptionStyle,
  keepDescription = false,
): DescriptionStyle | undefined {
  const compact = useContext(CompactFieldHelpContext);
  if (compact && style === "tooltip") {
    return keepDescription ? "inline" : undefined;
  }
  return style;
}
