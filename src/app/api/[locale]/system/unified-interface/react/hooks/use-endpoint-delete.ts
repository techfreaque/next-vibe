// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorResponseType, ResponseType } from "next-vibe/shared/types/response.schema";
import { useCallback, useEffect, useMemo } from "react";
import type { DefaultValues, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import type { ApiMutationOptions } from "./types";
import { type MutationVariables, useApiMutation } from "./use-api-mutation";

/**
 * Hook for delete operations with form support
 * Based on the mutation-form pattern for consistency with create/update hooks
 *
 * Features:
 * - Form-based delete functionality with React Hook Form
 * - Auto-prefill support for form fields
 * - Proper error handling and loading states
 * - Type-safe with full TypeScript inference
 * - Consistent with mutation-form pattern
 */
export function useEndpointDelete<TEndpoint extends CreateApiEndpointAny>(
  deleteEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    mutationOptions?: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
    autoPrefillData?: DeepPartial<TEndpoint["types"]["RequestOutput"]>;
    formOptions?: {
      defaultValues?: DefaultValues<TEndpoint["types"]["RequestOutput"]>;
    };
  } = {},
): {
  /** React Hook Form instance */
  form: UseFormReturn<TEndpoint["types"]["RequestOutput"]>;
  /** The complete response including success/error state */
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined;
  /** Submit error from mutation */
  submitError: ErrorResponseType | null;
  /** Whether submission was successful */
  isSubmitSuccessful: boolean;
  /** Submit function that uses form data */
  submit: (data?: TEndpoint["types"]["RequestOutput"]) => Promise<void>;
  /** Submit form function (calls form.handleSubmit) */
  submitForm: () => Promise<void>;
  /** Whether the form is submitting */
  isSubmitting: boolean;
} | null {
  // Return null if endpoint is not provided
  if (!deleteEndpoint) {
    return null;
  }

  const { urlPathParams, autoPrefillData, formOptions } = options;

  // Compute default values from autoPrefillData or form options
  const defaultValues = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData as DefaultValues<TEndpoint["types"]["RequestOutput"]>;
    }
    return formOptions?.defaultValues ?? ({} as DefaultValues<TEndpoint["types"]["RequestOutput"]>);
  }, [autoPrefillData, formOptions?.defaultValues]);

  // Create form instance
  const form = useForm<TEndpoint["types"]["RequestOutput"]>({
    resolver: zodResolver(deleteEndpoint.requestSchema) as never,
    defaultValues,
  });

  // Reset form when autoPrefillData changes
  useEffect(() => {
    if (autoPrefillData) {
      logger.debug("useEndpointDelete: Resetting form with autoPrefillData", { autoPrefillData });
      form.reset(autoPrefillData as DefaultValues<TEndpoint["types"]["RequestOutput"]>);
    }
  }, [autoPrefillData, form, logger]);

  // Use the existing mutation hook for consistency
  const mutation = useApiMutation(deleteEndpoint, logger, options.mutationOptions ?? {});

  // Create a submit function that calls the mutation
  const submit = useCallback(
    async (data?: TEndpoint["types"]["RequestOutput"]): Promise<void> => {
      const formData = data ?? form.getValues();
      logger.debug("useEndpointDelete: Submitting delete", { formData, urlPathParams });

      const mutationVariables: MutationVariables<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      > = {
        requestData: formData,
        urlPathParams: urlPathParams,
      };
      await mutation.mutateAsync(mutationVariables);
    },
    [mutation, urlPathParams, form, logger],
  );

  // Create a submitForm function that uses form.handleSubmit
  const submitForm = useCallback(async (): Promise<void> => {
    await form.handleSubmit(async (data) => {
      await submit(data);
    })();
  }, [form, submit]);

  return {
    form,
    response: mutation.data,
    submitError: mutation.error,
    isSubmitSuccessful: mutation.isSuccess,
    submit,
    submitForm,
    isSubmitting: mutation.isPending,
  };
}
