/**
 * useWidgetValue / useWidgetSelector
 * Granular Zustand selectors for widget endpoint response data.
 * Fully type-safe - ResponseOutput is inferred from the endpoint type, no casts needed.
 */

"use client";

import { useShallow } from "zustand/react/shallow";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { ReactWidgetContext } from "./react-types";
import { useWidgetContextStore } from "./use-widget-context";
import type { WidgetContextStore } from "./widget-context-store";

type ResponseOutput<TEndpoint extends CreateApiEndpointAny> =
  TEndpoint["types"]["ResponseOutput"];

function selectData<TEndpoint extends CreateApiEndpointAny>(
  state: WidgetContextStore<TEndpoint, ReactWidgetContext<TEndpoint>>,
): ResponseOutput<TEndpoint> | undefined {
  const response = state.context.response;
  return response?.success ? response.data : undefined;
}

/**
 * Subscribe to the full response data of this widget's endpoint.
 * Re-renders ONLY when the response changes (Zustand shallow equality).
 *
 *   const data = useWidgetValue<typeof definition.GET>();
 *   //    ^? ResponseOutput | undefined  (fully typed, no cast needed)
 *
 * For granular field subscriptions use useWidgetSelector instead.
 */
export function useWidgetValue<TEndpoint extends CreateApiEndpointAny>():
  | ResponseOutput<TEndpoint>
  | undefined {
  const store = useWidgetContextStore<TEndpoint>();
  return store(
    useShallow(
      (state: WidgetContextStore<TEndpoint, ReactWidgetContext<TEndpoint>>) =>
        selectData(state),
    ),
  );
}

/**
 * Subscribe to a specific slice of the response data.
 * Re-renders ONLY when the selected slice changes.
 * TSelected is inferred from the selector's return type - no second type param needed.
 *
 *   const total = useWidgetSelector<typeof definition.GET>()(d => d?.total ?? 0);
 *   //    ^? number  (inferred from selector)
 *
 *   const messages = useWidgetSelector<typeof definition.GET>()(d => d?.messages ?? []);
 *   //    ^? Message[]  (inferred from selector)
 *
 * The two-call syntax `useWidgetSelector<TEndpoint>()(selector)` is required because
 * TypeScript does not support partial type argument inference - you cannot specify
 * TEndpoint and have TSelected inferred from the selector in a single call.
 * The extra `()` costs nothing at runtime.
 */
export function useWidgetSelector<TEndpoint extends CreateApiEndpointAny>(): <
  TSelected,
>(
  selector: (data: ResponseOutput<TEndpoint> | undefined) => TSelected,
) => TSelected {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useWidgetContextStore<TEndpoint>();
  return function select<TSelected>(
    selector: (data: ResponseOutput<TEndpoint> | undefined) => TSelected,
  ): TSelected {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return store(
      useShallow(
        (state: WidgetContextStore<TEndpoint, ReactWidgetContext<TEndpoint>>) =>
          selector(selectData(state)),
      ),
    );
  };
}

/**
 * Subscribe to a single item inside a nested array in the response data.
 * Re-renders ONLY when that specific item changes - not when other items change.
 *
 * Use this to avoid prop-drilling re-render cascades in list renderers.
 *
 *   const message = useWidgetItem<typeof definition.GET>()(
 *     (d) => d?.messages,   // pick the array from response
 *     (item) => item.id,    // key extractor (must return string | number)
 *     messageId,            // the key to find
 *   );
 *   //  ^? ChatMessage | undefined  (inferred from array element type)
 *
 * The three-call syntax `useWidgetItem<TEndpoint>()(arraySelector, keyFn, id)` mirrors
 * useWidgetSelector - TEndpoint must be explicit, TItem is inferred from the array selector.
 */
export function useWidgetItem<TEndpoint extends CreateApiEndpointAny>(): <
  TItem,
>(
  arraySelector: (
    data: ResponseOutput<TEndpoint> | undefined,
  ) => TItem[] | null | undefined,
  keyFn: (item: TItem) => string | number,
  id: string | number,
) => TItem | undefined {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useWidgetContextStore<TEndpoint>();
  return function selectItem<TItem>(
    arraySelector: (
      data: ResponseOutput<TEndpoint> | undefined,
    ) => TItem[] | null | undefined,
    keyFn: (item: TItem) => string | number,
    id: string | number,
  ): TItem | undefined {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return store(
      useShallow(
        (
          state: WidgetContextStore<TEndpoint, ReactWidgetContext<TEndpoint>>,
        ) => {
          const arr = arraySelector(selectData(state));
          if (!arr) {
            return undefined;
          }
          return arr.find((item) => keyFn(item) === id);
        },
      ),
    );
  };
}
