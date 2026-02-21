/**
 * EndpointsPage Component
 * Wrapper component that handles endpoint logic, rendering, and UI layout
 */

"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils/utils";
import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  NavigationStackProvider,
  useNavigationStack,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { NavigationStackEntry } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { EndpointRenderer, type SubmitButtonConfig } from "./EndpointRenderer";

/**
 * Props for EndpointsPage component
 */
export interface EndpointsPageProps<
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
  /** Locale for translations */
  locale: CountryLanguage;
  /** Optional description to show above the endpoint (usually not needed - comes from endpoint.description) */
  description?: string;
  /** Options for useEndpoint hook */
  endpointOptions?: UseEndpointOptions<T>;
  /** Submit button configuration (backward compatibility - prefer using endpoint definition) */
  submitButton?: SubmitButtonConfig;
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
}

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
  submitButton,
  debug,
  className,
  user,
  _disableNavigationStack = false,
  forceMethod,
  navigationOverride,
}: EndpointsPageProps<T>): React.JSX.Element {
  // Check finalNavigation stack to render stacked endpoints (only for base layer)
  const navigation = useNavigationStack();

  // Apply navigationOverride if provided
  const finalNavigation = useMemo(
    () =>
      navigationOverride
        ? { ...navigation, ...navigationOverride }
        : navigation,
    [navigation, navigationOverride],
  );
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
  const finalDebug = debug ?? activeEndpoint?.debug ?? false;
  const logger = useMemo(
    () => createEndpointLogger(finalDebug, Date.now(), locale),
    [finalDebug, locale],
  );

  // Build mutation options with onSuccess callback for finalNavigation
  const mutationOptionsWithNav = useMemo(() => {
    // Only work with caller's options - don't merge with endpoint options here
    // (useEndpointCreate will do that merge)
    const callerMutationOptions = endpointOptions?.create?.mutationOptions;

    // For POST endpoints, wrap to add navigation AFTER onSuccess
    if (isMutationEndpoint && endpoint.POST && finalNavigation) {
      const callerOnSuccess = callerMutationOptions?.onSuccess;

      return {
        ...callerMutationOptions,
        onSuccess: async ({
          responseData,
          requestData,
          pathParams,
          logger,
          user: callUser,
          locale: callLocale,
        }): Promise<void | ErrorResponseType> => {
          // Call caller's onSuccess if it exists
          const result = await callerOnSuccess?.({
            responseData,
            requestData,
            pathParams,
            logger,
            user: callUser,
            locale: callLocale,
          });

          if (result) {
            return result;
          }

          // Handle navigation pop or replace
          const currentEntry =
            finalNavigation.stack[finalNavigation.stack.length - 1];
          const popCount = currentEntry?.popNavigationOnSuccess;
          const replaceConfig = currentEntry?.replaceOnSuccess;

          if (replaceConfig) {
            const urlPathParams = replaceConfig.getUrlPathParams
              ? replaceConfig.getUrlPathParams(responseData)
              : undefined;
            finalNavigation.replace(replaceConfig.endpoint, {
              urlPathParams,
              prefillFromGet: replaceConfig.prefillFromGet,
              getEndpoint: replaceConfig.prefillFromGet
                ? replaceConfig.getEndpoint
                : undefined,
            });
          } else if (popCount && popCount > 0) {
            for (let i = 0; i < popCount; i++) {
              finalNavigation.pop();
            }
          }
        },
      };
    }

    return callerMutationOptions;
  }, [
    isMutationEndpoint,
    endpoint.POST,
    endpointOptions?.create?.mutationOptions,
    finalNavigation,
  ]);

  // Create wrapped PATCH mutation options with finalNavigation handling
  const patchMutationOptionsWithNav = useMemo(() => {
    const patchEndpoint = endpoint.PATCH;
    const existingPatchOptions = endpointOptions?.update?.mutationOptions;

    if (!patchEndpoint || !finalNavigation) {
      return existingPatchOptions;
    }

    return {
      ...existingPatchOptions,
      onSuccess: async ({
        responseData,
        requestData,
        pathParams,
        logger,
        user: callUser,
        locale: callLocale,
      }): Promise<void | ErrorResponseType> => {
        // Call existing onSuccess first
        if (existingPatchOptions?.onSuccess) {
          const result = await existingPatchOptions.onSuccess({
            responseData,
            requestData,
            pathParams,
            logger,
            user: callUser,
            locale: callLocale,
          });
          if (result) {
            return result;
          }
        }

        // Handle popNavigationOnSuccess or replaceOnSuccess from finalNavigation entry
        const currentEntry =
          finalNavigation.stack[finalNavigation.stack.length - 1];
        const popCount = currentEntry?.popNavigationOnSuccess;
        const replaceConfig = currentEntry?.replaceOnSuccess;

        if (replaceConfig) {
          const urlPathParams = replaceConfig.getUrlPathParams
            ? replaceConfig.getUrlPathParams(responseData)
            : undefined;
          finalNavigation.replace(replaceConfig.endpoint, {
            urlPathParams,
            prefillFromGet: replaceConfig.prefillFromGet,
            getEndpoint: replaceConfig.prefillFromGet
              ? replaceConfig.getEndpoint
              : undefined,
          });
        } else if (popCount && popCount > 0) {
          for (let i = 0; i < popCount; i++) {
            finalNavigation.pop();
          }
        }
      },
    };
  }, [
    endpoint.PATCH,
    endpointOptions?.update?.mutationOptions,
    finalNavigation,
  ]);

  // Create wrapped DELETE mutation options with finalNavigation handling
  const deleteMutationOptionsWithNav = useMemo(() => {
    const deleteEndpoint = endpoint.DELETE;
    const existingDeleteOptions = endpointOptions?.delete?.mutationOptions;

    if (!deleteEndpoint || !finalNavigation) {
      return existingDeleteOptions;
    }

    return {
      ...existingDeleteOptions,
      onSuccess: async ({
        responseData,
        requestData,
        pathParams,
        logger,
        user: callUser,
        locale: callLocale,
      }): Promise<void | ErrorResponseType> => {
        // Call existing onSuccess first
        if (existingDeleteOptions?.onSuccess) {
          const result = await existingDeleteOptions.onSuccess({
            responseData,
            requestData,
            pathParams,
            logger,
            user: callUser,
            locale: callLocale,
          });
          if (result) {
            return result;
          }
        }

        // Handle popNavigationOnSuccess or replaceOnSuccess from finalNavigation entry
        const currentEntry =
          finalNavigation.stack[finalNavigation.stack.length - 1];
        const popCount = currentEntry?.popNavigationOnSuccess;
        const replaceConfig = currentEntry?.replaceOnSuccess;

        if (replaceConfig) {
          const urlPathParams = replaceConfig.getUrlPathParams
            ? replaceConfig.getUrlPathParams(responseData)
            : undefined;
          finalNavigation.replace(replaceConfig.endpoint, {
            urlPathParams,
            prefillFromGet: replaceConfig.prefillFromGet,
            getEndpoint: replaceConfig.prefillFromGet
              ? replaceConfig.getEndpoint
              : undefined,
          });
        } else if (popCount && popCount > 0) {
          for (let i = 0; i < popCount; i++) {
            finalNavigation.pop();
          }
        }
      },
    };
  }, [
    endpoint.DELETE,
    endpointOptions?.delete?.mutationOptions,
    finalNavigation,
  ]);

  // Merge finalNavigation-aware mutation options and endpoint's built-in options
  const finalEndpointOptions = useMemo((): UseEndpointOptions<T> => {
    const baseOptions = {
      ...endpointOptions,
      user,
    };

    if (
      !mutationOptionsWithNav &&
      !patchMutationOptionsWithNav &&
      !deleteMutationOptionsWithNav
    ) {
      return baseOptions;
    }

    const result: UseEndpointOptions<T> = { ...baseOptions };

    if (mutationOptionsWithNav) {
      result.create = {
        ...endpointOptions?.create,
        ...baseOptions.create,
        mutationOptions: mutationOptionsWithNav,
      };
    }

    if (patchMutationOptionsWithNav) {
      result.update = {
        ...endpointOptions?.update,
        ...baseOptions.update,
        mutationOptions: patchMutationOptionsWithNav,
      };
    }

    if (deleteMutationOptionsWithNav) {
      result.delete = {
        ...endpointOptions?.delete,
        ...baseOptions.delete,
        mutationOptions: deleteMutationOptionsWithNav,
      };
    }

    return result;
  }, [
    endpointOptions,
    mutationOptionsWithNav,
    patchMutationOptionsWithNav,
    deleteMutationOptionsWithNav,
    user,
  ]);

  // Use the endpoint hook for base endpoint
  const endpointState = useEndpoint(
    endpoint,
    finalEndpointOptions,
    logger,
    user,
  );

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
  // - Stack is disabled, OR
  // - Stack is empty, OR
  // - Stack has ONLY a modal (base is the background for that modal)
  const isBaseVisible =
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
            {isGetEndpoint && endpointState.read && (
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
                submitButton={submitButton}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
                user={user}
              />
            )}
            {isMutationEndpoint &&
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
                />
              )}
            {isDeleteEndpoint && endpointState.delete && (
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
              />
            )}
          </>
        )}
      </Div>

      {/* Stacked endpoint layers - each mounted to preserve state */}
      {/* Only render finalNavigation stack for base layer (not for stacked instances) */}
      {!_disableNavigationStack &&
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
  return (
    <NavigationStackProvider>
      <EndpointsPageInternal {...props} />
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
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center"
            aria-hidden="true"
          >
            {/* Modal content - click stopPropagation to prevent backdrop click */}
            {/* @ts-expect-error - style props */}
            <Div
              onClick={(e) => e.stopPropagation()}
              className="p-4 relative z-[101] bg-background border shadow-lg rounded-lg"
              style={{
                display: "flex",
                flexDirection: "column" as const,
                width: "400px",
                maxWidth: "90vw",
                maxHeight: "min(600px,calc(100dvh-100px))",
                overflowY: "auto" as const,
              }}
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
  submitButton?: SubmitButtonConfig;
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
  const modalNavigationOverride = useMemo(() => {
    if (!isModal) {
      return undefined;
    }
    return {
      pop: (): void => {
        setModalOpenState(
          (prev: Record<number, boolean>): Record<number, boolean> => ({
            ...prev,
            [entry.timestamp]: false,
          }),
        );
        finalNavigation.pop();
      },
      canGoBack: true,
    };
  }, [isModal, entry.timestamp, finalNavigation, setModalOpenState]);

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
            },
          }}
          submitButton={submitButton}
          debug={debug}
          user={user}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
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
              mutationOptions: (entry.endpoint.options?.mutationOptions
                ? (() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { onSuccess, ...rest } =
                      entry.endpoint.options.mutationOptions;
                    return Object.keys(rest).length > 0 ? rest : undefined;
                  })()
                : undefined) as never,
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
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
              mutationOptions: (entry.endpoint.options?.mutationOptions
                ? (() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { onSuccess, ...rest } =
                      entry.endpoint.options.mutationOptions;
                    return Object.keys(rest).length > 0 ? rest : undefined;
                  })()
                : undefined) as never,
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
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
              mutationOptions: entry.endpoint.options?.mutationOptions
                ? (() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { onSuccess, ...rest } =
                      entry.endpoint.options.mutationOptions;
                    return Object.keys(rest).length > 0 ? rest : undefined;
                  })()
                : undefined,
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
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
              autoPrefillData: entry.params.urlPathParams,
              mutationOptions: (entry.endpoint.options?.mutationOptions
                ? (() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { onSuccess, ...rest } =
                      entry.endpoint.options.mutationOptions;
                    return Object.keys(rest).length > 0 ? rest : undefined;
                  })()
                : undefined) as never,
            },
          }}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
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
            },
          }}
          submitButton={submitButton}
          debug={debug}
          _disableNavigationStack={true}
          navigationOverride={isModal ? modalNavigationOverride : undefined}
        />
      </StackEntryRenderer>
    );
  }

  return null;
}
