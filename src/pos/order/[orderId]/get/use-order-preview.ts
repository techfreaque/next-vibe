"use client";

import {
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo } from "react";
import { z } from "zod";

import definition, { type PosOrderGetResponseOutput } from "./definition";

export function useOrderPreview(
  orderId: string | undefined,
): PosOrderGetResponseOutput["result"] | undefined {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { orderId: orderId ?? "" },
        queryOptions: {
          enabled: interactive && z.uuid().safeParse(orderId).success,
          staleTime: 0,
        },
      },
    }),
    [orderId, interactive],
  );
  const read = useEndpoint(definition, options, logger, user).read;
  const order = read?.data?.result;
  return !read?.isFetching && order?.id === orderId ? order : undefined;
}
