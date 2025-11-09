import { router } from "expo-router";

/**
 * Native implementation of server-side redirect using Expo Router
 * This is a server-side only function for use in Server Components and Server Actions
 */
export function redirect(url: string): never {
  router.replace(url);
  // TypeScript expects 'never' return type for redirect
  // In native, we need to throw to match the behavior
  throw new Error("REDIRECT");
}
