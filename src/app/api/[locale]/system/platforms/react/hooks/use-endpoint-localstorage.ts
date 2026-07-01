"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type {
  DeleteRequest,
  DeleteResponse,
  DeleteUrlVariables,
  GetRequest,
  GetResponse,
  GetUrlVariables,
  PatchRequest,
  PatchResponse,
  PatchUrlVariables,
  PrimaryMutationRequest,
  PrimaryMutationResponse,
  PrimaryMutationUrlVariables,
} from "next-vibe/core/definition/endpoint-helpers";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { DeepPartial } from "next-vibe/core/utils/type-utils";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation as hooksScopedTranslation } from "next-vibe/platforms/react/hooks/i18n";
import { buildKey, type CacheKeyRequestData } from "./query-key-builder";
import { useCallback, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { splitFormValues } from "./split-form-values";

/**
 * localStorage read hook - uses React Query with localStorage callbacks
 */
export function useLocalStorageRead<T, TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint | null,
  logger: EndpointLogger,
  callback:
    | ((params: {
        urlPathParams?: GetUrlVariables<T>;
        requestData?: GetRequest<T>;
      }) => Promise<ResponseType<GetResponse<T>>>)
    | undefined,
  options: {
    urlPathParams?: GetUrlVariables<T>;
    requestData: CacheKeyRequestData<TEndpoint>;
    initialState?: Partial<GetRequest<T>>;
    enabled?: boolean;
  },
): {
  form: UseFormReturn<GetRequest<T>>;
  response: ResponseType<GetResponse<T>> | undefined;
  data: GetResponse<T> | undefined;
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
  type RequestType = GetRequest<T>;
  type ResponseDataType = GetResponse<T>;

  // The form holds the merged form values (request-data ∪ url-path-params).
  // Validated by the endpoint's combined formSchema, which is the concrete
  // z.ZodObject zodResolver accepts.
  type FormValuesType = TEndpoint["types"]["FormValues"];

  const form = useForm<FormValuesType>({
    resolver: endpoint?.formSchema
      ? zodResolver(endpoint.formSchema)
      : undefined,
    defaultValues: (options.initialState ?? {}) as FormValuesType,
  });

  const { locale } = useTranslation();
  const { t: hooksT } = useMemo(
    () => hooksScopedTranslation.scopedT(locale),
    [locale],
  );

  // Build query key for React Query
  const queryKey = endpoint
    ? [
        buildKey(
          "query",
          endpoint,
          options.urlPathParams,
          logger,
          options.requestData,
        ),
      ]
    : [];

  // Use React Query for data fetching
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ResponseType<GetResponse<T>>> => {
      if (!callback) {
        return fail({
          message: hooksT("localstorage.noCallback"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      // Split merged form values into request-data + url-path-params; an
      // explicit options.urlPathParams takes priority over the split.
      const split = endpoint
        ? splitFormValues(endpoint, form.getValues())
        : { data: form.getValues(), urlPathParams: undefined };
      const result = await callback({
        urlPathParams: (options.urlPathParams ?? split.urlPathParams) as
          | GetUrlVariables<T>
          | undefined,
        requestData: split.data as GetRequest<T>,
      });
      return result;
    },
    enabled: endpoint !== null && options.enabled !== false && !!callback,
    staleTime: 60 * 1000, // 1 minute
  });

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const submitForm = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (!endpoint) {
    return null;
  }

  const response = query.data;

  return {
    form: form as UseFormReturn<RequestType>,
    response,
    data: response?.success ? (response.data as ResponseDataType) : undefined,
    isError: response?.success === false || query.isError,
    error: response?.success === false ? response : null,
    isSuccess: response?.success === true,
    isSubmitSuccessful: response?.success === true,
    submitError: response?.success === false ? response : undefined,
    isLoading: query.isPending,
    refetch,
    submitForm,
    isSubmitting: query.isFetching,
    clearSavedForm: (): void => {
      // No-op for localStorage implementation
    },
    setErrorType: (): void => {
      // No-op for localStorage implementation
    },
    isFetching: query.isFetching,
    status: (query.isPending
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
        requestData: PrimaryMutationRequest<T> | PatchRequest<T>;
        urlPathParams?: PrimaryMutationUrlVariables<T> | PatchUrlVariables<T>;
      }) => Promise<
        ResponseType<PrimaryMutationResponse<T> | PatchResponse<T>>
      >)
    | undefined,
  options: {
    urlPathParams?: PrimaryMutationUrlVariables<T> | PatchUrlVariables<T>;
    defaultValues?: DeepPartial<PrimaryMutationRequest<T> | PatchRequest<T>>;
    autoPrefillData?: DeepPartial<PrimaryMutationRequest<T> | PatchRequest<T>>;
    onSuccess?: () => Promise<void> | void;
  } = {},
): {
  form: UseFormReturn<PrimaryMutationRequest<T> | PatchRequest<T>>;
  response:
    | ResponseType<PrimaryMutationResponse<T> | PatchResponse<T>>
    | undefined;
  isSubmitSuccessful: boolean;
  submitError: ErrorResponseType | null;
  isSubmitting: boolean;
  submitForm: (submitOptions?: {
    urlParamVariables?: PrimaryMutationUrlVariables<T> | PatchUrlVariables<T>;
    onSuccess?: (data: {
      requestData: PrimaryMutationRequest<T> | PatchRequest<T>;
      pathParams:
        | PrimaryMutationUrlVariables<T>
        | PatchUrlVariables<T>
        | undefined;
      responseData: PrimaryMutationResponse<T> | PatchResponse<T>;
    }) => ErrorResponseType | void;
    onError?: (data: {
      error: ErrorResponseType;
      requestData: PrimaryMutationRequest<T> | PatchRequest<T>;
      pathParams:
        | PrimaryMutationUrlVariables<T>
        | PatchUrlVariables<T>
        | undefined;
    }) => void;
  }) => Promise<void>;
  clearSavedForm: () => void;
  setErrorType: () => void;
} | null {
  type RequestType = PrimaryMutationRequest<T> | PatchRequest<T>;
  type ResponseDataType = PrimaryMutationResponse<T> | PatchResponse<T>;

  const [response, setResponse] = useState<
    ResponseType<ResponseDataType> | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The form holds the merged form values (request-data ∪ url-path-params),
  // validated by the endpoint's combined formSchema — the concrete z.ZodObject
  // zodResolver accepts. At this erased endpoint type FormValues is `any`.
  type FormValuesType = CreateApiEndpointAny["types"]["FormValues"];

  const form = useForm<FormValuesType>({
    resolver: endpoint?.formSchema
      ? zodResolver(endpoint.formSchema)
      : undefined,
    defaultValues: (options.autoPrefillData ??
      options.defaultValues ??
      {}) as FormValuesType,
  });
  const _onSuccess = options.onSuccess;
  const _urlPathParams = options.urlPathParams;

  const submitForm = useCallback(
    async (submitOptions?: {
      urlParamVariables?: PrimaryMutationUrlVariables<T> | PatchUrlVariables<T>;
      onSuccess?: (data: {
        requestData: RequestType;
        pathParams:
          | PrimaryMutationUrlVariables<T>
          | PatchUrlVariables<T>
          | undefined;
        responseData: ResponseDataType;
      }) => ErrorResponseType | void;
      onError?: (data: {
        error: ErrorResponseType;
        requestData: RequestType;
        pathParams:
          | PrimaryMutationUrlVariables<T>
          | PatchUrlVariables<T>
          | undefined;
      }) => void;
    }) => {
      if (!callback) {
        return;
      }

      setIsSubmitting(true);
      try {
        // Split merged form values into request-data + url-path-params. An
        // explicit url-param override takes priority over the split.
        const split = endpoint
          ? splitFormValues(endpoint, form.getValues())
          : { data: form.getValues(), urlPathParams: undefined };
        const requestData = split.data as RequestType;
        const urlPathParams =
          submitOptions?.urlParamVariables ??
          _urlPathParams ??
          (split.urlPathParams as
            | PrimaryMutationUrlVariables<T>
            | PatchUrlVariables<T>
            | undefined);

        const result = await callback({
          requestData,
          urlPathParams,
        });
        setResponse(result as ResponseType<ResponseDataType>);

        if (result.success) {
          // Call the provided onSuccess callback to trigger read refetch
          if (_onSuccess) {
            await _onSuccess();
          }
          // Call submitOptions onSuccess with proper signature matching API mode
          if (submitOptions?.onSuccess) {
            const onSuccessResult = submitOptions.onSuccess({
              responseData: result.data as ResponseDataType,
              pathParams: urlPathParams,
              requestData,
            });
            // If onSuccess returns an error, treat it as an error
            if (onSuccessResult) {
              setResponse(onSuccessResult as ResponseType<ResponseDataType>);
              submitOptions.onError?.({
                error: onSuccessResult,
                requestData,
                pathParams: urlPathParams,
              });
            }
          }
        } else if (!result.success && submitOptions?.onError) {
          submitOptions.onError({
            error: result,
            requestData,
            pathParams: urlPathParams,
          });
        }
      } catch (error) {
        const split = endpoint
          ? splitFormValues(endpoint, form.getValues())
          : { data: form.getValues(), urlPathParams: undefined };
        const requestData = split.data as RequestType;
        const urlPathParams =
          submitOptions?.urlParamVariables ??
          _urlPathParams ??
          (split.urlPathParams as
            | PrimaryMutationUrlVariables<T>
            | PatchUrlVariables<T>
            | undefined);
        if (submitOptions?.onError) {
          submitOptions.onError({
            error:
              error instanceof Error
                ? ({
                    success: false,
                    message: error.message,
                  } as ErrorResponseType)
                : ({
                    success: false,
                    message: String(error),
                  } as ErrorResponseType),
            requestData,
            pathParams: urlPathParams,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [callback, endpoint, form, _onSuccess, _urlPathParams],
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
        requestData?: DeleteRequest<T>;
        urlPathParams?: DeleteUrlVariables<T>;
      }) => Promise<ResponseType<DeleteResponse<T>>>)
    | undefined,
  options: {
    urlPathParams?: DeleteUrlVariables<T>;
  } = {},
): {
  form: UseFormReturn<DeleteRequest<T>>;
  response: ResponseType<DeleteResponse<T>> | undefined;
  submitError: ErrorResponseType | null;
  isSubmitSuccessful: boolean;
  isSuccess: boolean;
  error: ErrorResponseType | null;
  submit: (requestData?: DeleteRequest<T>) => Promise<void>;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
} | null {
  type RequestType = DeleteRequest<T>;
  type ResponseDataType = DeleteResponse<T>;

  const [response, setResponse] = useState<
    ResponseType<ResponseDataType> | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The form holds the merged form values (request-data ∪ url-path-params),
  // validated by the endpoint's combined formSchema. At this erased endpoint
  // type FormValues is `any`.
  type FormValuesType = CreateApiEndpointAny["types"]["FormValues"];

  // Create form instance for localStorage mode (similar to API mode)
  const form = useForm<FormValuesType>({
    resolver: endpoint ? zodResolver(endpoint.formSchema) : undefined,
    defaultValues: {} as FormValuesType,
  });

  const submit = useCallback(
    async (requestData?: RequestType) => {
      if (!callback) {
        return;
      }

      setIsSubmitting(true);
      try {
        // Split merged form values into request-data + url-path-params; an
        // explicit options.urlPathParams takes priority over the split.
        const split = endpoint
          ? splitFormValues(endpoint, form.getValues())
          : { data: form.getValues(), urlPathParams: undefined };
        const dataToSubmit = requestData ?? (split.data as RequestType);
        const result = await callback({
          requestData: dataToSubmit,
          urlPathParams:
            options.urlPathParams ??
            (split.urlPathParams as DeleteUrlVariables<T> | undefined),
        });
        setResponse(result as ResponseType<ResponseDataType>);
      } finally {
        setIsSubmitting(false);
      }
    },
    [callback, endpoint, options.urlPathParams, form],
  );

  const submitForm = useCallback(async (): Promise<void> => {
    await form.handleSubmit(async (data) => {
      await submit(data);
    })();
  }, [form, submit]);

  if (!endpoint) {
    return null;
  }

  const submitError = response?.success === false ? response : null;

  return {
    form,
    response,
    submitError,
    isSubmitSuccessful: response?.success === true,
    isSuccess: response?.success === true,
    error: submitError,
    submit,
    submitForm,
    isSubmitting,
  };
}
