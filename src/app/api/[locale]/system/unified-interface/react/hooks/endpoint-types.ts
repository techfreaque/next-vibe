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

import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
  SubmitFormFunction,
} from "./types";

// All endpoint type extraction is now handled by centralized helpers from endpoint-helpers.ts
// These provide direct access to cached .types property without complex inference

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

// Hook options interface with operation-specific configuration
export interface UseEndpointOptions<T> {
  /**
   * Storage mode configuration
   * - api: Use API endpoints (default)
   * - localStorage: Use local storage with callbacks
   */
  storage?:
    | {
        /** Storage mode - defaults to "api" */
        mode: "api";
        callbacks?: never;
      }
    | {
        /** Local storage mode
         *  - requires callbacks instead of using API endpoints
         */
        mode: "localStorage";
        /** Type-safe callbacks for localStorage mode (required when mode is localStorage) */
        callbacks: LocalStorageCallbacks<T>;
      }
    | undefined;

  /**
   * Options for read (GET) operations
   * Supports all options from useEndpointRead hook
   */
  read?: {
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
    /** URL path parameters for the read endpoint */
    urlPathParams?: GetRequest<T> extends never
      ? undefined
      : GetUrlVariables<T>;
    /** Auto-prefill configuration */
    autoPrefillConfig?: AutoPrefillConfig;
    /** Initial state for the form (request data) */
    initialState?: "GET" extends keyof T ? Partial<GetRequest<T>> : undefined;
    /** Initial data for the response (disables initial fetch when provided) */
    initialData?: "GET" extends keyof T ? GetResponse<T> : undefined;
  };

  /**
   * Options for create/update (POST/PUT/PATCH) operations
   * Supports all options from useEndpointCreate hook
   */
  create?: {
    /** Form options for mutation forms */
    formOptions?: ApiFormOptions<
      PrimaryMutationRequest<T> extends never
        ? never
        : PrimaryMutationRequest<T>
    >;
    /** Mutation options for create/update operations */
    mutationOptions?: ApiMutationOptions<
      PrimaryMutationRequest<T> extends never
        ? never
        : PrimaryMutationRequest<T>,
      PrimaryMutationRequest<T> extends never
        ? never
        : PrimaryMutationResponse<T>,
      PrimaryMutationRequest<T> extends never
        ? never
        : PrimaryMutationUrlVariables<T>
    >;
    /** URL path parameters for the create endpoint */
    urlPathParams?: PrimaryMutationRequest<T> extends never
      ? never
      : PrimaryMutationUrlVariables<T>;
    /** Data to auto-prefill the form with (supports nested partial data) */
    autoPrefillData?: PrimaryMutationRequest<T> extends never
      ? undefined
      : DeepPartial<PrimaryMutationRequest<T>>;
    /** Initial state for the form (supports nested partial data) */
    initialState?: PrimaryMutationRequest<T> extends never
      ? undefined
      : DeepPartial<PrimaryMutationRequest<T>>;
  };

  /**
   * Options for update (PATCH) operations
   * Alias for PATCH endpoints with semantic naming
   */
  update?: {
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
    /** URL path parameters for the update endpoint */
    urlPathParams?: PatchRequest<T> extends never
      ? never
      : PatchUrlVariables<T>;
    /** Data to auto-prefill the form with (supports nested partial data) */
    autoPrefillData?: PatchRequest<T> extends never
      ? undefined
      : DeepPartial<PatchRequest<T>>;
    /** Initial state for the form (supports nested partial data) */
    initialState?: PatchRequest<T> extends never
      ? undefined
      : DeepPartial<PatchRequest<T>>;
  };

  /**
   * Options for delete (DELETE) operations
   * Supports all options from useEndpointDelete hook
   */
  delete?: {
    /** Mutation options for delete operations */
    mutationOptions?: ApiMutationOptions<
      DeleteRequest<T> extends never ? never : DeleteRequest<T>,
      DeleteRequest<T> extends never ? never : DeleteResponse<T>,
      DeleteRequest<T> extends never ? never : DeleteUrlVariables<T>
    >;
    /** URL path parameters for the delete endpoint */
    urlPathParams?: DeleteRequest<T> extends never
      ? undefined
      : DeleteUrlVariables<T>;
    /** Data to auto-prefill the form with */
    autoPrefillData?: DeleteRequest<T> extends never
      ? undefined
      : DeepPartial<DeleteRequest<T>>;
  };

  /**
   * Whether to automatically prefill the create form with data from the read operation
   * @default true
   */
  autoPrefill?: boolean;

  // ============================================================================
  // DEPRECATED OPTIONS - Use operation-specific options above instead
  // ============================================================================

  /** @deprecated Use read.urlPathParams, create.urlPathParams, or delete.urlPathParams instead */
  urlPathParams?: EndpointUrlVariables<T>;

  /** @deprecated Use read.queryOptions.enabled instead */
  enabled?: boolean;
  /** @deprecated Use read.queryOptions.staleTime instead */
  staleTime?: number;
  /** @deprecated Use read.queryOptions.refetchOnWindowFocus instead */
  refetchOnWindowFocus?: boolean;

  /** @deprecated Use create.formOptions.defaultValues instead */
  defaultValues?: PrimaryMutationRequest<T> extends never
    ? undefined
    : Partial<PrimaryMutationRequest<T>>;

  /** @deprecated Use read.initialState instead */
  filterOptions?: {
    initialFilters?: GetRequest<T> extends never
      ? undefined
      : Partial<GetRequest<T>>;
  };

  /** @deprecated Use read.queryOptions instead */
  queryOptions?: {
    enabled?: boolean;
    requestData?: GetRequest<T> extends never ? undefined : GetRequest<T>;
    urlPathParams?: EndpointUrlVariables<T>;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };

  /** @deprecated Use create.formOptions instead */
  formOptions?: {
    defaultValues?: PrimaryMutationRequest<T> extends never
      ? undefined
      : PrimaryMutationRequest<T>;
    persistForm?: boolean;
    persistenceKey?: string;
  };

  // Deprecated local storage options (no longer functional)
  /** @deprecated Local storage functionality has been removed */
  persistForm?: boolean;
  /** @deprecated Local storage functionality has been removed */
  persistenceKey?: string;
  /** @deprecated Local storage functionality has been removed */
  autoPrefillFromLocalStorage?: boolean;
  /** @deprecated Local storage functionality has been removed */
  showUnsavedChangesAlert?: boolean;
  /** @deprecated Local storage functionality has been removed */
  clearStorageAfterSubmit?: boolean;
}

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
  urlPathParams?: PrimaryMutationRequest<T> extends never
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
  urlPathParams?: DeleteRequest<T> extends never
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
