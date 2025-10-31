import type { JSX } from "react";
import type { PreProps } from "next-vibe-ui/ui/pre";
import type { TextStyle } from "react-native";

import { Span } from "./span";

export function Pre(props: PreProps): JSX.Element {
  const monoStyle: TextStyle = {
    fontFamily: "monospace",
  };

  return <Span {...props} style={monoStyle} />;
}
