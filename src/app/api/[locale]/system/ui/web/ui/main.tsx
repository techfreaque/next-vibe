import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type MainProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Main(props: MainProps): React.JSX.Element {
  return <main {...props} />;
}
