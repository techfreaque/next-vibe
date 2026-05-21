import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { queryClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import { LoggerProvider } from "@/hooks/use-logger";

export function McpRenderTree({
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
  return (
    <QueryClientProvider client={queryClient}>
      <LoggerProvider locale={locale}>
        <NavigationStackProvider>
          <EndpointRenderer
            endpoint={endpoint}
            locale={locale}
            data={data}
            logger={logger}
            user={user}
            response={{ success: true, data }}
            responseOnly={true}
            platform={Platform.MCP}
          />
        </NavigationStackProvider>
      </LoggerProvider>
    </QueryClientProvider>
  );
}
