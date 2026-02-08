/**
 * Logout API Hooks
 *
 * Hooks for interacting with the Logout API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useCallback } from "react";

import definitions from "@/app/api/[locale]/credits/definition";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import { useApiMutation } from "../../../system/unified-interface/react/hooks/use-api-mutation";
import { authClientRepository } from "../../auth/repository-client";
import type { JwtPayloadType } from "../../auth/types";
import logoutEndpoints from "./definition";

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for logout functionality
 *
 * Features:
 * - Handles token removal
 * - Provides success notifications
 * - Redirects to login page with page refresh
 * - Refreshes user state
 *
 * @returns Logout function
 */
export function useLogout(
  logger: EndpointLogger,
  user: JwtPayloadType,
): () => void {
  const { toast } = useToast();
  const { t, locale } = useTranslation();

  const logout = useApiMutation(logoutEndpoints.POST, logger, user, {
    onSuccess: async () => {
      toast({
        title: t("app.api.user.private.logout.success.title"),
        description: t("app.api.user.private.logout.success.description"),
        variant: "default",
      });

      // remove react native token - web token is already cleared by server
      await authClientRepository.removeAuthToken(logger);
      // Invalidate credits queries to trigger refetch with new auth state
      await apiClient.refetchEndpoint(definitions.GET, logger);

      // Use window.location.href for full page refresh
      // eslint-disable-next-line react-compiler/react-compiler
      window.location.href = `/${locale}/user/login`;
    },
    onError: async () => {
      // Even if the API call fails, we still want to log the user out locally
      toast({
        title: t("app.api.user.private.logout.success.title"),
        description: t("app.api.user.private.logout.success.description"),
        variant: "default",
      });
      // remove react native token - web token is already cleared by server
      await authClientRepository.removeAuthToken(logger);

      // Invalidate credits queries to trigger refetch with new auth state
      await apiClient.refetchEndpoint(definitions.GET, logger);

      // Use window.location.href for full page refresh
      window.location.href = `/${locale}/user/login`;
    },
  });

  return useCallback((): void => {
    logout.mutate({});
  }, [logout]);
}
