import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import * as envAvailability from "next-vibe/agent/env-availability";
import { vi } from "vitest";

/** Keep model resolution real while isolating suites from host credentials. */
export function mockV1Providers(
  providers: Partial<AgentEnvAvailability> = {},
): () => void {
  const availability = vi.spyOn(envAvailability, "getEnvAvailability");
  availability.mockResolvedValue({
    openRouter: true,
    claudeCode: false,
    voice: false,
    braveSearch: false,
    kagiSearch: false,
    anySearch: false,
    uncensoredAI: false,
    freedomGPT: false,
    gabAI: false,
    veniceAI: false,
    nanoGPT: false,
    scrappey: false,
    openAiImages: false,
    openAiStt: false,
    replicate: false,
    falAi: false,
    modelsLab: false,
    edenAiStt: false,
    deepgram: false,
    openAiTts: false,
    edenAiTts: false,
    elevenlabs: false,
    unbottledSystem: false,
    unbottledForce: false,
    ...providers,
  });
  return () => {
    availability.mockRestore();
  };
}
