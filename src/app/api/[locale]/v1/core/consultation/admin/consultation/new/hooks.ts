/**
 * Admin Consultation Create API Hooks
 * React hooks for interacting with the admin consultation creation API
 */

import type React from "react";
import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import type { ConsultationCreatePostRequestTypeInput } from "./definition";
import adminCreateEndpoints from "./definition";

/**
 * Hook for creating admin consultations
 * @param options Configuration options including default values and success callback
 * @returns Endpoint return with form handling and mutation
 */
export function useAdminConsultationCreateEndpoint(params: {
  enabled?: boolean;
  defaultValues?: Partial<ConsultationCreatePostRequestTypeInput>;
  onSuccess?: () => void;
  logger: EndpointLogger;
}): EndpointReturn<typeof adminCreateEndpoints> {
  const result = useEndpoint(
    adminCreateEndpoints,
    {
      queryOptions: {
        enabled: params?.enabled ?? true,
      },
      formOptions: {
        defaultValues: params?.defaultValues,
      },
    },
    params.logger,
  );

  // Create a wrapped version with success callback
  const wrappedResult = useMemo(() => {
    if (!result.create || !params?.onSuccess) {
      return result;
    }

    const originalOnSubmit = result.create.onSubmit;
    const wrappedOnSubmit = async (
      e: React.FormEvent | undefined,
    ): Promise<void> => {
      await originalOnSubmit(e);
      if (result.create?.response?.success) {
        params.onSuccess?.();
      }
    };

    return {
      ...result,
      create: {
        ...result.create,
        onSubmit: wrappedOnSubmit,
      },
    };
  }, [result, params]);

  return wrappedResult;
}
