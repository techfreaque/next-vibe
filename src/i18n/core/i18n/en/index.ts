import type { Countries } from "../../config";

export const translations = {
  timezone: {
    PL: "Europe/Warsaw",
    DE: "Europe/Berlin",
    GLOBAL: "UTC",
  } satisfies Record<Countries, string>,
};
