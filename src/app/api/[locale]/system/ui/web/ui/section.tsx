import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type SectionProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Section(props: SectionProps): React.JSX.Element {
  return <section {...props} />;
}
