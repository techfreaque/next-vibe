import type { ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type SectionProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Section(props: SectionProps): React.JSX.Element {
  return <section {...props} />;
}
