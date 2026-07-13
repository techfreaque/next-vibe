import { QueryClientProvider } from "@tanstack/react-query";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { AgentAvailabilityProvider } from "next-vibe/agent/env-availability-context";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { queryClient } from "next-vibe/platforms/react/hooks/store";
import { NavigationStackProvider } from "next-vibe/platforms/react/hooks/use-navigation-stack";
import type { JSX } from "react";

import { LoggerProvider } from "@/_old/hooks/logger-provider";

import { EndpointRenderer } from "../../react/EndpointRenderer";

export function CliRenderTree({
  endpoint,
  locale,
  data,
  logger,
  user,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  data: WidgetData;
  logger: EndpointLogger;
  user: JwtPayloadType;
}): JSX.Element {
  const availability = getEnvAvailability();
  return (
    <QueryClientProvider client={queryClient}>
      <LoggerProvider locale={locale} availability={availability}>
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
              platform={Platform.CLI}
            />
          </NavigationStackProvider>
        </AgentAvailabilityProvider>
      </LoggerProvider>
    </QueryClientProvider>
  );
}
