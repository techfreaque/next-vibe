import { expect, it, spyOn } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { scopedTranslation } from "../../core/i18n/shared";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { RouteExecutionExecutor } from "../../execute-tool/repository/core";
import { runGraph } from "./runner";

it("records a failed source and keeps dispatching unrelated nodes", async () => {
  const range = {
    from: new Date("2026-11-01T00:00:00Z"),
    to: new Date("2026-11-02T00:00:00Z"),
  };
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const failure = fail({
    message: t("errorTypes.internal_error"),
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  });
  const healthySource = success({
    result: [{ timestamp: range.to, value: 5 }],
  });
  const dispatch = spyOn(RouteExecutionExecutor, "executeGenericHandler")
    .mockResolvedValue(healthySource)
    .mockResolvedValueOnce(healthySource)
    .mockResolvedValueOnce(failure);
  const nodeProgress: Array<{
    nodeId: string;
    endpointPath: string | undefined;
    previousDispatches: number;
  }> = [];

  try {
    const result = await runGraph(
      "lead-funnel-fixture",
      {
        trigger: { type: "manual" },
        nodes: {
          numerator: { endpointPath: "signups", persist: "never" },
          denominator: { endpointPath: "humans", persist: "never" },
          ratio: { endpointPath: "ratio", persist: "never" },
          trend: { endpointPath: "trend", persist: "never" },
          independent: { endpointPath: "independent", persist: "never" },
        },
        edges: [
          { from: "numerator", to: "ratio", toHandle: "a" },
          { from: "denominator", to: "ratio", toHandle: "b" },
          { from: "ratio", to: "trend" },
        ],
      },
      range,
      undefined,
      {
        readOnly: true,
        onNodeStart: (nodeId, endpointPath) => {
          nodeProgress.push({
            nodeId,
            endpointPath,
            previousDispatches: dispatch.mock.calls.length,
          });
        },
      },
    );

    expect(result.errors).toEqual([
      { nodeId: "denominator", error: failure.message },
    ]);
    expect(dispatch.mock.calls.map(([params]) => params.toolName)).toEqual([
      "signups",
      "humans",
      "independent",
    ]);
    expect(nodeProgress).toContainEqual({
      nodeId: "denominator",
      endpointPath: "humans",
      previousDispatches: 1,
    });
    expect([...result.series.keys()]).toEqual(["numerator", "independent"]);
  } finally {
    dispatch.mockRestore();
  }
});
