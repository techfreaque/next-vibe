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

import type {
  ExtractInput,
  ExtractOutput,
  FieldUsage,
  InferSchemaFromField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";

import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
  InferApiFormReturn,
  InferApiQueryReturn,
  SubmitFormFunction,
} from "../types";

// Type helpers for extracting endpoint types
export type ExtractEndpointTypes<T> =
  T extends CreateApiEndpoint<
    infer TExampleKey,
    infer TMethod,
    infer TUserRoleValue,
    infer TFields
  >
    ? {
        request: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        >;
        response: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.Response>
        >;
        urlVariables: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >;
        exampleKey: TExampleKey;
        method: TMethod;
        userRoleValue: TUserRoleValue;
        fields: TFields;
        requestInput: ExtractInput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        >;
        requestOutput: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        >;
        responseInput: ExtractInput<
          InferSchemaFromField<TFields, FieldUsage.Response>
        >;
        responseOutput: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.Response>
        >;
        urlVariablesInput: ExtractInput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >;
        urlVariablesOutput: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >;
      }
    : never;

// Extract types from endpoints map
export type GetEndpointTypes<T> = T extends { GET: infer TGet }
  ? ExtractEndpointTypes<TGet>
  : never;

export type PostEndpointTypes<T> = T extends { POST: infer TPost }
  ? ExtractEndpointTypes<TPost>
  : never;

export type PutEndpointTypes<T> = T extends { PUT: infer TPut }
  ? ExtractEndpointTypes<TPut>
  : never;

export type PatchEndpointTypes<T> = T extends { PATCH: infer TPatch }
  ? ExtractEndpointTypes<TPatch>
  : never;

export type DeleteEndpointTypes<T> = T extends { DELETE: infer TDelete }
  ? ExtractEndpointTypes<TDelete>
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

// Hook options interface with smart defaults and simple configuration
export interface UseEndpointOptions<T> {
  // URL parameters for endpoints that require them
  urlParams?: GetEndpointTypes<T> extends never
    ? undefined
    : GetEndpointTypes<T>["urlVariables"];

  // Query configuration
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;

  // Form configuration
  defaultValues?: PrimaryMutationTypes<T> extends never
    ? undefined
    : Partial<PrimaryMutationTypes<T>["request"]>;

  // Filtering options (for LIST_FILTER endpoints)
  filterOptions?: {
    initialFilters?: GetEndpointTypes<T> extends never
      ? undefined
      : Partial<GetEndpointTypes<T>["request"]>;
  };

  /**
   * Whether to automatically prefill the create form with data from the read operation
   * @default true
   */
  autoPrefill?: boolean;

  // Legacy nested options (for backward compatibility)
  /** @deprecated Use top-level options instead */
  queryOptions?: {
    enabled?: boolean;
    requestData?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["request"];
    urlParams?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["urlVariables"];
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };

  /** @deprecated Use top-level defaultValues instead */
  formOptions?: {
    defaultValues?: PrimaryMutationTypes<T> extends never
      ? undefined
      : Partial<PrimaryMutationTypes<T>["request"]>;
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
          ZodType<
            GetEndpointTypes<T>["request"],
            ZodTypeDef,
            GetEndpointTypes<T>["request"]
          >
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
          GetEndpointTypes<T>["urlVariables"]
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
  DELETE: CreateApiEndpoint<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer _TExampleKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer _TMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer _TUserRoleValue,
    infer TFields
  >;
}
  ? {
      /** The complete response including success/error state */
      response:
        | ResponseType<
            ExtractOutput<InferSchemaFromField<TFields, FieldUsage.Response>>
          >
        | undefined;

      // Backward compatibility properties
      /** @deprecated Use response?.success === true instead */
      isSuccess: boolean;
      /** @deprecated Use response?.success === false ? response : null instead */
      error: ErrorResponseType | null;

      submit: (
        data?: ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        >,
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
          ZodType<
            GetEndpointTypes<T>["request"],
            ZodTypeDef,
            GetEndpointTypes<T>["request"]
          >
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
          GetEndpointTypes<T>["urlVariables"]
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
        onSubmit: (e: FormEvent | undefined) => Promise<void>;
        reset: () => void;
        isSubmitting: boolean;
        isDirty: boolean;
        submitForm: SubmitFormFunction<
          PrimaryMutationTypes<T>["request"],
          PrimaryMutationTypes<T>["response"],
          PrimaryMutationTypes<T>["urlVariables"]
        >;
        clearSavedForm: () => void;
        /** @deprecated Use response property instead */
        setErrorType: (error: ErrorResponseType | null) => void;
      };

  delete: T extends {
    DELETE: CreateApiEndpoint<
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      infer _TExampleKey,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      infer _TMethod,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      infer _TUserRoleValue,
      infer TFields
    >;
  }
    ? {
        /** The complete response including success/error state */
        response:
          | ResponseType<
              ExtractOutput<InferSchemaFromField<TFields, FieldUsage.Response>>
            >
          | undefined;

        // Backward compatibility properties
        /** @deprecated Use response?.success === true instead */
        isSuccess: boolean;
        /** @deprecated Use response?.success === false ? response : null instead */
        error: ErrorResponseType | null;

        submit: (
          data?: ExtractOutput<
            InferSchemaFromField<TFields, FieldUsage.RequestData>
          >,
        ) => Promise<void>;
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
    PrimaryMutationTypes<T> extends never
      ? never
      : PrimaryMutationTypes<T>["request"]
  >;
  mutationOptions?: ApiMutationOptions<
    PrimaryMutationTypes<T> extends never
      ? never
      : PrimaryMutationTypes<T>["request"],
    PrimaryMutationTypes<T> extends never
      ? never
      : PrimaryMutationTypes<T>["response"],
    PrimaryMutationTypes<T> extends never
      ? never
      : PrimaryMutationTypes<T>["urlVariables"]
  >;
  urlParams?: PrimaryMutationTypes<T> extends never
    ? undefined
    : PrimaryMutationTypes<T>["urlVariables"];
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
    GetEndpointTypes<T> extends never
      ? never
      : GetEndpointTypes<T>["urlVariables"]
  >;
  urlVariables: GetEndpointTypes<T> extends never
    ? undefined
    : GetEndpointTypes<T>["urlVariables"];
}

export interface UseEndpointDeleteOptions<T> {
  mutationOptions?: ApiMutationOptions<
    DeleteEndpointTypes<T> extends never
      ? never
      : DeleteEndpointTypes<T>["request"],
    DeleteEndpointTypes<T> extends never
      ? never
      : DeleteEndpointTypes<T>["response"],
    DeleteEndpointTypes<T> extends never
      ? never
      : DeleteEndpointTypes<T>["urlVariables"]
  >;
  urlParams?: DeleteEndpointTypes<T> extends never
    ? undefined
    : DeleteEndpointTypes<T>["urlVariables"];
}

// Re-export the Infer types and hooks for easier access
export type { InferApiFormReturn, InferApiQueryReturn, SubmitFormFunction };

// Re-export InferEnhancedMutationResult from main types
export type { InferEnhancedMutationResult } from "../types";

// Re-export hooks from their respective modules
export { useApiForm } from "../mutation-form";
export { useApiQuery } from "../query";
export { useTranslation } from "@/i18n/core/client";
