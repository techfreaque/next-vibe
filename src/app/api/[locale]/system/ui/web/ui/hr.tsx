import type { StyleType } from "next-vibe/ui/web/utils/style-type";

export type HrProps = {
  id?: string;
} & StyleType;

export function Hr(props: HrProps): React.JSX.Element {
  return <hr {...props} />;
}
