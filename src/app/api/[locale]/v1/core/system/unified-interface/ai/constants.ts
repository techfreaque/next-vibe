/**
 * AI Tool Constants
 * Non-translatable constants used by the AI tool system
 */

export const AI_TOOL_CONSTANTS = {
  converter: {
    examplePrefix: "\n\nExample: ",
    versionSegments: ["v1", "v2", "core"] as const,
    underscore: "_",
    dollarOne: "$1",
    dollarTwo: "$2",
    space: " ",
    endpointForPrefix: "Endpoint for ",
    hiddenPlaceholder: "[hidden]",
  },
  discovery: {
    versionSegments: ["v1", "v2", "core"] as const,
  },
} as const;
