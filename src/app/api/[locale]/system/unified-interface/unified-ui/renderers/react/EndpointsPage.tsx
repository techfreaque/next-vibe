/**
 * EndpointsPage Component
 * Wrapper component that handles endpoint logic, rendering, and UI layout
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils/utils";
import type {
  OptionsOptional,
  UseEndpointOptions,
  UseEndpointOptionsBase,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import type { ApiMutationOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  NavigationStackProvider,
  useNavigationStack,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { NavigationStackEntry } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useLogger } from "@/hooks/use-logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { EndpointRenderer, type SubmitButtonConfig } from "./EndpointRenderer";

/**
 * Extracts mutation options from an endpoint, stripping onSuccess
 * (navigation stack handles its own onSuccess logic).
 * Returns ApiMutationOptions<unknown, unknown, unknown> to avoid type narrowing issues
 * when accessing options through the erased CreateApiEndpointAny generic.
 */
function extractMutationOptions(
  endpoint: CreateApiEndpointAny,
): ApiMutationOptions<WidgetData, WidgetData, WidgetData> | undefined {
  const opts = endpoint.options?.mutationOptions as
    | ApiMutationOptions<WidgetData, WidgetData, WidgetData>
    | undefined;
  if (!opts) {
    return undefined;
  }
  const { onError, invalidateQueries } = opts;
  if (!onError && !invalidateQueries) {
    return undefined;
  }
  return { onError, invalidateQueries };
}

interface EndpointsPagePropsBase<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> {
  /** Endpoint definitions (supports GET, POST, PUT, PATCH, DELETE) */
  endpoint: T;
  /**
   * Optional pre-created endpoint instance from a parent's useEndpoint call.
   * When provided, EndpointsPage skips its own useEndpoint call and uses this
   * instance instead - the parent owns the query key, data, and side effects.
   * useEndpoint is still called internally (no conditional hooks) but its result
   * is discarded in favour of this instance.
   */
  endpointInstance?: ReturnType<typeof useEndpoint>;
  /** Locale for translations */
  locale: CountryLanguage;
  /** Optional description to show above the endpoint (usually not needed - comes from endpoint.description) */
  description?: string;
  /** Submit button configuration (backward compatibility - prefer using endpoint definition) */
  submitButton?: SubmitButtonConfig<string>;
  /** Enable debug logging (if not provided, reads from endpoint.debug) */
  debug?: boolean;
  /** Custom className for outer wrapper */
  className?: string;
  /** User object for permission checks */
  user: JwtPayloadType;
  /** Internal: Disable finalNavigation stack rendering (used for stacked instances) */
  _disableNavigationStack?: boolean;
  /** Force which endpoint method to render when multiple are present (e.g., both GET and PATCH) */
  forceMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Optional finalNavigation overrides (e.g., to override pop behavior in modals) */
  navigationOverride?: Partial<ReturnType<typeof useNavigationStack>>;
  /**
   * When true, renders the endpoint fields in read-only display mode.
   * No form submission, no network calls.
   */
  disabled?: boolean;
  /**
   * When true, renders only response fields (for CLI/MCP result-formatter mode).
   * Passed through to EndpointRenderer.
   */
  responseOnly?: boolean;
  /**
   * Platform override. When provided, passed to EndpointRenderer.
   */
  platform?: Platform;
  /**
   * Logger override. When provided, used instead of useLogger() context.
   * Required for CLI/MCP contexts that don't have LoggerProvider.
   */
  logger?: EndpointLogger;
}

/**
 * Props for EndpointsPage component.
 * `endpointOptions` is required when the endpoint has URL path params or cache-key fields;
 * optional (and may be omitted) when nothing is required.
 */
export type EndpointsPageProps<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> = EndpointsPagePropsBase<T> & {
  [K in "endpointOptions" as OptionsOptional<T> extends true
    ? never
    : K]: UseEndpointOptions<T>;
} & {
  [K in "endpointOptions" as OptionsOptional<T> extends true
    ? K
    : never]?: UseEndpointOptions<T>;
};

/**
 * Internal EndpointsPage Component (wrapped by provider)
 *
 * A complete page wrapper that handles:
 * - Endpoint hook logic (useEndpoint)
 * - Card layout with header and content
 * - Title with optional counts
 * - Submit button in header (if configured)
 * - EndpointRenderer for form and response display
 */
// Internal props type - erases the conditional endpointOptions requirement for use inside the component
type EndpointsPagePropsInternal<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> = EndpointsPagePropsBase<T> & {
  endpointOptions?: UseEndpointOptionsBase<T>;
  endpointInstance?: ReturnType<typeof useEndpoint>;
};

function EndpointsPageInternal<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>({
  endpoint,
  locale,
  description,
  endpointOptions,
  endpointInstance: providedEndpointInstance,
  submitButton,
  debug,
  className,
  user,
  _disableNavigationStack = false,
  forceMethod,
  navigationOverride,
  disabled,
  responseOnly,
  platform,
}: EndpointsPagePropsInternal<T>): React.JSX.Element {
  // Check finalNavigation stack to render stacked endpoints (only for base layer)
  const navigation = useNavigationStack();

  // Extract stable Zustand refs directly - these are stable function/array references
  // that only change when the store actually changes (push/pop), not on every render.
  const navigationPop = navigation.pop;
  const navigationReplace = navigation.replace;
  const navigationStack = navigation.stack;

  // Apply navigationOverride if provided.
  // IMPORTANT: navigation is a new plain object every render (useNavigationStack returns
  // { push, replace, pop, stack, canGoBack, current } inline). We must NOT put `navigation`
  // in the dep array or the body - use only the stable extracted refs so the memoized
  // object reference stays stable across renders when nothing actually changed.
  const navigationPush = navigation.push;
  const navigationCanGoBack = navigation.canGoBack;
  const navigationCurrent = navigation.current;
  const finalNavigation = useMemo(() => {
    const base = {
      push: navigationPush,
      replace: navigationReplace,
      pop: navigationPop,
      stack: navigationStack,
      canGoBack: navigationCanGoBack,
      current: navigationCurrent,
    };
    return navigationOverride ? { ...base, ...navigationOverride } : base;
  }, [
    navigationOverride,
    navigationStack,
    navigationPush,
    navigationReplace,
    navigationPop,
    navigationCanGoBack,
    navigationCurrent,
  ]);
  // Determine which endpoint to use for base layer
  // If forceMethod is provided, use that; otherwise use default priority
  const forcedEndpoint = forceMethod ? endpoint[forceMethod] : undefined;

  const isGetEndpoint = forcedEndpoint ? forceMethod === "GET" : !!endpoint.GET;
  const isMutationEndpoint = forcedEndpoint
    ? forceMethod === "POST" || forceMethod === "PUT" || forceMethod === "PATCH"
    : !!(endpoint.POST ?? endpoint.PUT ?? endpoint.PATCH) && !endpoint.GET;
  const isDeleteEndpoint = forcedEndpoint
    ? forceMethod === "DELETE"
    : !!endpoint.DELETE &&
      !endpoint.GET &&
      !endpoint.POST &&
      !endpoint.PUT &&
      !endpoint.PATCH;

  // Get the active endpoint definition for rendering response data
  // Priority: Forced method > GET (for response rendering) > POST/PUT/PATCH (for form) > DELETE
  const activeEndpoint =
    forcedEndpoint ??
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Read configuration from endpoint definition with fallbacks
  // useLoggerOptional returns null when LoggerProvider is absent (CLI/MCP context)
  // In that case loggerProp must be supplied
  const logger = useLogger();

  // Build mutation options with onSuccess callback for finalNavigation
  const mutationOptionsWithNav = useMemo(() => {
    // Only work with caller's options - don't merge with endpoint options here
    // (useEndpointCreate will do that merge)
    const callerMutationOptions = endpointOptions?.create?.mutationOptions;

    // For POST/PUT endpoints, wrap to add navigation AFTER onSuccess
    if (isMutationEndpoint && (endpoint.POST ?? endpoint.PUT)) {
      const callerOnSuccess = callerMutationOptions?.onSuccess as
        | ApiMutationOptions<WidgetData, WidgetData, WidgetData>["onSuccess"]
        | undefined;

      return {
        ...callerMutationOptions,
        onSuccess: async ({
          responseData,
          requestData,
          pathParams,
          logger: callLogger,
          user: callUser,
          locale: callLocale,
        }: Parameters<
          NonNullable<
            ApiMutationOptions<WidgetData, WidgetData, WidgetData>["onSuccess"]
          >
        >[0]): Promise<void | ErrorResponseType> => {
          // Call caller's onSuccess if it exists
          const result = await callerOnSuccess?.({
            responseData,
            requestData,
            pathParams,
            logger: callLogger,
            user: callUser,
            locale: callLocale,
          });

          if (result) {
            return result;
          }

          // Handle navigation pop or replace
          const currentEntry = navigationStack[navigationStack.length - 1];
          const popCount = currentEntry?.popNavigationOnSuccess;
          const replaceConfig = currentEntry?.replaceOnSuccess;
          const successCallback = currentEntry?.onSuccessCallback;

          if (replaceConfig) {
            const urlPathParams = replaceConfig.getUrlPathParams
              ? replaceConfig.getUrlPathParams(responseData)
              : undefined;
            navigationReplace(replaceConfig.endpoint, {
              urlPathParams,
              prefillFromGet: replaceConfig.prefillFromGet,
              getEndpoint: replaceConfig.prefillFromGet
                ? replaceConfig.getEndpoint
                : undefined,
            });
          } else if (popCount && popCount > 0) {
            for (let i = 0; i < popCount; i++) {
              navigationPop();
            }
            successCallback?.();
          }
        },
      };
    }

    return callerMutationOptions;
  }, [
    isMutationEndpoint,
    endpoint.POST,
    endpoint.PUT,
    endpointOptions?.create?.mutationOptions,
    navigationPop,
    navigationReplace,
    navigationStack,
  ]);

  // Create wrapped PATCH mutation options with finalNavigation handling
  const patchMutationOptionsWithNav = useMemo(() => {
    const patchEndpoint = endpoint.PATCH;
    const existingPatchOptions = endpointOptions?.update?.mutationOptions as
      | ApiMutationOptions<WidgetData, WidgetData, WidgetData>
      | undefined;

    if (!patchEndpoint) {
      return existingPatchOptions;
    }

    return {
      ...existingPatchOptions,
      onSuccess: async ({
        responseData,
        requestData,
        pathParams,
        logger: callLogger,
        user: callUser,
        locale: callLocale,
      }: Parameters<
        NonNullable<
          ApiMutationOptions<WidgetData, WidgetData, WidgetData>["onSuccess"]
        >
      >[0]): Promise<void | ErrorResponseType> => {
        // Call existing onSuccess first
        if (existingPatchOptions?.onSuccess) {
          const result = await existingPatchOptions.onSuccess({
            responseData,
            requestData,
            pathParams,
            logger: callLogger,
            user: callUser,
            locale: callLocale,
          });
          if (result) {
            return result;
          }
        }

        // Handle popNavigationOnSuccess or replaceOnSuccess from finalNavigation entry
        const currentEntry = navigationStack[navigationStack.length - 1];
        const popCount = currentEntry?.popNavigationOnSuccess;
        const replaceConfig = currentEntry?.replaceOnSuccess;
        const successCallback = currentEntry?.onSuccessCallback;

        if (replaceConfig) {
          const urlPathParams = replaceConfig.getUrlPathParams
            ? replaceConfig.getUrlPathParams(responseData)
            : undefined;
          navigationReplace(replaceConfig.endpoint, {
            urlPathParams,
            prefillFromGet: replaceConfig.prefillFromGet,
            getEndpoint: replaceConfig.prefillFromGet
              ? replaceConfig.getEndpoint
              : undefined,
          });
        } else if (popCount && popCount > 0) {
          for (let i = 0; i < popCount; i++) {
            navigationPop();
          }
          successCallback?.();
        }
      },
    };
  }, [
    endpoint.PATCH,
    endpointOptions?.update?.mutationOptions,
    navigationPop,
    navigationReplace,
    navigationStack,
  ]);

  // Create wrapped DELETE mutation options with finalNavigation handling
  const deleteMutationOptionsWithNav = useMemo(() => {
    const deleteEndpoint = endpoint.DELETE;
    const existingDeleteOptions = endpointOptions?.delete?.mutationOptions as
      | ApiMutationOptions<WidgetData, WidgetData, WidgetData>
      | undefined;

    if (!deleteEndpoint) {
      return existingDeleteOptions;
    }

    return {
      ...existingDeleteOptions,
      onSuccess: async ({
        responseData,
        requestData,
        pathParams,
        logger: callLogger,
        user: callUser,
        locale: callLocale,
      }: Parameters<
        NonNullable<
          ApiMutationOptions<WidgetData, WidgetData, WidgetData>["onSuccess"]
        >
      >[0]): Promise<void | ErrorResponseType> => {
        // Call existing onSuccess first
        if (existingDeleteOptions?.onSuccess) {
          const result = await existingDeleteOptions.onSuccess({
            responseData,
            requestData,
            pathParams,
            logger: callLogger,
            user: callUser,
            locale: callLocale,
          });
          if (result) {
            return result;
          }
        }

        // Handle popNavigationOnSuccess or replaceOnSuccess from finalNavigation entry
        const currentEntry = navigationStack[navigationStack.length - 1];
        const popCount = currentEntry?.popNavigationOnSuccess;
        const replaceConfig = currentEntry?.replaceOnSuccess;
        const successCallback = currentEntry?.onSuccessCallback;

        if (replaceConfig) {
          const urlPathParams = replaceConfig.getUrlPathParams
            ? replaceConfig.getUrlPathParams(responseData)
            : undefined;
          navigationReplace(replaceConfig.endpoint, {
            urlPathParams,
            prefillFromGet: replaceConfig.prefillFromGet,
            getEndpoint: replaceConfig.prefillFromGet
              ? replaceConfig.getEndpoint
              : undefined,
          });
        } else if (popCount && popCount > 0) {
          for (let i = 0; i < popCount; i++) {
            navigationPop();
          }
          successCallback?.();
        }
      },
    };
  }, [
    endpoint.DELETE,
    endpointOptions?.delete?.mutationOptions,
    navigationPop,
    navigationReplace,
    navigationStack,
  ]);

  // Merge finalNavigation-aware mutation options and endpoint's built-in options.
  // Auto-enable subscribeToEvents when the GET endpoint declares events.
  const finalEndpointOptions = useMemo((): UseEndpointOptionsBase<T> => {
    const getEndpointDef = endpoint.GET;
    const hasEvents =
      getEndpointDef &&
      "events" in getEndpointDef &&
      getEndpointDef.events &&
      Object.keys(getEndpointDef.events).length > 0;

    const baseOptions: UseEndpointOptionsBase<T> = {
      ...endpointOptions,
      ...(hasEvents && !endpointOptions?.subscribeToEvents
        ? { subscribeToEvents: true }
        : {}),
    };

    if (
      !mutationOptionsWithNav &&
      !patchMutationOptionsWithNav &&
      !deleteMutationOptionsWithNav
    ) {
      return baseOptions;
    }

    const result: UseEndpointOptionsBase<T> = { ...baseOptions };

    if (mutationOptionsWithNav) {
      result.create = {
        ...endpointOptions?.create,
        ...baseOptions.create,
        mutationOptions: mutationOptionsWithNav,
      } as typeof result.create;
    }

    if (patchMutationOptionsWithNav) {
      result.update = {
        ...endpointOptions?.update,
        ...baseOptions.update,
        mutationOptions: patchMutationOptionsWithNav,
      } as typeof result.update;
    }

    if (deleteMutationOptionsWithNav) {
      result.delete = {
        ...endpointOptions?.delete,
        ...baseOptions.delete,
        mutationOptions: deleteMutationOptionsWithNav,
      } as typeof result.delete;
    }

    return result;
  }, [
    endpoint.GET,
    endpointOptions,
    mutationOptionsWithNav,
    patchMutationOptionsWithNav,
    deleteMutationOptionsWithNav,
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks -- intentional: endpointInstance is always
  // the same reference type at a given call site (static composition), never switches at runtime.
  const endpointState = (providedEndpointInstance ??
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEndpoint(
      endpoint,
      finalEndpointOptions as UseEndpointOptions<T>,
      logger,
      user,
    )) as ReturnType<typeof useEndpoint>;

  // Extract response and data based on endpoint type
  let response;
  let responseData: WidgetData | undefined;
  let isLoading = false;

  if (isGetEndpoint && endpointState.read) {
    const read = endpointState.read;
    response = read.response;
    responseData =
      read.response?.success === true ? read.response.data : undefined;
    isLoading = read.isLoading;
  } else if (
    isMutationEndpoint &&
    (endpointState.create || endpointState.update)
  ) {
    const operation = endpointState.update ?? endpointState.create;
    if (operation) {
      response = operation.response;
      responseData =
        operation.response?.success === true
          ? operation.response.data
          : undefined;
      isLoading = operation.isSubmitting;
    }

    // CRITICAL: For mutations with prefillFromGet (GET + PATCH/PUT), use GET data for prefilling
    // The mutation response data is for showing success/error, not for prefilling the form
    if (endpointState.read) {
      const readResponse = endpointState.read.response;
      const readData =
        readResponse?.success === true ? readResponse.data : undefined;
      if (readData) {
        responseData = readData;
        // CRITICAL: Also set response to the GET response so widgets have access to it in context
        response = readResponse;
      }
    }
  } else if (isDeleteEndpoint && endpointState.delete) {
    const deleteOp = endpointState.delete;
    response = deleteOp.response;
    responseData =
      deleteOp.response?.success === true ? deleteOp.response.data : undefined;
    isLoading = deleteOp.isSubmitting;
  }

  // Build endpoint mutations for context - widgets can call these directly
  const endpointMutations = {
    create: endpointState.create
      ? {
          submit: async (): Promise<void> => {
            await endpointState.create?.onSubmit();
          },
          isSubmitting: endpointState.create.isSubmitting,
        }
      : undefined,
    update: endpointState.update
      ? {
          submit: async (data: Record<string, WidgetData>): Promise<void> => {
            await endpointState.update?.submit(data as never);
            if (endpointState.read) {
              await endpointState.read.refetch();
            }
          },
          isSubmitting: endpointState.update.isSubmitting,
        }
      : undefined,
    delete: endpointState.delete
      ? {
          submit: async (): Promise<void> => {
            await endpointState.delete?.submit();
            if (endpointState.read) {
              await endpointState.read.refetch();
            }
          },
          isSubmitting: endpointState.delete.isSubmitting,
        }
      : undefined,
    read: endpointState.read
      ? {
          refetch: async (): Promise<void> => {
            await endpointState.read?.refetch();
          },
          isLoading: endpointState.read.isLoading,
          isLoadingFresh: endpointState.read.isLoadingFresh,
          isFetching: endpointState.read.isFetching,
        }
      : undefined,
  };

  // Modal state tracking
  const [modalOpenState, setModalOpenState] = useState<Record<number, boolean>>(
    {},
  );

  // Check if top entry is a modal
  const topEntry = finalNavigation.stack[finalNavigation.stack.length - 1];
  const topIsModal = topEntry?.renderInModal ?? false;

  // Base layer is visible only when:
  // - Disabled (read-only display mode), OR
  // - Stack is disabled, OR
  // - Stack is empty, OR
  // - Stack has ONLY a modal (base is the background for that modal)
  const isBaseVisible =
    disabled ||
    _disableNavigationStack ||
    finalNavigation.stack.length === 0 ||
    (finalNavigation.stack.length === 1 && topIsModal);

  return (
    <>
      {/* Base endpoint layer - always mounted to preserve state */}
      <Div className={cn(className, !isBaseVisible && "hidden")}>
        {description && (
          <Div className="mb-6">
            <P className="text-gray-600 dark:text-gray-400">{description}</P>
          </Div>
        )}

        {activeEndpoint && (
          <>
            {disabled && (
              <EndpointRenderer
                endpoint={activeEndpoint}
                locale={locale}
                isSubmitting={false}
                data={responseData}
                className={className}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
                user={user}
                disabled={true}
                responseOnly={responseOnly}
                platform={platform}
              />
            )}
            {!disabled && isGetEndpoint && endpointState.read && (
              <EndpointRenderer
                endpoint={activeEndpoint}
                form={endpointState.create?.form ?? endpointState.read.form}
                onSubmit={
                  endpointState.create
                    ? (): void => {
                        void endpointState.create?.onSubmit();
                      }
                    : (): void => {
                        void endpointState.read?.submitForm();
                      }
                }
                locale={locale}
                isSubmitting={endpointState.create?.isSubmitting ?? isLoading}
                data={responseData}
                className={className}
                submitButton={submitButton}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
                user={user}
                responseOnly={responseOnly}
                platform={platform}
              />
            )}
            {!disabled &&
              isMutationEndpoint &&
              (endpointState.create || endpointState.update) && (
                <EndpointRenderer
                  endpoint={activeEndpoint}
                  form={
                    endpointState.update?.form ?? endpointState.create?.form
                  }
                  onSubmit={(): void => {
                    if (endpointState.update) {
                      void endpointState.update.submit(
                        endpointState.update.form.getValues(),
                      );
                    } else {
                      void endpointState.create?.onSubmit();
                    }
                  }}
                  locale={locale}
                  isSubmitting={endpointState.update?.isSubmitting ?? isLoading}
                  data={responseData}
                  submitButton={submitButton}
                  response={response}
                  endpointMutations={endpointMutations}
                  logger={logger}
                  user={user}
                  responseOnly={responseOnly}
                  platform={platform}
                />
              )}
            {!disabled && isDeleteEndpoint && endpointState.delete && (
              <EndpointRenderer
                endpoint={activeEndpoint}
                form={endpointState.delete.form}
                onSubmit={(): void => {
                  void endpointState.delete?.submitForm();
                }}
                locale={locale}
                isSubmitting={isLoading}
                data={responseData}
                submitButton={submitButton}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
                user={user}
                responseOnly={responseOnly}
                platform={platform}
              />
            )}
          </>
        )}
      </Div>

      {/* Stacked endpoint layers - each mounted to preserve state */}
      {/* Only render finalNavigation stack for base layer (not for stacked instances, not for disabled) */}
      {!disabled &&
        !_disableNavigationStack &&
        finalNavigation.stack.map((entry, index) => (
          <StackEntryLayer
            key={`nav-${entry.timestamp}-${index}`}
            entry={entry}
            index={index}
            className={className}
            submitButton={submitButton}
            debug={debug}
            user={user}
            locale={locale}
            modalOpenState={modalOpenState}
            setModalOpenState={setModalOpenState}
            finalNavigation={finalNavigation}
          />
        ))}
    </>
  );
}

/**
 * EndpointsPageInternal wrapped with NavigationStackProvider
 * This is the main export that should be used
 */
export function EndpointsPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>(props: EndpointsPageProps<T>): React.JSX.Element {
  const internalProps = props as EndpointsPagePropsInternal<T>;
  return (
    <NavigationStackProvider>
      <EndpointsPageInternal {...internalProps} />
    </NavigationStackProvider>
  );
}

EndpointsPage.displayName = "EndpointsPage";

/**
 * Helper component to render content either as a hidden div or in a popover modal
 */
function StackEntryRenderer({
  entry,
  isModal,
  isVisible,
  className,
  children,
  modalOpenState,
  setModalOpenState,
  finalNavigation,
}: {
  entry: NavigationStackEntry;
  isModal: boolean;
  isVisible: boolean;
  className?: string;
  children: React.ReactNode;
  modalOpenState: Record<number, boolean>;
  setModalOpenState: (
    state:
      | Record<number, boolean>
      | ((prev: Record<number, boolean>) => Record<number, boolean>),
  ) => void;
  finalNavigation: ReturnType<typeof useNavigationStack>;
}): React.JSX.Element {
  const modalIsOpen = modalOpenState[entry.timestamp] ?? true;

  if (!isModal) {
    return (
      <Div
        key={`nav-${entry.timestamp}`}
        className={cn(className, !isVisible && "hidden")}
      >
        {children}
      </Div>
    );
  }

  return (
    <>
      {/* Modal as centered dialog */}
      {modalIsOpen && (
        <>
          {/* Backdrop - dims page and handles outside clicks */}
          <Div
            onClick={(e) => {
              e.preventDefault();
              setModalOpenState({
                ...modalOpenState,
                [entry.timestamp]: false,
              });
              finalNavigation.pop();
            }}
            className="fixed inset-0 z-[100] bg-black/50"
            aria-hidden="true"
          />
          {/* Modal content container */}
          <Div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
            <Div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="relative bg-background border shadow-lg rounded-lg overflow-y-auto w-[400px] max-w-[90vw] max-h-[min(600px,calc(100dvh-100px))] pointer-events-auto"
            >
              {children}
            </Div>
          </Div>
        </>
      )}
    </>
  );
}

/**
 * Component to render a single finalNavigation stack entry
 * Handles hook calls at proper component level (not inside map)
 */
function StackEntryLayer({
  entry,
  index,
  className,
  submitButton,
  debug,
  user,
  locale,
  modalOpenState,
  setModalOpenState,
  finalNavigation,
}: {
  entry: NavigationStackEntry;
  index: number;
  className?: string;
  submitButton?: SubmitButtonConfig<string>;
  debug?: boolean;
  user: JwtPayloadType;
  locale: CountryLanguage;
  modalOpenState: Record<number, boolean>;
  setModalOpenState: (
    state:
      | Record<number, boolean>
      | ((prev: Record<number, boolean>) => Record<number, boolean>),
  ) => void;
  finalNavigation: ReturnType<typeof useNavigationStack>;
}): React.JSX.Element | null {
  const isTopEntry = index === finalNavigation.stack.length - 1;
  const topEntry = finalNavigation.stack[finalNavigation.stack.length - 1];
  const isBackgroundOfModal =
    index === finalNavigation.stack.length - 2 &&
    (topEntry?.renderInModal ?? false);

  // Show if: top entry OR background layer of a modal
  const isVisible = isTopEntry || isBackgroundOfModal;
  const isModal = isTopEntry && (entry.renderInModal ?? false);
  const method = entry.endpoint.method;

  // Hooks called at top level of this component (before any conditional returns)
  const navigationPop = finalNavigation.pop;
  const navigationOverride = useMemo(() => {
    if (isModal) {
      return {
        pop: (): void => {
          setModalOpenState(
            (prev: Record<number, boolean>): Record<number, boolean> => ({
              ...prev,
              [entry.timestamp]: false,
            }),
          );
          navigationPop();
        },
        canGoBack: true,
      };
    }
    // Non-modal: allow back navigation when there's a stack to go back to
    if (index > 0) {
      return {
        pop: (): void => {
          navigationPop();
        },
        canGoBack: true,
      };
    }
    return undefined;
  }, [isModal, index, entry.timestamp, navigationPop, setModalOpenState]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Render appropriate endpoint based on method
  if (method === "GET") {
    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          endpoint={{ GET: entry.endpoint }}
          locale={locale}
          endpointOptions={{
            read: {
              urlPathParams: entry.params.urlPathParams,
              initialState: entry.params.data,
            },
          }}
          submitButton={submitButton}
          debug={debug}
          user={user}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  if (method === "POST") {
    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          user={user}
          endpoint={{ POST: entry.endpoint }}
          locale={locale}
          endpointOptions={{
            create: {
              urlPathParams: entry.params.urlPathParams,
              autoPrefillData: entry.params.data,
              mutationOptions: extractMutationOptions(entry.endpoint),
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  if (method === "PATCH" && entry.prefillFromGet && entry.getEndpoint) {
    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          user={user}
          endpoint={{ GET: entry.getEndpoint, PATCH: entry.endpoint }}
          locale={locale}
          forceMethod={method}
          endpointOptions={{
            read: {
              urlPathParams: entry.params.urlPathParams as never,
            },
            update: {
              urlPathParams: entry.params.urlPathParams,
              autoPrefillData: entry.params.data,
              mutationOptions: extractMutationOptions(entry.endpoint),
              // When prefillFromGet provides data, also pass as initialState
              // so it takes priority over the GET response shape
              ...(entry.params.data ? { initialState: entry.params.data } : {}),
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  if (method === "PATCH") {
    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          user={user}
          endpoint={{ PATCH: entry.endpoint }}
          locale={locale}
          forceMethod={method}
          endpointOptions={{
            update: {
              urlPathParams: entry.params.urlPathParams,
              autoPrefillData: entry.params.data,
              mutationOptions: extractMutationOptions(entry.endpoint),
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  if (method === "DELETE") {
    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          user={user}
          endpoint={{ DELETE: entry.endpoint }}
          locale={locale}
          endpointOptions={{
            delete: {
              urlPathParams: entry.params.urlPathParams,
              autoPrefillData: {
                ...entry.params.urlPathParams,
                ...entry.params.data,
              },
              mutationOptions: {
                ...extractMutationOptions(entry.endpoint),
                onSuccess: async (ctx) => {
                  const base = extractMutationOptions(entry.endpoint);
                  if (base?.onSuccess) {
                    await base.onSuccess(ctx);
                  }
                  if (
                    entry.popNavigationOnSuccess &&
                    entry.popNavigationOnSuccess > 0
                  ) {
                    for (let i = 0; i < entry.popNavigationOnSuccess; i++) {
                      navigationOverride?.pop?.();
                    }
                  }
                },
              },
            },
          }}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  if (method === "PUT") {
    const endpointConfig =
      entry.prefillFromGet && entry.getEndpoint
        ? { GET: entry.getEndpoint, PUT: entry.endpoint }
        : { PUT: entry.endpoint };

    return (
      <StackEntryRenderer
        entry={entry}
        isModal={isModal}
        isVisible={isVisible}
        className={className}
        modalOpenState={modalOpenState}
        setModalOpenState={setModalOpenState}
        finalNavigation={finalNavigation}
      >
        <EndpointsPageInternal
          user={user}
          endpoint={endpointConfig}
          locale={locale}
          forceMethod={method}
          endpointOptions={{
            ...(entry.prefillFromGet
              ? {
                  read: {
                    urlPathParams: entry.params.urlPathParams as never,
                  },
                }
              : {}),
            create: {
              urlPathParams: entry.params.urlPathParams,
              autoPrefillData: entry.params.data,
              // When prefillFromGet provides data, also pass as initialState
              // so it takes priority over the GET response shape
              // (GET may nest data differently than the PUT form expects)
              ...(entry.prefillFromGet && entry.params.data
                ? { initialState: entry.params.data }
                : {}),
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={navigationOverride}
        />
      </StackEntryRenderer>
    );
  }

  return null;
}
