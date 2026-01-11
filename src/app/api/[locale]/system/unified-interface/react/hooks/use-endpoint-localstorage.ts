"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorResponseType, ResponseType } from "next-vibe/shared/types/response.schema";
import { useCallback, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import type {
  DeleteEndpointTypes,
  GetEndpointTypes,
  PatchEndpointTypes,
  PrimaryMutationTypes,
} from "./endpoint-types";

/**
 * localStorage read hook - mimics useEndpointRead but uses callbacks
 */
export function useLocalStorageRead<T>(
  endpoint: CreateApiEndpointAny | null,
  callback:
    | ((params: {
        urlPathParams?: GetEndpointTypes<T>["urlPathParams"];
        requestData?: GetEndpointTypes<T>["request"];
      }) => Promise<ResponseType<GetEndpointTypes<T>["response"]>>)
    | undefined,
  options: {
    urlPathParams?: GetEndpointTypes<T>["urlPathParams"];
    initialState?: Partial<GetEndpointTypes<T>["request"]>;
    enabled?: boolean;
  } = {},
): {
  form: UseFormReturn<GetEndpointTypes<T>["request"]>;
  response: ResponseType<GetEndpointTypes<T>["response"]> | undefined;
  data: GetEndpointTypes<T>["response"] | undefined;
  isError: boolean;
  error: ErrorResponseType | null;
  isSuccess: boolean;
  isSubmitSuccessful: boolean;
  submitError: ErrorResponseType | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  clearSavedForm: () => void;
  setErrorType: () => void;
  isFetching: boolean;
  status: "loading" | "success" | "error" | "idle";
} | null {
  type RequestType = GetEndpointTypes<T>["request"];
  type ResponseDataType = GetEndpointTypes<T>["response"];

  const [response, setResponse] = useState<ResponseType<ResponseDataType> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestType>({
    resolver: endpoint?.requestSchema ? zodResolver(endpoint.requestSchema) : undefined,
    defaultValues: (options.initialState ?? {}) as RequestType,
  });

  const refetch = useCallback(async () => {
    if (!callback) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await callback({
        urlPathParams: options.urlPathParams,
        requestData: form.getValues() as GetEndpointTypes<T>["request"],
      });
      setResponse(result as ResponseType<ResponseDataType>);
    } finally {
      setIsLoading(false);
    }
  }, [callback, options.urlPathParams, form]);

  const submitForm = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (!endpoint) {
    return null;
  }

  return {
    form: form as UseFormReturn<RequestType>,
    response,
    data: response?.success ? (response.data as ResponseDataType) : undefined,
    isError: response?.success === false,
    error: response?.success === false ? response : null,
    isSuccess: response?.success === true,
    isSubmitSuccessful: response?.success === true,
    submitError: response?.success === false ? response : undefined,
    isLoading,
    refetch,
    submitForm,
    isSubmitting: isLoading,
    clearSavedForm: (): void => {
      // No-op for localStorage implementation
    },
    setErrorType: (): void => {
      // No-op for localStorage implementation
    },
    isFetching: isLoading,
    status: (isLoading
      ? "loading"
      : response?.success === true
        ? "success"
        : response?.success === false
          ? "error"
          : "idle") as "loading" | "success" | "error" | "idle",
  };
}

/**
 * localStorage create/update hook - mimics useEndpointCreate but uses callbacks
 */
export function useLocalStorageCreate<T>(
  endpoint: CreateApiEndpointAny | null,
  callback:
    | ((params: {
        requestData: PrimaryMutationTypes<T>["request"] | PatchEndpointTypes<T>["request"];
        urlPathParams?:
          | PrimaryMutationTypes<T>["urlPathParams"]
          | PatchEndpointTypes<T>["urlPathParams"];
      }) => Promise<
        ResponseType<PrimaryMutationTypes<T>["response"] | PatchEndpointTypes<T>["response"]>
      >)
    | undefined,
  options: {
    urlPathParams?:
      | PrimaryMutationTypes<T>["urlPathParams"]
      | PatchEndpointTypes<T>["urlPathParams"];
    defaultValues?: DeepPartial<
      PrimaryMutationTypes<T>["request"] | PatchEndpointTypes<T>["request"]
    >;
    autoPrefillData?: DeepPartial<
      PrimaryMutationTypes<T>["request"] | PatchEndpointTypes<T>["request"]
    >;
  } = {},
): {
  form: UseFormReturn<PrimaryMutationTypes<T>["request"] | PatchEndpointTypes<T>["request"]>;
  response:
    | ResponseType<PrimaryMutationTypes<T>["response"] | PatchEndpointTypes<T>["response"]>
    | undefined;
  isSubmitSuccessful: boolean;
  submitError: ErrorResponseType | null;
  isSubmitting: boolean;
  submitForm: (submitOptions?: {
    onSuccess?: () => void;
    onError?: (params: { error: ErrorResponseType | Error }) => void;
  }) => Promise<void>;
  clearSavedForm: () => void;
  setErrorType: () => void;
} | null {
  type RequestType = PrimaryMutationTypes<T>["request"] | PatchEndpointTypes<T>["request"];
  type ResponseDataType = PrimaryMutationTypes<T>["response"] | PatchEndpointTypes<T>["response"];

  const [response, setResponse] = useState<ResponseType<ResponseDataType> | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestType>({
    resolver: endpoint?.requestSchema ? zodResolver(endpoint.requestSchema) : undefined,
    defaultValues: (options.autoPrefillData ?? options.defaultValues ?? {}) as RequestType,
  });

  const submitForm = useCallback(
    async (submitOptions?: {
      onSuccess?: () => void;
      onError?: (params: { error: ErrorResponseType | Error }) => void;
    }) => {
      if (!callback) {
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await callback({
          requestData: form.getValues() as RequestType,
          urlPathParams: options.urlPathParams,
        });
        setResponse(result as ResponseType<ResponseDataType>);
        if (result.success && submitOptions?.onSuccess) {
          submitOptions.onSuccess();
        } else if (!result.success && submitOptions?.onError) {
          submitOptions.onError({ error: result });
        }
      } catch (error) {
        if (submitOptions?.onError) {
          submitOptions.onError({
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [callback, form, options.urlPathParams],
  );

  if (!endpoint) {
    return null;
  }

  return {
    form: form as UseFormReturn<RequestType>,
    response,
    isSubmitSuccessful: response?.success === true,
    submitError: response?.success === false ? response : null,
    isSubmitting,
    submitForm,
    clearSavedForm: (): void => {
      // No-op for localStorage implementation
    },
    setErrorType: (): void => {
      // No-op for localStorage implementation
    },
  };
}

/**
 * localStorage delete hook - mimics useEndpointDelete but uses callbacks
 */
export function useLocalStorageDelete<T>(
  endpoint: CreateApiEndpointAny | null,
  callback:
    | ((params: {
        requestData?: DeleteEndpointTypes<T>["request"];
        urlPathParams?: DeleteEndpointTypes<T>["urlPathParams"];
      }) => Promise<ResponseType<DeleteEndpointTypes<T>["response"]>>)
    | undefined,
  options: {
    urlPathParams?: DeleteEndpointTypes<T>["urlPathParams"];
  } = {},
): {
  response: ResponseType<DeleteEndpointTypes<T>["response"]> | undefined;
  isSuccess: boolean;
  error: ErrorResponseType | null;
  submit: (requestData?: DeleteEndpointTypes<T>["request"]) => Promise<void>;
  isSubmitting: boolean;
} | null {
  type RequestType = DeleteEndpointTypes<T>["request"];
  type ResponseDataType = DeleteEndpointTypes<T>["response"];

  const [response, setResponse] = useState<ResponseType<ResponseDataType> | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (requestData?: RequestType) => {
      if (!callback) {
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await callback({
          requestData,
          urlPathParams: options.urlPathParams,
        });
        setResponse(result as ResponseType<ResponseDataType>);
      } finally {
        setIsSubmitting(false);
      }
    },
    [callback, options.urlPathParams],
  );

  if (!endpoint) {
    return null;
  }

  return {
    response,
    isSuccess: response?.success === true,
    error: response?.success === false ? response : null,
    submit,
    isSubmitting,
  };
}
