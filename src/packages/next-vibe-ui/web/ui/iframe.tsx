import type { ReactNode } from "react";
import type { StyleType } from "../utils/style-type";

export type IframeProps = {
  children?: ReactNode;
  id?: string;
  src?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  allow?: string;
  sandbox?: string;
  loading?: "eager" | "lazy";
  srcDoc?: string;
} & StyleType;

export function Iframe(props: IframeProps): React.JSX.Element {
  // Ensure title and sandbox are provided for accessibility and security
  const { title = "", sandbox = "allow-scripts allow-same-origin", ...restProps } = props;

  return <iframe title={title} sandbox={sandbox} {...restProps} />;
}
