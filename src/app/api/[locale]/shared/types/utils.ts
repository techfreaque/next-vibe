/**
 * Utility types for cleaning and prettifying complex types
 */

// eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for type system operations
export type ExplicitObjectType = object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExplicitAnyType = any;

/**
 * Makes all properties in T optional recursively
 */
export type DeepPartial<T> = {
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties in T required recursively
 */
export type DeepRequired<T> = {
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Prettifies complex intersection types by flattening them
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Removes readonly modifiers from all properties
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Makes specific keys optional while keeping others required
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specific keys required while keeping others optional
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Extracts the return type of a function, handling async functions
 */

export type ExtractReturnType<T> = T extends (
  ...args: ExplicitAnyType[]
) => infer R
  ? R extends Promise<infer U>
    ? U
    : R
  : never;

/**
 * Creates a union of all property values in an object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Excludes null and undefined from a type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Creates a type with all properties from T except those that extend U
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Creates a type with only properties from T that extend U
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Flattens nested object types into a single level
 */
// eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
export type Flatten<T> = T extends object
  ? {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
      [K in keyof T]: T[K] extends object ? Flatten<T[K]> : T[K];
    }
  : T;

/**
 * Creates a strict subset type where all properties must exist in the original type
 */
export type StrictSubset<T, U extends T> = U;

/**
 * Converts union types to intersection types
 */
export type UnionToIntersection<U> = (
  U extends ExplicitAnyType ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Gets the keys of an object as a union type
 */
export type KeysOf<T> = keyof T;

/**
 * Creates a type that represents either T or an array of T
 */
export type MaybeArray<T> = T | T[];

/**
 * Creates a type that represents a function or the return type of that function
 */
export type MaybeFunction<T> = T | (() => T);

/**
 * Removes functions from an object type
 */
export type NonFunctionKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * Creates a type with only non-function properties
 */
export type NonFunctionProperties<T> = Pick<T, NonFunctionKeys<T>>;

/**
 * Creates a deeply readonly version of a type
 */
export type DeepReadonly<T> = {
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Extracts the element type from an array type
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Creates a type that excludes empty object types
 */
export type NonEmptyObject<T> = keyof T extends never ? never : T;

/**
 * Creates a conditional type that resolves to different types based on a condition
 */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/**
 * Creates a type that represents all possible paths through an object
 */
// eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
export type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Generic utility type for recursive type operations
          T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/**
 * Gets the type at a specific path in an object
 */
export type PathValue<T, P extends Paths<T>> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? R extends Paths<T[K]>
      ? PathValue<T[K], R>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;
