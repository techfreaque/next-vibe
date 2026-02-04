import type { ApiFormReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/core/client";

import { useApiForm } from "../../../../system/unified-interface/react/hooks/use-api-mutation-form";
import type { JwtPayloadType } from "../../../auth/types";
import passwordEndpoints from "./definition";

/**
 * Hook for updating user password
 * @param logger - Endpoint logger for tracking operations
 * @returns Password update form and submission handling
 */
export function useUpdatePassword(
  logger: EndpointLogger,
  user: JwtPayloadType,
): ApiFormReturn<
  (typeof passwordEndpoints.POST)["types"]["RequestOutput"],
  (typeof passwordEndpoints.POST)["types"]["ResponseOutput"],
  (typeof passwordEndpoints.POST)["types"]["UrlVariablesOutput"]
> {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useApiForm(passwordEndpoints.POST, logger, user, undefined, {
    onSuccess: () => {
      toast({
        title: t("app.api.user.private.me.password.update.success.title"),
        description: t(
          "app.api.user.private.me.password.update.success.description",
        ),
        variant: "default",
      });
    },
    onError: ({ error }) => {
      toast({
        title: t(
          "app.api.user.private.me.password.update.errors.unknown.title",
        ),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
