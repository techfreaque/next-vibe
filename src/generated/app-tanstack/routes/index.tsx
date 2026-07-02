"use-custom";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error(
      "This should never be called - middleware should have redirected",
    );
  },
  component: () => null,
});
