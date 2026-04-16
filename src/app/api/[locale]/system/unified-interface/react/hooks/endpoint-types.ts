import type {
  ErrorResponseType,
  MessageResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { Prettify } from "next-vibe/shared/types/utils";
import type { FormEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import type { ZodTypeDef } from "zod/v3";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
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
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-helpers";

import type { CacheKeyRequestData } from "./query-key-builder";
import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
  SubmitFormFunction,
} from "./types";

// All endpoint type extraction is now handled by centralized helpers from endpoint-helpers.ts
// These provide direct access to cached .types property without complex inference

// ── Cache key helpers ────────────────────────────────────────────────────────

/** True when T is the `any` type (not a concrete type) */
type IsAny<T> = 0 extends 1 & T ? true : false;

/** Cache key request data for the GET endpoint (undefined when no fields have includeInCacheKey) */
type GetCacheKeyData<T> = T extends {
  GET: infer E extends CreateApiEndpointAny;
}
  ? IsAny<CacheKeyRequestData<E>> extends true
    ? undefined
    : CacheKeyRequestData<E>
  : undefined;

/** True when a url variables type is "absent" (never or undefined) */
type IsAbsent<V> = [V] extends [never]
  ? true
  : [V] extends [undefined]
    ? true
    : false;

/**
 * Conditional type for urlPathParams field:
 * - any → optional (unknown whether required)
 * - never / undefined → optional undefined (not needed)
 * - concrete type → required
 */
type UrlParamsField<V> =
  IsAny<V> extends true
    ? { urlPathParams?: V }
    : IsAbsent<V> extends true
      ? { urlPathParams?: undefined }
      : { urlPathParams: V };

/**
 * True when url variables V make the section required.
 * any → false (unknown, treat as optional)
 * absent (never/undefined) → false (not needed)
 * concrete type → true (required)
 */
type UrlParamsRequired<V> =
  IsAny<V> extends true ? false : IsAbsent<V> extends true ? false : true;

/** True when `read` block must be provided (has urlPathParams or cache key fields) */
type ReadRequired<T> =
  UrlParamsRequired<GetUrlVariables<T>> extends true
    ? true
    : [GetCacheKeyData<T>] extends [undefined]
      ? false
      : true;

/** True when `create` block must be provided (has urlPathParams) */
type CreateRequired<T> = "POST" extends keyof T
  ? UrlParamsRequired<PrimaryMutationUrlVariables<T>>
  : "PUT" extends keyof T
    ? UrlParamsRequired<PrimaryMutationUrlVariables<T>>
    : false;

/** True when `update` block must be provided (has urlPathParams) */
type UpdateRequired<T> = "PATCH" extends keyof T
  ? UrlParamsRequired<PatchUrlVariables<T>>
  : false;

/** True when `delete` block must be provided (has urlPathParams) */
type DeleteRequired<T> = "DELETE" extends keyof T
  ? UrlParamsRequired<DeleteUrlVariables<T>>
  : false;

/** True when UseEndpointOptions itself can be omitted entirely */
export type OptionsOptional<T> = [ReadRequired<T>] extends [true]
  ? false
  : [CreateRequired<T>] extends [true]
    ? false
    : [UpdateRequired<T>] extends [true]
      ? false
      : [DeleteRequired<T>] extends [true]
        ? false
        : true;

// Combined URL variables type - supports both GET and mutation endpoints
// If GET exists, use its urlPathParams; otherwise use primary mutation's urlPathParams
export type EndpointUrlVariables<T> =
  GetRequest<T> extends never
    ? PrimaryMutationRequest<T> extends never
      ? undefined
      : PrimaryMutationUrlVariables<T>
    : GetUrlVariables<T>;

// AutoPrefill data type - represents data from GET response that can prefill mutation request
// When both GET and mutation endpoints exist, the GET response is used to prefill the mutation
// This type represents the intersection: it must be assignable to mutation request
export type AutoPrefillDataType<T> =
  GetRequest<T> extends never
    ? undefined
    : PrimaryMutationRequest<T> extends never
      ? undefined
      : GetResponse<T> extends PrimaryMutationRequest<T>
        ? GetResponse<T>
        : Partial<PrimaryMutationRequest<T>>;

// ── Per-section option shapes ────────────────────────────────────────────────

type ReadOptions<T> = {
  /** Form options for query forms (filtering, search, etc.) */
  formOptions?: ApiQueryFormOptions<
    GetRequest<T> extends never ? never : GetRequest<T>
  >;
  /** Query options for data fetching */
  queryOptions?: ApiQueryOptions<
    GetRequest<T> extends never ? never : GetRequest<T>,
    GetRequest<T> extends never ? never : GetResponse<T>,
    GetRequest<T> extends never ? never : GetUrlVariables<T>
  >;
  /** Auto-prefill configuration */
  autoPrefillConfig?: AutoPrefillConfig;
  /** Initial data for the response (disables initial fetch when provided) */
  initialData?: "GET" extends keyof T ? GetResponse<T> : undefined;
} & UrlParamsField<GetUrlVariables<T>> &
  ([GetCacheKeyData<T>] extends [undefined]
    ? { initialState?: Partial<GetRequest<T>> }
    : { initialState: GetCacheKeyData<T> & Partial<GetRequest<T>> });

type CreateOptions<T> = {
  /** Form options for mutation forms */
  formOptions?: ApiFormOptions<
    PrimaryMutationRequest<T> extends never ? never : PrimaryMutationRequest<T>
  >;
  /** Mutation options for create/update operations */
  mutationOptions?: ApiMutationOptions<
    PrimaryMutationRequest<T> extends never ? never : PrimaryMutationRequest<T>,
    PrimaryMutationRequest<T> extends never
      ? never
      : PrimaryMutationResponse<T>,
    PrimaryMutationRequest<T> extends never
      ? never
      : PrimaryMutationUrlVariables<T>
  >;
  /** Data to auto-prefill the form with */
  autoPrefillData?: PrimaryMutationRequest<T> extends never
    ? undefined
    : DeepPartial<PrimaryMutationRequest<T>>;
  /** Initial state for the form */
  initialState?: PrimaryMutationRequest<T> extends never
    ? undefined
    : DeepPartial<PrimaryMutationRequest<T>>;
} & UrlParamsField<PrimaryMutationUrlVariables<T>>;

type UpdateOptions<T> = {
  /** Form options for mutation forms */
  formOptions?: ApiFormOptions<
    PatchRequest<T> extends never ? never : PatchRequest<T>
  >;
  /** Mutation options for update operations */
  mutationOptions?: ApiMutationOptions<
    PatchRequest<T> extends never ? never : PatchRequest<T>,
    PatchRequest<T> extends never ? never : PatchResponse<T>,
    PatchRequest<T> extends never ? never : PatchUrlVariables<T>
  >;
  /** Data to auto-prefill the form with */
  autoPrefillData?: PatchRequest<T> extends never
    ? undefined
    : DeepPartial<PatchRequest<T>>;
  /** Initial state for the form */
  initialState?: PatchRequest<T> extends never
    ? undefined
    : DeepPartial<PatchRequest<T>>;
} & UrlParamsField<PatchUrlVariables<T>>;

type DeleteOptions<T> = {
  /** Mutation options for delete operations */
  mutationOptions?: ApiMutationOptions<
    DeleteRequest<T> extends never ? never : DeleteRequest<T>,
    DeleteRequest<T> extends never ? never : DeleteResponse<T>,
    DeleteRequest<T> extends never ? never : DeleteUrlVariables<T>
  >;
  /** Data to auto-prefill the form with */
  autoPrefillData?: DeleteRequest<T> extends never
    ? undefined
    : DeepPartial<DeleteRequest<T>>;
} & UrlParamsField<DeleteUrlVariables<T>>;

// Hook options type - all section keys are always optional for indexability.
// Enforcement of required sections happens at the call site via OptionsOptional<T>
// and the conditional mapped type in UseEndpointOptions (below).
// Within each section, urlPathParams/initialState are conditionally required
// based on the endpoint definition.
export interface UseEndpointOptionsBase<T> {
  read?: ReadOptions<T>;
  create?: CreateOptions<T>;
  update?: UpdateOptions<T>;
  delete?: DeleteOptions<T>;
  autoPrefill?: boolean;
  /** Subscribe to definition-driven WS events for the GET endpoint. */
  subscribeToEvents?: boolean;
}

// The exported type adds call-site enforcement: when a section has required fields,
// its key becomes required in the object. When nothing is required, the whole options
// object can be omitted (enforced at useEndpoint/EndpointsPage call site via OptionsOptional<T>).
export type UseEndpointOptions<T> = UseEndpointOptionsBase<T> &
  ([ReadRequired<T>] extends [true]
    ? { read: ReadOptions<T> }
    : Record<never, never>) &
  ([CreateRequired<T>] extends [true]
    ? { create: CreateOptions<T> }
    : Record<never, never>) &
  ([UpdateRequired<T>] extends [true]
    ? { update: UpdateOptions<T> }
    : Record<never, never>) &
  ([DeleteRequired<T>] extends [true]
    ? { delete: DeleteOptions<T> }
    : Record<never, never>);

// Alert state interface for FormAlert component
export interface FormAlertState {
  variant: "default" | "destructive" | "success" | "warning";
  title: MessageResponseType;
  message: MessageResponseType;
}

export type UseEndpointMutationOptions<T> = ApiMutationOptions<
  PrimaryMutationRequest<T> extends never ? never : PrimaryMutationRequest<T>,
  PrimaryMutationRequest<T> extends never ? never : PrimaryMutationResponse<T>,
  PrimaryMutationRequest<T> extends never
    ? never
    : PrimaryMutationUrlVariables<T>
>;

// Create operation return type
export type CreateOperationReturn<T> = "POST" extends keyof T
  ? {
      form: UseFormReturn<
        PrimaryMutationRequest<T>,
        ZodType<
          PrimaryMutationRequest<T>,
          ZodTypeDef,
          PrimaryMutationRequest<T>
        >
      >;
      /** The complete response including success/error state */
      response: ResponseType<PrimaryMutationResponse<T>> | undefined;

      // Backward compatibility properties
      /** @deprecated Use response?.success === true instead */
      isSuccess: boolean;
      /** @deprecated Use response?.success === false ? response : null instead */
      error: ErrorResponseType | null;

      values: Partial<PrimaryMutationRequest<T>>;
      setValue: <K extends keyof PrimaryMutationRequest<T>>(
        key: K,
        value: PrimaryMutationRequest<T>[K],
      ) => void;
      onSubmit: (e: FormEvent) => Promise<void>;
      reset: () => void;
      isSubmitting: boolean;
      isDirty: boolean;
      clearSavedForm: () => void;
      /** @deprecated Use response property instead */
      setErrorType: (error: ErrorResponseType | null) => void;
    }
  : "PUT" extends keyof T
    ? {
        form: UseFormReturn<
          PrimaryMutationRequest<T>,
          ZodType<
            PrimaryMutationRequest<T>,
            ZodTypeDef,
            PrimaryMutationRequest<T>
          >
        >;
        /** The complete response including success/error state */
        response: ResponseType<PrimaryMutationResponse<T>> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PrimaryMutationRequest<T>>;
        setValue: <K extends keyof PrimaryMutationRequest<T>>(
          key: K,
          value: PrimaryMutationRequest<T>[K],
        ) => void;
        onSubmit: (e: FormEvent) => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      }
    : "PATCH" extends keyof T
      ? {
          form: UseFormReturn<
            PrimaryMutationRequest<T>,
            ZodType<
              PrimaryMutationRequest<T>,
              ZodTypeDef,
              PrimaryMutationRequest<T>
            >
          >;
          /** The complete response including success/error state */
          response: ResponseType<PrimaryMutationResponse<T>> | undefined;

          // Backward compatibility properties
          /** @deprecated Use response?.success === true instead */
          isSuccess: boolean;
          /** @deprecated Use response?.success === false ? response : null instead */
          error: ErrorResponseType | null;

          values: Partial<PrimaryMutationRequest<T>>;
          setValue: <K extends keyof PrimaryMutationRequest<T>>(
            key: K,
            value: PrimaryMutationRequest<T>[K],
          ) => void;
          onSubmit: (e: FormEvent) => Promise<void>;
          reset: () => void;
          isSubmitting: boolean;
          isDirty: boolean;
          clearSavedForm: () => void;
          /** @deprecated Use response property instead */
          setErrorType: (error: ErrorResponseType | null) => void;
        }
      : "DELETE" extends keyof T
        ? {
            form: UseFormReturn<
              PrimaryMutationRequest<T>,
              ZodType<
                PrimaryMutationRequest<T>,
                ZodTypeDef,
                PrimaryMutationRequest<T>
              >
            >;
            /** The complete response including success/error state */
            response: ResponseType<PrimaryMutationResponse<T>> | undefined;

            // Backward compatibility properties
            /** @deprecated Use response?.success === true instead */
            isSuccess: boolean;
            /** @deprecated Use response?.success === false ? response : null instead */
            error: ErrorResponseType | null;

            values: Partial<PrimaryMutationRequest<T>>;
            setValue: <K extends keyof PrimaryMutationRequest<T>>(
              key: K,
              value: PrimaryMutationRequest<T>[K],
            ) => void;
            onSubmit: (e: FormEvent) => Promise<void>;
            reset: () => void;
            isSubmitting: boolean;
            isDirty: boolean;
            clearSavedForm: () => void;
            /** @deprecated Use response property instead */
            setErrorType: (error: ErrorResponseType | null) => void;
          }
        : undefined;

// Read operation return type
export type ReadOperationReturn<T> = "GET" extends keyof T
  ? {
      form: UseFormReturn<
        GetRequest<T>,
        ZodType<GetRequest<T>, ZodTypeDef, GetRequest<T>>
      >;
      /** The complete response including success/error state */
      response: ResponseType<GetResponse<T>> | undefined;

      // Backward compatibility properties
      /** @deprecated Use response.success and response.data instead */
      data: GetResponse<T> | undefined;
      /** @deprecated Use !response?.success instead */
      isError: boolean;
      /** @deprecated Use response?.success === false ? response : null instead */
      error: ErrorResponseType | null;
      /** @deprecated Use response?.success === true instead */
      isSuccess: boolean;
      /** @deprecated Use response?.success === true instead */
      isSubmitSuccessful: boolean;
      /** @deprecated Use response?.success === false ? response : undefined instead */
      submitError: ErrorResponseType | undefined;

      isLoading: boolean;
      isLoadingFresh: boolean;
      isCachedData: boolean;
      refetch: () => Promise<void>;
      submitForm: SubmitFormFunction<
        GetRequest<T>,
        GetResponse<T>,
        GetUrlVariables<T>
      >;
      isSubmitting: boolean;
      clearSavedForm: () => void;
      /** @deprecated Use response property instead */
      setErrorType: (error: ErrorResponseType | null) => void;
      isFetching: boolean;
      status: "loading" | "success" | "error" | "idle";
    }
  : undefined;

// Delete operation return type
export type DeleteOperationReturn<T> = "DELETE" extends keyof T
  ? {
      /** The complete response including success/error state */
      response: ResponseType<DeleteResponse<T>> | undefined;

      // Backward compatibility properties
      /** @deprecated Use response?.success === true instead */
      isSuccess: boolean;
      /** @deprecated Use response?.success === false ? response : null instead */
      error: ErrorResponseType | null;

      submit: (data?: DeleteRequest<T>) => Promise<void>;
      isSubmitting: boolean;
    }
  : undefined;

// Main endpoint return interface
export type EndpointReturn<T> = Prettify<{
  // Combined alert state for FormAlert component
  alert: FormAlertState | null;

  // CRUD Operations
  read: "GET" extends keyof T
    ? {
        form: UseFormReturn<
          GetRequest<T>,
          ZodType<GetRequest<T>, ZodTypeDef, GetRequest<T>>
        >;
        /** The complete response including success/error state */
        response: ResponseType<GetResponse<T>> | undefined;

        // Backward compatibility properties
        data: GetResponse<T> | undefined;
        /** @deprecated Use !response?.success instead */
        isError: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === true instead */
        isSubmitSuccessful: boolean;
        /** @deprecated Use response?.success === false ? response : undefined instead */
        submitError: ErrorResponseType | undefined;

        isLoading: boolean;
        isLoadingFresh: boolean;
        isCachedData: boolean;
        refetch: () => Promise<void>;
        submitForm: SubmitFormFunction<
          GetRequest<T>,
          GetResponse<T>,
          GetUrlVariables<T>
        >;
        isSubmitting: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
        isFetching: boolean;
        status: "loading" | "success" | "error" | "idle";
      }
    : undefined;

  create: "POST" extends keyof T
    ? {
        form: UseFormReturn<
          PrimaryMutationRequest<T>,
          ZodType<
            PrimaryMutationRequest<T>,
            ZodTypeDef,
            PrimaryMutationRequest<T>
          >
        >;
        /** The complete response including success/error state */
        response: ResponseType<PrimaryMutationResponse<T>> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PrimaryMutationRequest<T>>;
        setValue: <K extends keyof PrimaryMutationRequest<T>>(
          key: K,
          value: PrimaryMutationRequest<T>[K],
        ) => void;
        onSubmit: () => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        submitForm: SubmitFormFunction<
          PrimaryMutationRequest<T>,
          PrimaryMutationResponse<T>,
          PrimaryMutationUrlVariables<T>
        >;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      }
    : "PUT" extends keyof T
      ? {
          form: UseFormReturn<
            PrimaryMutationRequest<T>,
            ZodType<
              PrimaryMutationRequest<T>,
              ZodTypeDef,
              PrimaryMutationRequest<T>
            >
          >;
          /** The complete response including success/error state */
          response: ResponseType<PrimaryMutationResponse<T>> | undefined;

          // Backward compatibility properties
          /** @deprecated Use response?.success === true instead */
          isSuccess: boolean;
          /** @deprecated Use response?.success === false ? response : null instead */
          error: ErrorResponseType | null;

          values: Partial<PrimaryMutationRequest<T>>;
          setValue: <K extends keyof PrimaryMutationRequest<T>>(
            key: K,
            value: PrimaryMutationRequest<T>[K],
          ) => void;
          onSubmit: () => Promise<void>;
          reset: () => void;
          isSubmitting: boolean;
          isDirty: boolean;
          submitForm: SubmitFormFunction<
            PrimaryMutationRequest<T>,
            PrimaryMutationResponse<T>,
            PrimaryMutationUrlVariables<T>
          >;
          clearSavedForm: () => void;
          /** @deprecated Use response property instead */
          setErrorType: (error: ErrorResponseType | null) => void;
        }
      : "PATCH" extends keyof T
        ? {
            form: UseFormReturn<
              PrimaryMutationRequest<T>,
              ZodType<
                PrimaryMutationRequest<T>,
                ZodTypeDef,
                PrimaryMutationRequest<T>
              >
            >;
            /** The complete response including success/error state */
            response: ResponseType<PrimaryMutationResponse<T>> | undefined;

            // Backward compatibility properties
            /** @deprecated Use response?.success === true instead */
            isSuccess: boolean;
            /** @deprecated Use response?.success === false ? response : null instead */
            error: ErrorResponseType | null;

            values: Partial<PrimaryMutationRequest<T>>;
            setValue: <K extends keyof PrimaryMutationRequest<T>>(
              key: K,
              value: PrimaryMutationRequest<T>[K],
            ) => void;
            onSubmit: () => Promise<void>;
            reset: () => void;
            isSubmitting: boolean;
            isDirty: boolean;
            submitForm: SubmitFormFunction<
              PrimaryMutationRequest<T>,
              PrimaryMutationResponse<T>,
              PrimaryMutationUrlVariables<T>
            >;
            clearSavedForm: () => void;
            /** @deprecated Use response property instead */
            setErrorType: (error: ErrorResponseType | null) => void;
          }
        : "DELETE" extends keyof T
          ? {
              form: UseFormReturn<
                PrimaryMutationRequest<T>,
                ZodType<
                  PrimaryMutationRequest<T>,
                  ZodTypeDef,
                  PrimaryMutationRequest<T>
                >
              >;
              /** The complete response including success/error state */
              response: ResponseType<PrimaryMutationResponse<T>> | undefined;

              // Backward compatibility properties
              /** @deprecated Use response?.success === true instead */
              isSuccess: boolean;
              /** @deprecated Use response?.success === false ? response : null instead */
              error: ErrorResponseType | null;

              values: Partial<PrimaryMutationRequest<T>>;
              setValue: <K extends keyof PrimaryMutationRequest<T>>(
                key: K,
                value: PrimaryMutationRequest<T>[K],
              ) => void;
              onSubmit: () => Promise<void>;
              reset: () => void;
              isSubmitting: boolean;
              isDirty: boolean;
              submitForm: SubmitFormFunction<
                PrimaryMutationRequest<T>,
                PrimaryMutationResponse<T>,
                PrimaryMutationUrlVariables<T>
              >;
              clearSavedForm: () => void;
              /** @deprecated Use response property instead */
              setErrorType: (error: ErrorResponseType | null) => void;
            }
          : undefined;

  update: "PATCH" extends keyof T
    ? {
        form: UseFormReturn<
          PatchRequest<T>,
          ZodType<PatchRequest<T>, ZodTypeDef, PatchRequest<T>>
        >;
        /** The complete response including success/error state */
        response: ResponseType<PatchResponse<T>> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PatchRequest<T>>;
        setValue: <K extends keyof PatchRequest<T>>(
          key: K,
          value: PatchRequest<T>[K],
        ) => void;
        submit: (data: PatchRequest<T>) => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      }
    : undefined;

  delete: "DELETE" extends keyof T
    ? {
        /** React Hook Form instance */
        form: UseFormReturn<
          DeleteRequest<T>,
          ZodType<DeleteRequest<T>, ZodTypeDef, DeleteRequest<T>>
        >;
        /** The complete response including success/error state */
        response: ResponseType<DeleteResponse<T>> | undefined;
        /** Submit error from mutation */
        submitError: ErrorResponseType | null;
        /** Whether submission was successful */
        isSubmitSuccessful: boolean;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use submitError instead */
        error: ErrorResponseType | null;

        submit: (data?: DeleteRequest<T>) => Promise<void>;
        /** Submit form function (calls form.handleSubmit) */
        submitForm: () => Promise<void>;
        isSubmitting: boolean;
      }
    : undefined;

  // Combined state
  /** @deprecated Use response property from individual operations instead */
  isLoading: boolean;
  /** @deprecated Use response property from individual operations instead */
  error: ErrorResponseType | null;
}>;

// Options for individual hooks
export interface UseEndpointCreateOptions<T> {
  formOptions?: ApiFormOptions<
    PrimaryMutationRequest<T> extends never ? never : PrimaryMutationRequest<T>
  >;
  mutationOptions?: ApiMutationOptions<
    PrimaryMutationRequest<T> extends never ? never : PrimaryMutationRequest<T>,
    PrimaryMutationRequest<T> extends never
      ? never
      : PrimaryMutationResponse<T>,
    PrimaryMutationRequest<T> extends never
      ? never
      : PrimaryMutationUrlVariables<T>
  >;
  urlPathParams?: PrimaryMutationUrlVariables<T> extends never
    ? undefined
    : PrimaryMutationUrlVariables<T>;
  autoPrefillData?: PrimaryMutationRequest<T> extends never
    ? undefined
    : Partial<PrimaryMutationRequest<T>>;
}

export interface UseEndpointReadOptions<T> {
  formOptions?: ApiQueryFormOptions<
    GetRequest<T> extends never ? never : GetRequest<T>
  >;
  queryOptions?: ApiQueryOptions<
    GetRequest<T> extends never ? never : GetRequest<T>,
    GetRequest<T> extends never ? never : GetResponse<T>,
    GetRequest<T> extends never ? never : GetUrlVariables<T>
  >;
  urlPathParams: GetRequest<T> extends never ? undefined : GetUrlVariables<T>;
}

export interface UseEndpointDeleteOptions<T> {
  mutationOptions?: ApiMutationOptions<
    DeleteRequest<T> extends never ? never : DeleteRequest<T>,
    DeleteRequest<T> extends never ? never : DeleteResponse<T>,
    DeleteRequest<T> extends never ? never : DeleteUrlVariables<T>
  >;
  urlPathParams?: DeleteUrlVariables<T> extends never
    ? undefined
    : DeleteUrlVariables<T>;
}

/**
 * Form auto-prefill types and configurations
 */

export interface AutoPrefillConfig {
  /** Enable auto-prefill from server data (default: true) */
  autoPrefill?: boolean;
  /** Enable auto-prefill from local storage (default: true) */
  autoPrefillFromLocalStorage?: boolean;
  /** Show unsaved changes alert when form is dirty (default: true) */
  showUnsavedChangesAlert?: boolean;
  /** Clear local storage after successful submit (default: true in production, false in dev) */
  clearStorageAfterSubmit?: boolean;
}

export interface FormDataSources<T> {
  /** Default values from form configuration */
  defaultValues?: Partial<T>;
  /** Server data from API response */
  serverData?: T;
  /** Local storage data (unsaved changes) */
  localStorageData?: Partial<T>;
  /** Initial state override */
  initialState?: Partial<T>;
}

export interface FormDataPriority<T> {
  /** Final merged data to use for form */
  finalData: Partial<T>;
  /** Source that was used for the data */
  dataSource: "default" | "server" | "localStorage" | "initialState";
  /** Whether local storage data was used (indicates unsaved changes) */
  hasUnsavedChanges: boolean;
}

/**
 * Type-safe callbacks for localStorage mode
 * All callbacks must return ResponseType to maintain consistency with API mode
 */
export interface LocalStorageCallbacks<T> {
  /** Callback for GET/read operations */
  read?: "GET" extends keyof T
    ? (params: {
        urlPathParams?: GetUrlVariables<T>;
        requestData?: GetRequest<T>;
      }) => Promise<ResponseType<GetResponse<T>>>
    : undefined;

  /** Callback for POST/create operations */
  create?: "POST" extends keyof T
    ? (params: {
        requestData: PrimaryMutationRequest<T>;
        urlPathParams?: PrimaryMutationUrlVariables<T>;
      }) => Promise<ResponseType<PrimaryMutationResponse<T>>>
    : undefined;

  /** Callback for PATCH/update operations */
  update?: "PATCH" extends keyof T
    ? (params: {
        requestData: PatchRequest<T>;
        urlPathParams?: PatchUrlVariables<T>;
      }) => Promise<ResponseType<PatchResponse<T>>>
    : undefined;

  /** Callback for DELETE operations */
  delete?: "DELETE" extends keyof T
    ? (params: {
        requestData?: DeleteRequest<T>;
        urlPathParams?: DeleteUrlVariables<T>;
      }) => Promise<ResponseType<DeleteResponse<T>>>
    : undefined;
}
