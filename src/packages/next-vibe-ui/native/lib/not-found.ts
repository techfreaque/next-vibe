/**
 * React Native implementation of server-side notFound
 * In React Native, we throw an error that can be caught by error boundaries
 */
export function notFound(): never {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  throw new Error("Not Found - 404");
}
