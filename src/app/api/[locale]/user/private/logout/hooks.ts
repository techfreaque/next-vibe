/**
 * Logout API Hooks
 *
 * Hooks for interacting with the Logout API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useTranslation } from "@/i18n/core/client";

import logoutEndpoints from "./definition";
import { useApiMutation } from "../../../system/unified-interface/react/hooks/use-api-mutation";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import definitions from "@/app/api/[locale]/credits/definition";
import { authClientRepository } from "../../auth/repository-client";

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for logout functionality
 *
 * Features:
 * - Handles token removal
 * - Provides success notifications
 * - Redirects to login page
 * - Refreshes user state
 *
 * @returns Logout function
 */
export function useLogout(logger: EndpointLogger): () => void {
  const { toast } = useToast();
  const router = useRouter();
  const { t, locale } = useTranslation();

  const logout = useApiMutation(logoutEndpoints.POST, logger, {
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

      router.push(`/${locale}/user/login`);
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

      router.push(`/${locale}/user/login`);
    },
  });

  return useCallback((): void => {
    logout.mutate({});
  }, [logout]);
}
