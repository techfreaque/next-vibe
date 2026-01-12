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
import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type {
  ExtractOutput,
  InferSchemaFromField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type {
  FieldUsage,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
  SubmitFormFunction,
} from "./types";

// Type helpers for extracting endpoint types
// CRITICAL: Access .types property DIRECTLY to avoid losing type information through infer
// The CreateApiEndpoint has a .types property with pre-computed type assertions
export type ExtractEndpointTypes<T> = T extends { types: infer TTypes }
  ? TTypes extends {
      RequestInput: infer TRequestInput;
      RequestOutput: infer TRequestOutput;
      ResponseInput: infer TResponseInput;
      ResponseOutput: infer TResponseOutput;
      UrlVariablesInput: infer TUrlVariablesInput;
      UrlVariablesOutput: infer TUrlVariablesOutput;
    }
    ? {
        request: TRequestOutput;
        response: TResponseOutput;
        urlPathParams: TUrlVariablesOutput;
        requestInput: TRequestInput;
        requestOutput: TRequestOutput;
        responseInput: TResponseInput;
        responseOutput: TResponseOutput;
        urlPathParamsInput: TUrlVariablesInput;
        urlPathParamsOutput: TUrlVariablesOutput;
      }
    : never
  : never;

// Extract types from endpoints map
// Directly access .types property on T["GET"] to avoid any type loss
export type GetEndpointTypes<T> = "GET" extends keyof T
  ? T["GET"] extends { types: infer TTypes }
    ? TTypes extends {
        RequestInput: infer TRequestInput;
        RequestOutput: infer TRequestOutput;
        ResponseInput: infer TResponseInput;
        ResponseOutput: infer TResponseOutput;
        UrlVariablesInput: infer TUrlVariablesInput;
        UrlVariablesOutput: infer TUrlVariablesOutput;
      }
      ? {
          request: TRequestOutput;
          response: TResponseOutput;
          urlPathParams: TUrlVariablesOutput;
          requestInput: TRequestInput;
          requestOutput: TRequestOutput;
          responseInput: TResponseInput;
          responseOutput: TResponseOutput;
          urlPathParamsInput: TUrlVariablesInput;
          urlPathParamsOutput: TUrlVariablesOutput;
        }
      : never
    : never
  : never;

export type PostEndpointTypes<T> = "POST" extends keyof T ? ExtractEndpointTypes<T["POST"]> : never;

export type PutEndpointTypes<T> = "PUT" extends keyof T ? ExtractEndpointTypes<T["PUT"]> : never;

export type PatchEndpointTypes<T> = "PATCH" extends keyof T
  ? ExtractEndpointTypes<T["PATCH"]>
  : never;

export type DeleteEndpointTypes<T> = "DELETE" extends keyof T
  ? ExtractEndpointTypes<T["DELETE"]>
  : never;

// Primary mutation type (prefer POST, then PUT, then PATCH, then DELETE)
export type PrimaryMutationTypes<T> =
  PostEndpointTypes<T> extends never
    ? PutEndpointTypes<T> extends never
      ? PatchEndpointTypes<T> extends never
        ? DeleteEndpointTypes<T> extends never
          ? never
          : DeleteEndpointTypes<T>
        : PatchEndpointTypes<T>
      : PutEndpointTypes<T>
    : PostEndpointTypes<T>;

// Combined URL variables type - supports both GET and mutation endpoints
// If GET exists, use its urlPathParams; otherwise use primary mutation's urlPathParams
export type EndpointUrlVariables<T> =
  GetEndpointTypes<T> extends never
    ? PrimaryMutationTypes<T> extends never
      ? undefined
      : PrimaryMutationTypes<T>["urlPathParams"]
    : GetEndpointTypes<T>["urlPathParams"];

// AutoPrefill data type - represents data from GET response that can prefill mutation request
// When both GET and mutation endpoints exist, the GET response is used to prefill the mutation
// This type represents the intersection: it must be assignable to mutation request
export type AutoPrefillDataType<T> =
  GetEndpointTypes<T> extends never
    ? undefined
    : PrimaryMutationTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["response"] extends PrimaryMutationTypes<T>["request"]
        ? GetEndpointTypes<T>["response"]
        : Partial<PrimaryMutationTypes<T>["request"]>;

// Hook options interface with operation-specific configuration
export interface UseEndpointOptions<T> {
  /**
   * Storage mode configuration
   * - api: Use API endpoints (default)
   * - localStorage: Use local storage with callbacks
   */
  storage?: {
    /** Storage mode - defaults to "api" */
    mode: "api" | "localStorage";
    /** Type-safe callbacks for localStorage mode (required when mode is localStorage) */
    callbacks?: LocalStorageCallbacks<T>;
  };

  /**
   * Options for read (GET) operations
   * Supports all options from useEndpointRead hook
   */
  read?: {
    /** Form options for query forms (filtering, search, etc.) */
    formOptions?: ApiQueryFormOptions<
      GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["request"]
    >;
    /** Query options for data fetching */
    queryOptions?: ApiQueryOptions<
      GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["request"],
      GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["response"],
      GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["urlPathParams"]
    >;
    /** URL path parameters for the read endpoint */
    urlPathParams?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["urlPathParams"];
    /** Auto-prefill configuration */
    autoPrefillConfig?: AutoPrefillConfig;
    /** Initial state for the form (request data) */
    initialState?: GetEndpointTypes<T> extends never
      ? undefined
      : Partial<GetEndpointTypes<T>["request"]>;
    /** Initial data for the response (disables initial fetch when provided) */
    initialData?: GetEndpointTypes<T> extends never ? undefined : GetEndpointTypes<T>["response"];
  };

  /**
   * Options for create/update (POST/PUT/PATCH) operations
   * Supports all options from useEndpointCreate hook
   */
  create?: {
    /** Form options for mutation forms */
    formOptions?: ApiFormOptions<
      PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["request"]
    >;
    /** Mutation options for create/update operations */
    mutationOptions?: ApiMutationOptions<
      PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["request"],
      PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["response"],
      PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["urlPathParams"]
    >;
    /** URL path parameters for the create endpoint */
    urlPathParams?: PrimaryMutationTypes<T> extends never
      ? never
      : PrimaryMutationTypes<T>["urlPathParams"];
    /** Data to auto-prefill the form with (supports nested partial data) */
    autoPrefillData?: PrimaryMutationTypes<T> extends never
      ? undefined
      : DeepPartial<PrimaryMutationTypes<T>["request"]>;
    /** Initial state for the form (supports nested partial data) */
    initialState?: PrimaryMutationTypes<T> extends never
      ? undefined
      : DeepPartial<PrimaryMutationTypes<T>["request"]>;
  };

  /**
   * Options for update (PATCH) operations
   * Alias for PATCH endpoints with semantic naming
   */
  update?: {
    /** Form options for mutation forms */
    formOptions?: ApiFormOptions<
      PatchEndpointTypes<T> extends never ? never : PatchEndpointTypes<T>["request"]
    >;
    /** Mutation options for update operations */
    mutationOptions?: ApiMutationOptions<
      PatchEndpointTypes<T> extends never ? never : PatchEndpointTypes<T>["request"],
      PatchEndpointTypes<T> extends never ? never : PatchEndpointTypes<T>["response"],
      PatchEndpointTypes<T> extends never ? never : PatchEndpointTypes<T>["urlPathParams"]
    >;
    /** URL path parameters for the update endpoint */
    urlPathParams?: PatchEndpointTypes<T> extends never
      ? never
      : PatchEndpointTypes<T>["urlPathParams"];
    /** Data to auto-prefill the form with (supports nested partial data) */
    autoPrefillData?: PatchEndpointTypes<T> extends never
      ? undefined
      : DeepPartial<PatchEndpointTypes<T>["request"]>;
    /** Initial state for the form (supports nested partial data) */
    initialState?: PatchEndpointTypes<T> extends never
      ? undefined
      : DeepPartial<PatchEndpointTypes<T>["request"]>;
  };

  /**
   * Options for delete (DELETE) operations
   * Supports all options from useEndpointDelete hook
   */
  delete?: {
    /** Mutation options for delete operations */
    mutationOptions?: ApiMutationOptions<
      DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["request"],
      DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["response"],
      DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["urlPathParams"]
    >;
    /** URL path parameters for the delete endpoint */
    urlPathParams?: DeleteEndpointTypes<T> extends never
      ? undefined
      : DeleteEndpointTypes<T>["urlPathParams"];
    /** Data to auto-prefill the form with */
    autoPrefillData?: DeleteEndpointTypes<T> extends never
      ? undefined
      : DeepPartial<DeleteEndpointTypes<T>["request"]>;
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
  defaultValues?: PrimaryMutationTypes<T> extends never
    ? undefined
    : Partial<PrimaryMutationTypes<T>["request"]>;

  /** @deprecated Use read.initialState instead */
  filterOptions?: {
    initialFilters?: GetEndpointTypes<T> extends never
      ? undefined
      : Partial<GetEndpointTypes<T>["request"]>;
  };

  /** @deprecated Use read.queryOptions instead */
  queryOptions?: {
    enabled?: boolean;
    requestData?: GetEndpointTypes<T> extends never ? undefined : GetEndpointTypes<T>["request"];
    urlPathParams?: EndpointUrlVariables<T>;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };

  /** @deprecated Use create.formOptions instead */
  formOptions?: {
    defaultValues?: PrimaryMutationTypes<T> extends never
      ? undefined
      : PrimaryMutationTypes<T>["request"];
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
  PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["request"],
  PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["response"],
  PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["urlPathParams"]
>;

// Create operation return type
export type CreateOperationReturn<T> =
  PrimaryMutationTypes<T> extends never
    ? undefined
    : {
        form: UseFormReturn<
          PrimaryMutationTypes<T>["request"],
          ZodType<
            PrimaryMutationTypes<T>["request"],
            ZodTypeDef,
            PrimaryMutationTypes<T>["request"]
          >
        >;
        /** The complete response including success/error state */
        response: ResponseType<PrimaryMutationTypes<T>["response"]> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PrimaryMutationTypes<T>["request"]>;
        setValue: <K extends keyof PrimaryMutationTypes<T>["request"]>(
          key: K,
          value: PrimaryMutationTypes<T>["request"][K],
        ) => void;
        onSubmit: (e: FormEvent) => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      };

// Read operation return type
export type ReadOperationReturn<T> =
  GetEndpointTypes<T> extends never
    ? undefined
    : {
        form: UseFormReturn<
          GetEndpointTypes<T>["request"],
          ZodType<GetEndpointTypes<T>["request"], ZodTypeDef, GetEndpointTypes<T>["request"]>
        >;
        /** The complete response including success/error state */
        response: ResponseType<GetEndpointTypes<T>["response"]> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response.success and response.data instead */
        data: GetEndpointTypes<T>["response"] | undefined;
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
          GetEndpointTypes<T>["request"],
          GetEndpointTypes<T>["response"],
          GetEndpointTypes<T>["urlPathParams"]
        >;
        isSubmitting: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
        isFetching: boolean;
        status: "loading" | "success" | "error" | "idle";
      };

// Delete operation return type
export type DeleteOperationReturn<T> = T extends {
  DELETE: CreateApiEndpoint<string, Methods, readonly UserRoleValue[], string, infer TFields>;
}
  ? {
      /** The complete response including success/error state */
      response:
        | ResponseType<ExtractOutput<InferSchemaFromField<TFields, FieldUsage.ResponseData>>>
        | undefined;

      // Backward compatibility properties
      /** @deprecated Use response?.success === true instead */
      isSuccess: boolean;
      /** @deprecated Use response?.success === false ? response : null instead */
      error: ErrorResponseType | null;

      submit: (
        data?: ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
      ) => Promise<void>;
      isSubmitting: boolean;
    }
  : undefined;

// Main endpoint return interface
export type EndpointReturn<T> = Prettify<{
  // Combined alert state for FormAlert component
  alert: FormAlertState | null;

  // CRUD Operations
  read: GetEndpointTypes<T> extends never
    ? undefined
    : {
        form: UseFormReturn<
          GetEndpointTypes<T>["request"],
          ZodType<GetEndpointTypes<T>["request"], ZodTypeDef, GetEndpointTypes<T>["request"]>
        >;
        /** The complete response including success/error state */
        response: ResponseType<GetEndpointTypes<T>["response"]> | undefined;

        // Backward compatibility properties
        data: GetEndpointTypes<T>["response"] | undefined;
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
          GetEndpointTypes<T>["request"],
          GetEndpointTypes<T>["response"],
          GetEndpointTypes<T>["urlPathParams"]
        >;
        isSubmitting: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
        isFetching: boolean;
        status: "loading" | "success" | "error" | "idle";
      };

  create: PrimaryMutationTypes<T> extends never
    ? undefined
    : {
        form: UseFormReturn<
          PrimaryMutationTypes<T>["request"],
          ZodType<
            PrimaryMutationTypes<T>["request"],
            ZodTypeDef,
            PrimaryMutationTypes<T>["request"]
          >
        >;
        /** The complete response including success/error state */
        response: ResponseType<PrimaryMutationTypes<T>["response"]> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PrimaryMutationTypes<T>["request"]>;
        setValue: <K extends keyof PrimaryMutationTypes<T>["request"]>(
          key: K,
          value: PrimaryMutationTypes<T>["request"][K],
        ) => void;
        onSubmit: () => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        submitForm: SubmitFormFunction<
          PrimaryMutationTypes<T>["request"],
          PrimaryMutationTypes<T>["response"],
          PrimaryMutationTypes<T>["urlPathParams"]
        >;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      };

  update: PatchEndpointTypes<T> extends never
    ? undefined
    : {
        form: UseFormReturn<
          PatchEndpointTypes<T>["request"],
          ZodType<PatchEndpointTypes<T>["request"], ZodTypeDef, PatchEndpointTypes<T>["request"]>
        >;
        /** The complete response including success/error state */
        response: ResponseType<PatchEndpointTypes<T>["response"]> | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        values: Partial<PatchEndpointTypes<T>["request"]>;
        setValue: <K extends keyof PatchEndpointTypes<T>["request"]>(
          key: K,
          value: PatchEndpointTypes<T>["request"][K],
        ) => void;
        submit: (data: PatchEndpointTypes<T>["request"]) => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      };

  delete: T extends {
    DELETE: CreateApiEndpoint<string, Methods, readonly UserRoleValue[], string, infer TFields>;
  }
    ? {
        /** React Hook Form instance */
        form: UseFormReturn<ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>>;
        /** The complete response including success/error state */
        response:
          | ResponseType<ExtractOutput<InferSchemaFromField<TFields, FieldUsage.ResponseData>>>
          | undefined;
        /** Submit error from mutation */
        submitError: ErrorResponseType | null;
        /** Whether submission was successful */
        isSubmitSuccessful: boolean;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use submitError instead */
        error: ErrorResponseType | null;

        submit: (
          data?: ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
        ) => Promise<void>;
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
    PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["request"]
  >;
  mutationOptions?: ApiMutationOptions<
    PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["request"],
    PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["response"],
    PrimaryMutationTypes<T> extends never ? never : PrimaryMutationTypes<T>["urlPathParams"]
  >;
  urlPathParams?: PrimaryMutationTypes<T> extends never
    ? undefined
    : PrimaryMutationTypes<T>["urlPathParams"];
  autoPrefillData?: PrimaryMutationTypes<T> extends never
    ? undefined
    : Partial<PrimaryMutationTypes<T>["request"]>;
}

export interface UseEndpointReadOptions<T> {
  formOptions?: ApiQueryFormOptions<
    GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["request"]
  >;
  queryOptions?: ApiQueryOptions<
    GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["request"],
    GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["response"],
    GetEndpointTypes<T> extends never ? never : GetEndpointTypes<T>["urlPathParams"]
  >;
  urlPathParams: GetEndpointTypes<T> extends never
    ? undefined
    : GetEndpointTypes<T>["urlPathParams"];
}

export interface UseEndpointDeleteOptions<T> {
  mutationOptions?: ApiMutationOptions<
    DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["request"],
    DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["response"],
    DeleteEndpointTypes<T> extends never ? never : DeleteEndpointTypes<T>["urlPathParams"]
  >;
  urlPathParams?: DeleteEndpointTypes<T> extends never
    ? undefined
    : DeleteEndpointTypes<T>["urlPathParams"];
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

// ============================================================================
// LOCAL STORAGE CALLBACKS
// ============================================================================

/**
 * Type-safe callbacks for localStorage mode
 * All callbacks must return ResponseType to maintain consistency with API mode
 */
export interface LocalStorageCallbacks<T> {
  /** Callback for GET/read operations */
  read?: T extends { GET: CreateApiEndpointAny }
    ? (params: {
        urlPathParams?: T["GET"]["types"]["UrlVariablesOutput"];
        requestData?: T["GET"]["types"]["RequestOutput"];
      }) => Promise<ResponseType<T["GET"]["types"]["ResponseOutput"]>>
    : undefined;

  /** Callback for POST/create operations */
  create?: T extends { POST: CreateApiEndpointAny }
    ? (params: {
        requestData: T["POST"]["types"]["RequestOutput"];
        urlPathParams?: T["POST"]["types"]["UrlVariablesOutput"];
      }) => Promise<ResponseType<T["POST"]["types"]["ResponseOutput"]>>
    : T extends { PUT: CreateApiEndpointAny }
      ? (params: {
          requestData: T["PUT"]["types"]["RequestOutput"];
          urlPathParams?: T["PUT"]["types"]["UrlVariablesOutput"];
        }) => Promise<ResponseType<T["PUT"]["types"]["ResponseOutput"]>>
      : T extends { PATCH: CreateApiEndpointAny }
        ? (params: {
            requestData: T["PATCH"]["types"]["RequestOutput"];
            urlPathParams?: T["PATCH"]["types"]["UrlVariablesOutput"];
          }) => Promise<ResponseType<T["PATCH"]["types"]["ResponseOutput"]>>
        : undefined;

  /** Callback for PATCH/update operations */
  update?: T extends { PATCH: CreateApiEndpointAny }
    ? (params: {
        requestData: T["PATCH"]["types"]["RequestOutput"];
        urlPathParams?: T["PATCH"]["types"]["UrlVariablesOutput"];
      }) => Promise<ResponseType<T["PATCH"]["types"]["ResponseOutput"]>>
    : undefined;

  /** Callback for DELETE operations */
  delete?: T extends { DELETE: CreateApiEndpointAny }
    ? (params: {
        requestData?: T["DELETE"]["types"]["RequestOutput"];
        urlPathParams?: T["DELETE"]["types"]["UrlVariablesOutput"];
      }) => Promise<ResponseType<T["DELETE"]["types"]["ResponseOutput"]>>
    : undefined;
}
