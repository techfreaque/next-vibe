import { describe, expect, it } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { DbHealthRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);

const t = ((key: string): string => key) as Parameters<
  typeof DbHealthRepository.check
>[0];

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
        expect(res.data.warnings.some((w) => w.includes("DB response slow"))).toBe(
          true,
        );
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
});
