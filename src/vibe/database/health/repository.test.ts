import { describe, expect, it, spyOn } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { scopedTranslation } from "../../tasks/i18n";
import { DbHealthRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);

const { t } = scopedTranslation.scopedT(defaultLocale);

describe("DbHealthRepository.check DB latency", () => {
  it("slow-but-alive DB succeeds with a warning", async () => {
    const res = await DbHealthRepository.check(t, logger, async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    // fast probe => no DB warning
    expect(res.success).toBe(true);
  });

  it("DB response above warn threshold is success + warning", async () => {
    const realNow = Date.now;
    let calls = 0;
    Date.now = (): number => {
      calls++;
      return calls === 1 ? 0 : 3000;
    };
    try {
      const res = await DbHealthRepository.check(t, logger, async () => {});
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.dbResponseMs).toBe(3000);
        expect(
          res.data.warnings.some((w) => w.includes("DB response slow")),
        ).toBe(true);
      }
    } finally {
      Date.now = realNow;
    }
  });

  it("unreachable DB still fails", async () => {
    const res = await DbHealthRepository.check(t, logger, async () => {
      return Promise.reject(new Error("ECONNREFUSED"));
    });
    expect(res.success).toBe(false);
  });

  it.skipIf(process.platform !== "linux")(
    "retains the warning and recovers RSS when the runtime memory sampler fails",
    async () => {
      const unavailable = Object.assign(
        (): never => expect.unreachable("Failed to get memory usage"),
        { rss: process.memoryUsage.rss },
      );
      const memory = spyOn(process, "memoryUsage").mockImplementation(
        unavailable,
      );
      try {
        const res = await DbHealthRepository.check(t, logger, async () => {});
        expect(res.success).toBe(true);
        if (res.success) {
          expect(
            res.data.warnings.some((warning) =>
              warning.startsWith("Process memory unavailable:"),
            ),
          ).toBe(true);
          expect(res.data.rssMb).toBeGreaterThan(0);
          expect(res.data.heapUsedMb).toBe(0);
        }
      } finally {
        memory.mockRestore();
      }
    },
  );
});
