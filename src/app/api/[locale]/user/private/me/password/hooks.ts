import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ApiFormReturn } from "next-vibe/platforms/react/hooks/types";

import { useToast } from "@/hooks/use-toast";

import { useApiForm } from "../../../../system/platforms/react/hooks/use-api-mutation-form";
import passwordEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

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
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);

  return useApiForm(
    passwordEndpoints.POST,
    logger,
    user,
    locale,
    {},
    {
      onSuccess: (): void => {
        toast({
          title: t("update.success.title"),
          description: t("update.success.description"),
          variant: "default",
        });
      },
      onError: ({ error }) => {
        toast({
          title: t("update.errors.unknown.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
}
