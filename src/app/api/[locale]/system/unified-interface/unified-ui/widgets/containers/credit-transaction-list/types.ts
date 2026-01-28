/**
 * Credit Transaction List Widget Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Credit Transaction List Widget Configuration
 */
export interface CreditTransactionListWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> extends BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild> {
  type: WidgetType.CREDIT_TRANSACTION_LIST;
}
