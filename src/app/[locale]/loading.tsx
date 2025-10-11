import type { JSX } from "react";

/**
 * Loading component displayed during initial page load and data fetching
 * Used by Next.js as a loading state for pages and layouts
 *
 * @returns JSX Element for the loading spinner
 */
export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
      </div>
    </div>
  );
}
