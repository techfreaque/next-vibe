import { QueryClientProvider } from "@tanstack/react-query";
import { LoggerProvider } from "next-vibe/ui/hooks/logger-provider";
import type { JSX } from "react";

import type { AgentEnvAvailability } from "../../../../agent/env-availability";
import { AgentAvailabilityProvider } from "../../../../agent/env-availability-store";
import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { WidgetData } from "../../../../core/utils/json";
import type { JwtPayloadType } from "../../../../identity/auth/types";
import type { EndpointLogger } from "../../../../logger/types";
import type { Platform } from "../../../../platforms/platforms";
import { queryClient } from "../../../hooks/store";
import { NavigationStackProvider } from "../../../hooks/use-navigation-stack";
import { EndpointRenderer } from "../../web/EndpointRenderer";

export function CliRenderTree({
  endpoint,
  locale,
  data,
  logger,
  user,
  platform,
  availability,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  data: WidgetData;
  logger: EndpointLogger;
  user: JwtPayloadType;
  /**
   * The surface actually being rendered for. Defaults to CLI, but `vibe <cmd>
   * --platform=mcp` renders through this same tree and must reach widgets as
   * MCP — otherwise every `useIsMcp()` branch silently reports CLI and agents
   * get decorated, context-expensive output.
   */
  platform: Platform;
  /** Computed by the async caller — this tree renders synchronously. */
  availability: AgentEnvAvailability;
}): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <LoggerProvider locale={locale}>
        <AgentAvailabilityProvider availability={availability}>
          <NavigationStackProvider>
            <EndpointRenderer
              endpoint={endpoint}
              locale={locale}
              data={data}
              logger={logger}
              user={user}
              response={{ success: true, data }}
              responseOnly={true}
              platform={platform}
            />
          </NavigationStackProvider>
        </AgentAvailabilityProvider>
      </LoggerProvider>
    </QueryClientProvider>
  );
}
