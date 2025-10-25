import { Environment } from "next-vibe/shared/utils";
import { useMemo } from "react";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { clearFormsAfterSuccessInDev } from "../../../../../../../../../../config/debug";
import { envClient } from "../../../../../../../../../../config/env-client";

/**
 * Utility to detect available HTTP methods from endpoints object
 */
export function useAvailableMethods<
  T extends Partial<
    Record<
      Methods,
      CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
    >
  >,
>(endpoints: T): Methods[] {
  return useMemo(() => {
    return Object.keys(endpoints).filter((method) =>
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method),
    ) as Methods[];
  }, [endpoints]);
}

/**
 * Utility to determine primary mutation method (prefer POST, then PUT, then PATCH, then DELETE)
 */
export function usePrimaryMutationMethod(
  availableMethods: Methods[],
): Methods | null {
  return useMemo(() => {
    if (availableMethods.includes(Methods.POST)) {
      return Methods.POST;
    }
    if (availableMethods.includes(Methods.PUT)) {
      return Methods.PUT;
    }
    if (availableMethods.includes(Methods.PATCH)) {
      return Methods.PATCH;
    }
    if (availableMethods.includes(Methods.DELETE)) {
      return Methods.DELETE;
    }
    return null;
  }, [availableMethods]);
}

/**
 * Utility to determine if forms should be cleared after success
 * In production: always clear
 * In development: controlled by debug setting
 */
export function shouldClearFormAfterSuccess(): boolean {
  if (envClient.NODE_ENV === Environment.PRODUCTION) {
    return true;
  }

  // In development, use debug setting
  return clearFormsAfterSuccessInDev;
}

/**
 * Utility to safely merge form data with prefilled data
 * localStorage data takes precedence over all other data
 */
export function mergeFormData<T>(
  defaultValues: Partial<T> | undefined,
  prefillData: Partial<T> | undefined,
  initialState: Partial<T> | undefined,
  savedData?: Partial<T> | null,
): Partial<T> {
  return {
    ...(defaultValues || {}),
    ...(prefillData || {}),
    ...(initialState || {}),
    ...(savedData || {}), // localStorage wins
  };
}
