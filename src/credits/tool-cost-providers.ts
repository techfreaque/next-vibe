/** Billable tool services and the stable ids written to the usage ledger. */
// eslint-disable-next-line i18next/no-literal-string -- provider product names
export const TOOL_COST_PROVIDERS = {
  BRAVE: {
    modelId: "brave-search",
    apiProvider: "brave",
    label: "Brave Search",
  },
  KAGI: { modelId: "kagi-fastgpt", apiProvider: "kagi", label: "Kagi" },
  SCRAPPEY: { modelId: "scrappey", apiProvider: "scrappey", label: "Scrappey" },
} as const;

export type ToolChargeAttribution =
  (typeof TOOL_COST_PROVIDERS)[keyof typeof TOOL_COST_PROVIDERS];
