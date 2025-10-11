import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/core/client";

import passwordEndpoints from "./definition";

/**
 * Hook for updating user password
 * @param logger - Endpoint logger for tracking operations
 * @returns Password update form and submission handling
 */
export function useUpdatePassword(
  logger: EndpointLogger,
): ApiFormReturn<
  (typeof passwordEndpoints.POST)["TRequestOutput"],
  (typeof passwordEndpoints.POST)["TResponseOutput"],
  (typeof passwordEndpoints.POST)["TUrlVariablesOutput"]
> {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useApiForm(
    passwordEndpoints.POST,
    logger,
    {},
    {
      onSuccess: () => {
        toast({
          title: t(
            "app.api.v1.core.user.private.me.password.update.success.title",
          ),
          description: t(
            "app.api.v1.core.user.private.me.password.update.success.description",
          ),
          variant: "default",
        });
      },
      onError: ({ error }) => {
        toast({
          title: t(
            "app.api.v1.core.user.private.me.password.update.errors.unknown.title",
          ),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
}
