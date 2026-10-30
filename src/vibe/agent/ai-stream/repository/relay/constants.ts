/**
 * Marker a relay receiver puts in its failure message when it cannot run the
 * loop because the model provider's API key is not configured on its node.
 * The relay caller recognises it and runs the loop itself instead (the
 * receiver's prompt and tools still apply; tools round-trip back).
 */
export const RELAY_RECEIVER_NO_PROVIDER_KEY =
  "[relay-receiver-no-provider-key]";
