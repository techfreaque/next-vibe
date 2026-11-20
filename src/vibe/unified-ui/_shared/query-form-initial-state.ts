import type { WidgetData } from "../../core/utils/json";

function isRecord(value: WidgetData): value is Record<string, WidgetData> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/** Apply explicit query inputs while leaving defaults and saved siblings intact. */
export function applyQueryFormInitialState<
  TValues extends Record<string, WidgetData>,
>(values: TValues, initialState: Record<string, WidgetData>): TValues {
  return {
    ...values,
    ...Object.fromEntries(
      Object.entries(initialState).map(([key, value]) => {
        const previousValue = values[key];
        return [
          key,
          isRecord(previousValue) && isRecord(value)
            ? applyQueryFormInitialState(previousValue, value)
            : value,
        ];
      }),
    ),
  };
}
