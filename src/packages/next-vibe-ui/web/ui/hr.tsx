import type { StyleType } from "../utils/style-type";

export type HrProps = {
  id?: string;
} & StyleType;

export function Hr(props: HrProps): React.JSX.Element {
  return <hr {...props} />;
}
