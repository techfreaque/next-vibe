import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type NavProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Nav(props: NavProps): React.JSX.Element {
  return <nav {...props} />;
}
