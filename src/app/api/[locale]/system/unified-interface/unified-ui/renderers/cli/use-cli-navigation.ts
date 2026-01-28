/**
 * CLI Navigation Hook
 *
 * Implements navigation stack for CLI/Ink terminal UI.
 * Mirrors React useNavigationStack but uses local state instead of Zustand.
 */

import { useState } from "react";

import type { UseNavigationStackReturn } from "../../../react/hooks/use-navigation-stack";
import type { NavigationStackEntry } from "../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";

/**
 * CLI Navigation Hook
 * Provides navigation stack management for terminal UI
 */
export function useCliNavigation(): UseNavigationStackReturn {
  const [stack, setStack] = useState<NavigationStackEntry[]>([]);

  const push = <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet = false,
    getEndpoint?: CreateApiEndpointAny,
    renderInModal = false,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
  ): void => {
    const entry: NavigationStackEntry<TEndpoint> = {
      endpoint,
      params,
      timestamp: Date.now(),
      getEndpoint,
      prefillFromGet,
      renderInModal,
      popNavigationOnSuccess,
      modalPosition,
    };

    setStack((prev) => [...prev, entry]);
  };

  const replace = <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet = false,
    getEndpoint?: CreateApiEndpointAny,
    renderInModal = false,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
  ): void => {
    const entry: NavigationStackEntry<TEndpoint> = {
      endpoint,
      params,
      timestamp: Date.now(),
      getEndpoint,
      prefillFromGet,
      renderInModal,
      popNavigationOnSuccess,
      modalPosition,
    };

    setStack((prev) => {
      if (prev.length === 0) {
        return [entry];
      }
      return [...prev.slice(0, -1), entry];
    });
  };

  const pop = (): void => {
    setStack((prev) => {
      if (prev.length <= 1) {
        return [];
      }
      return prev.slice(0, -1);
    });
  };

  const canGoBack = stack.length > 0;
  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  return {
    push,
    replace,
    pop,
    stack,
    canGoBack,
    current,
  };
}
