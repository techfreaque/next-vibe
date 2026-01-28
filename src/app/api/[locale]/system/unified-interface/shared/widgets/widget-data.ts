/**
 * Widget Data Type
 * Separated to avoid circular dependencies
 */

/**
 * Legacy generic widget data type
 * @deprecated Use schema-inferred types instead (ExtractWidgetValue<TSchema>)
 */
export type WidgetData =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | WidgetData[]
  | { [key: string]: WidgetData };
