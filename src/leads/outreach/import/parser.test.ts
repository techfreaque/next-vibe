/**
 * Outreach log parser + pipeline rules. Pure: no DB, no network.
 */

import { describe, expect, it } from "vitest";

import {
  OutreachAngleGroup,
  OutreachContactKind,
  OutreachContactStatus,
  OutreachDirection,
} from "../enum";
import { angleGroup, mergeStatus, normalizeEmail } from "../pipeline";
import { parseOutreachLog, touchKey } from "./parser";

describe("parseOutreachLog - tab-separated sent-log", () => {
  it("splits real tabs and literal \\t the same way", () => {
    const content = [
      "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut for ModelFit\tSENT",
      String.raw`2026-11-10\tLeon van Zyl\tLeon@Cognaitiv.ai\tNEGOTIATE-counter\tRe: rates (counter $600 + 10%% ref)\tSENT-REPLY`,
    ].join("\n");
    const { rows, skipped } = parseOutreachLog(content, "sent-log");
    expect(skipped).toEqual([]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      email: "partnerships@modelfit.io",
      name: "ModelFit",
      angle: "A-affiliate",
      direction: OutreachDirection.OUT,
      status: OutreachContactStatus.SENT,
      precision: "day",
    });
    expect(rows[0]?.at.toISOString()).toBe("2026-11-10T00:00:00.000Z");
    expect(rows[1]).toMatchObject({
      email: "leon@cognaitiv.ai",
      direction: OutreachDirection.OUT,
      status: OutreachContactStatus.REPLIED,
      subject: "Re: rates (counter $600 + 10% ref)",
    });
  });

  it("guesses creators and directories, skips ignored and broken lines", () => {
    const content = [
      "2026-11-12\tlocally (YouTube video-deal)\thello@locallyexplains.site\tVIDEO-INQUIRY small test (EN)\tSponsor inquiry\tSENT",
      "2026-11-10\tlocal-llm.net\tpress@local-llm.net\tD-get-listed\tOne for your directory\tSENT",
      "2026-11-10\tMax\tmax@example.com\tDEAL-APPROVAL\tapproval\tSENT-REPLY",
      "2026-11-10\tNo Mail\tnot-an-email\tB\tsubject\tSENT",
      "2026-11-10\tshort\tline",
      "Totals: 17 sent, 0 failed.",
    ].join("\n");
    const { rows, skipped } = parseOutreachLog(
      content,
      "sent-log",
      new Set(["max@example.com"]),
    );
    expect(rows.map((row) => row.kind)).toEqual([
      OutreachContactKind.CREATOR,
      OutreachContactKind.DIRECTORY,
    ]);
    expect(skipped.map((entry) => entry.reason)).toEqual([
      "skip.ignored",
      "skip.noEmail",
      "skip.columns",
    ]);
  });
});

describe("parseOutreachLog - markdown", () => {
  const md = [
    "# Outreach sent log",
    "",
    "| Creator | Email | Angle | Subject | UTC timestamp | Status |",
    "|---|---|---|---|---|---|",
    "| Matt Wolfe | business@mattwolfe.com | 4 | A tool for FutureTools | 2026-11-08T22:28:48Z | sent |",
    "| PromptEngineer48 | prompt.engineer48.alerts@gmail.com | — | — | — | SKIPPED |",
    "",
    "## 2026-11-09 REPLIES + BOUNCES",
    "- REPLY: Faizaan Mahmood (The AI Grid, me@faiz.mov) — sent a rate card.",
    "- BOUNCE: business@aiin5minutes.cc (AI in 5 Minutes) — domain does not resolve.",
    "",
    "# Outreach REPLIES received 2026-11-10 (5)",
    "",
    "| Creator | Email | Their response | Classification | Action |",
    "|---|---|---|---|---|",
    "| Paradoxa | youtube@paradoxa.ai | Flat-rate only | Paid-only prospect | Rate card |",
  ].join("\n");

  it("reads sent tables, numeric angles, bullets and reply tables", () => {
    const { rows, skipped } = parseOutreachLog(md, "sent-log.md");
    expect(skipped).toEqual([
      { source: "sent-log.md", line: 6, reason: "skip.skippedStatus" },
    ]);
    const [sent, reply, bounce, inbound] = rows;
    expect(sent).toMatchObject({
      email: "business@mattwolfe.com",
      angle: "D-try-it",
      kind: OutreachContactKind.CREATOR,
      precision: "exact",
      status: OutreachContactStatus.SENT,
    });
    expect(sent?.at.toISOString()).toBe("2026-11-08T22:28:48.000Z");
    expect(reply).toMatchObject({
      email: "me@faiz.mov",
      name: "Faizaan Mahmood",
      direction: OutreachDirection.IN,
      status: OutreachContactStatus.REPLIED,
      note: "sent a rate card.",
    });
    expect(reply?.at.toISOString()).toBe("2026-11-09T00:00:00.000Z");
    expect(bounce).toMatchObject({
      email: "business@aiin5minutes.cc",
      direction: null,
      status: OutreachContactStatus.BOUNCED,
    });
    expect(inbound).toMatchObject({
      email: "youtube@paradoxa.ai",
      direction: OutreachDirection.IN,
      note: "Flat-rate only · Paid-only prospect",
    });
    expect(inbound?.at.toISOString()).toBe("2026-11-10T00:00:00.000Z");
  });
});

describe("touchKey", () => {
  it("dedupes by email, direction, UTC day and subject (case-insensitive)", () => {
    const morning = new Date("2026-11-10T00:00:00Z");
    const evening = new Date("2026-11-10T21:30:00Z");
    expect(
      touchKey("a@b.co", OutreachDirection.OUT, morning, "Hello There"),
    ).toBe(touchKey("a@b.co", OutreachDirection.OUT, evening, "hello there "));
    expect(touchKey("a@b.co", OutreachDirection.OUT, morning, "x")).not.toBe(
      touchKey("a@b.co", OutreachDirection.IN, morning, "x"),
    );
  });
});

describe("pipeline rules", () => {
  it("only moves forward, exits always apply, opt-out sticks", () => {
    const S = OutreachContactStatus;
    expect(mergeStatus(null, S.SENT)).toBe(S.SENT);
    expect(mergeStatus(S.INTERESTED, S.SENT)).toBe(S.INTERESTED);
    expect(mergeStatus(S.SENT, S.REPLIED)).toBe(S.REPLIED);
    expect(mergeStatus(S.DEAL, S.DECLINED)).toBe(S.DECLINED);
    expect(mergeStatus(S.BOUNCED, S.SENT)).toBe(S.BOUNCED);
    expect(mergeStatus(S.BOUNCED, S.REPLIED)).toBe(S.REPLIED);
    expect(mergeStatus(S.DECLINED, S.REPLIED)).toBe(S.DECLINED);
    expect(mergeStatus(S.DECLINED, S.DEAL)).toBe(S.DEAL);
    expect(mergeStatus(S.OPT_OUT, S.DEAL)).toBe(S.OPT_OUT);
    expect(mergeStatus(S.OPT_OUT, S.SENT, true)).toBe(S.SENT);
  });

  it("groups raw angles into families", () => {
    expect(angleGroup("A-affiliate+dev")).toBe(OutreachAngleGroup.AFFILIATE);
    expect(angleGroup("B+C-user-judgment (DE)")).toBe(
      OutreachAngleGroup.AUDIENCE_FIT,
    );
    expect(angleGroup("C-privacy (ES)")).toBe(OutreachAngleGroup.MISSION);
    expect(angleGroup("4")).toBe(OutreachAngleGroup.TRY_IT);
    expect(angleGroup("VIDEO-INQUIRY small test (EN)")).toBe(
      OutreachAngleGroup.VIDEO,
    );
    expect(angleGroup("NEGOTIATE-counter")).toBe(
      OutreachAngleGroup.NEGOTIATION,
    );
    expect(angleGroup("INFO-FIRST")).toBe(OutreachAngleGroup.INFO_FIRST);
    expect(angleGroup("audience-fit")).toBe(OutreachAngleGroup.AUDIENCE_FIT);
    expect(angleGroup(null)).toBe(OutreachAngleGroup.OTHER);
  });

  it("extracts and lowercases emails", () => {
    expect(normalizeEmail("The AI Grid, Me@Faiz.mov)")).toBe("me@faiz.mov");
    expect(normalizeEmail("`prompt.engineer48.alerts@gmail.com`")).toBe(
      "prompt.engineer48.alerts@gmail.com",
    );
    expect(normalizeEmail("—")).toBe(null);
  });
});
