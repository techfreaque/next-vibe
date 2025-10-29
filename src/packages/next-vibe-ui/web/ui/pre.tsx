import type { ComponentPropsWithoutRef, JSX } from "react";

export function Pre(props: ComponentPropsWithoutRef<"pre">): JSX.Element {
  return <pre {...props} />;
}
