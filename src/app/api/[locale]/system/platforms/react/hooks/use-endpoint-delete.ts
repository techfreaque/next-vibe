// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import type { DeepPartial } from "next-vibe/core/utils/type-utils";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { type MutationVariables, useApiMutation } from "./use-api-mutation";
import { useCallback, useEffect, useMemo } from "react";
import type { DefaultValues, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { deepMerge } from "./endpoint-utils";
import { splitFormValues } from "./split-form-values";
import type { ApiMutationOptions } from "./types";

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
  user: JwtPayloadType,
  options: {
    mutationOptions?: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
    autoPrefillData?: DeepPartial<TEndpoint["types"]["FormValues"]>;
    formOptions?: {
      defaultValues?: DefaultValues<TEndpoint["types"]["FormValues"]>;
    };
  } = {},
): {
  /** React Hook Form instance — holds request-data ∪ url-path-param fields */
  form: UseFormReturn<TEndpoint["types"]["FormValues"]>;
  /** The complete response including success/error state */
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined;
  /** Submit error from mutation */
  submitError: ErrorResponseType | null;
  /** Whether submission was successful */
  isSubmitSuccessful: boolean;
  /** Submit function that uses form data */
  submit: (data?: TEndpoint["types"]["FormValues"]) => Promise<void>;
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
      return autoPrefillData as DefaultValues<TEndpoint["types"]["FormValues"]>;
    }
    return (
      formOptions?.defaultValues ??
      ({} as DefaultValues<TEndpoint["types"]["FormValues"]>)
    );
  }, [autoPrefillData, formOptions?.defaultValues]);

  // Create form instance — validated by the combined formSchema (request-data ∪
  // url-path-params), the concrete z.ZodObject zodResolver accepts.
  const form = useForm<TEndpoint["types"]["FormValues"]>({
    resolver: zodResolver(deleteEndpoint.formSchema),
    defaultValues,
  });

  // Reset form when autoPrefillData changes
  useEffect(() => {
    if (autoPrefillData) {
      logger.debug("useEndpointDelete: Resetting form with autoPrefillData", {
        autoPrefillData,
      });
      form.reset(
        autoPrefillData as DefaultValues<TEndpoint["types"]["FormValues"]>,
      );
    }
  }, [autoPrefillData, form, logger]);

  // Merge endpoint-level mutation options with hook-level options
  // Hook-level options take priority
  const mergedMutationOptions = useMemo(() => {
    const endpointMutOpts = deleteEndpoint.options?.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    const hookMutOpts = options.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    return deepMerge(endpointMutOpts, hookMutOpts);
  }, [deleteEndpoint.options?.mutationOptions, options.mutationOptions]);

  // Use the existing mutation hook for consistency
  const mutation = useApiMutation(
    deleteEndpoint,
    logger,
    user,
    mergedMutationOptions,
  );

  // Create a submit function that calls the mutation
  const submit = useCallback(
    async (data?: TEndpoint["types"]["FormValues"]): Promise<void> => {
      // Split the flat form values (request-data ∪ url-path-params) into the two
      // buckets the mutation expects. An explicit urlPathParams option wins.
      const split = splitFormValues(deleteEndpoint, data ?? form.getValues());
      const requestData = split.data;
      const resolvedUrlPathParams = urlPathParams ?? split.urlPathParams;
      logger.debug("useEndpointDelete: Submitting delete", {
        formData: requestData,
        urlPathParams: resolvedUrlPathParams,
      });

      const mutationVariables: MutationVariables<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      > = {
        requestData,
        urlPathParams: resolvedUrlPathParams,
      };
      await mutation.mutateAsync(mutationVariables);
    },
    [mutation, deleteEndpoint, urlPathParams, form, logger],
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
