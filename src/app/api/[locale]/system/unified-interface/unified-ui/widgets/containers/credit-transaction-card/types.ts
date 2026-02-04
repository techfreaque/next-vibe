/**
 * Credit Transaction Card Widget Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Credit Transaction Card Widget Configuration
 */
export interface CreditTransactionCardWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.CREDIT_TRANSACTION_CARD;
  leftFields?: NoInfer<(keyof TChildren)[]>;
  rightFields?: NoInfer<(keyof TChildren)[]>;
}
