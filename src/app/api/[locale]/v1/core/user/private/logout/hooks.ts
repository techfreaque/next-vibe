/**
 * Logout API Hooks
 *
 * Hooks for interacting with the Logout API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { useCallback } from "react";

import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useTranslation } from "@/i18n/core/client";

import { authClientRepository } from "../../auth/repository-client";
import { useUser } from "../me/hooks";
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
 * - Redirects to login page
 * - Refreshes user state
 *
 * @returns Logout function
 */
export function useLogout(logger: EndpointLogger): () => void {
  const { toast } = useToast();
  const router = useRouter();
  const { refetch } = useUser(logger);
  const { t, locale } = useTranslation();

  const logout = useApiMutation(logoutEndpoints.POST, logger, {
    onSuccess: async () => {
      toast({
        title: t("app.api.v1.core.user.private.logout.success.title"),
        description: t(
          "app.api.v1.core.user.private.logout.success.description",
        ),
        variant: "default",
      });

      // Remove token AFTER successful API call
      const removeResponse = await authClientRepository.removeAuthStatus(logger);
      if (!removeResponse.success) {
        // Note: Error already logged by repository
      }
      router.push(`/${locale}/user/login`);
      await refetch();
    },
    onError: async () => {
      // Even if the API call fails, we still want to log the user out locally
      toast({
        title: t("app.api.v1.core.user.private.logout.success.title"),
        description: t(
          "app.api.v1.core.user.private.logout.success.description",
        ),
        variant: "default",
      });

      // Remove token AFTER API call completes (even with error)
      const removeResponse = await authClientRepository.removeAuthStatus(logger);
      if (!removeResponse.success) {
        // Note: Error already logged by repository
      }
      router.push(`/${locale}/user/login`);
      await refetch();
    },
  });

  return useCallback((): void => {
    logout.mutate({});
  }, [logout]);
}
