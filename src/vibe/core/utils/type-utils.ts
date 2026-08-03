/**
 * Utility types for cleaning and prettifying complex types
 */

/**
 * Makes all properties in T optional recursively
 */
export type DeepPartial<T> = {
  // eslint-disable-next-line restricted/no-object-type -- Generic utility type for recursive type operations
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Prettifies complex intersection types by flattening them
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
