import Ionicons from "@expo/vector-icons/Ionicons";
import { styled } from "nativewind";
import type { ComponentProps, JSX } from "react";

import { type IconComponent } from "../../web/lib/helper";

// Font icon: map the className's color/width onto Ionicons' color/size props.
const StyledIonicons = styled(Ionicons, {
  className: {
    target: "style",
    nativeStyleMapping: { color: "color", width: "size" },
  },
});

type BrandGlyph = ComponentProps<typeof Ionicons>["name"];

/** lucide 1.x ships no brand icons - native brand logos come from Ionicons. */
export function createBrandIcon(name: BrandGlyph): IconComponent {
  return function BrandIcon({ className }): JSX.Element {
    return <StyledIonicons name={name} className={className} />;
  };
}
