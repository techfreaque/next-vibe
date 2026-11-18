import { beforeAll, describe, expect, it, mock } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";
import { LoggerContext } from "next-vibe/ui/hooks/logger-provider";
import { renderToStaticMarkup } from "react-dom/server";

import type { AgentEnvAvailability } from "../../../../env-availability";
import { AgentAvailabilityProvider } from "../../../../env-availability-store";
import type { SpotlightEmptyState as Spotlight } from "./empty-state-spotlight";

const guest: JWTPublicPayloadType = {
  isPublic: true,
  leadId: "00000000-0000-4000-8000-000000000001",
  roles: [UserPermissionRole.PUBLIC],
};
const logger = createEndpointLogger(false, defaultLocale);
const availability: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: true,
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
};

void mock.module("../../../../skills/favorites/hooks/hooks", () => ({
  useChatFavorites: (): { favorites: [] } => ({ favorites: [] }),
}));
void mock.module("../../../settings/hooks", () => ({
  useChatSettings: (): { settings: null; isLoading: boolean } => ({
    settings: null,
    isLoading: false,
  }),
}));

let SpotlightEmptyState: typeof Spotlight;

beforeAll(async () => {
  const widgetContext =
    await import("next-vibe/unified-ui/_shared/use-widget-context");
  void mock.module("next-vibe/unified-ui/_shared/use-widget-context", () => ({
    ...widgetContext,
    useWidgetUser: (): JWTPublicPayloadType => guest,
    useWidgetLogger: (): EndpointLogger => logger,
  }));
  ({ SpotlightEmptyState } = await import("./empty-state-spotlight"));
});

function renderSpotlight(skillId: string): string {
  return renderToStaticMarkup(
    <LoggerContext.Provider value={logger}>
      <AgentAvailabilityProvider availability={availability}>
        <SpotlightEmptyState
          locale={defaultLocale}
          skillId={skillId}
          rootFolderId={DefaultFolderId.INCOGNITO}
          bottomPadding={0}
        />
      </AgentAvailabilityProvider>
    </LoggerContext.Provider>,
  );
}

describe("new-chat spotlight", () => {
  it("shows the heading and model card for 4chan", () => {
    const markup = renderSpotlight("4chan");
    expect(markup).toContain("Chat with 4chan.");
    expect(markup).toContain("Runs on");
    expect(markup).toContain("UncensoredLM v1.2");
    expect(markup).toContain("Good at:");
    expect(markup).toContain("Weak at:");
    expect(markup).toContain("Switch to Thea for more modes");
  });

  it("shows Thea's current mode and mode grid", () => {
    const markup = renderSpotlight("thea");
    expect(markup).toContain("Pick how Thea works.");
    expect(markup).toContain("Current mode:");
    expect(markup).toContain('aria-label="All modes"');
    expect(markup).toContain('aria-current="true"');
  });
});
