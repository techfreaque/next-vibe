/**
 * Guest media cleanup selection: only expired, unthreaded files of confirmed
 * guest leads are deleted; account-owned, account-linked leads, unowned,
 * saved-thread and fresh files stay.
 */
import { describe, expect, it } from "bun:test";

import type { FileMetadata } from "../index";
import { GUEST_MEDIA_RETENTION_DAYS } from "./constants";
import {
  classifyGuestMedia,
  collectLeadIds,
  GuestMediaVerdict,
  isUuidCandidate,
  selectGuestMediaForDeletion,
} from "./selection";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-11-13T06:00:00.000Z");
const CUTOFF = new Date(NOW.getTime() - GUEST_MEDIA_RETENTION_DAYS * DAY_MS);
const OLD = new Date(CUTOFF.getTime() - 60_000);
const FRESH = new Date(CUTOFF.getTime() + 60_000);

const INCOGNITO_THREAD = "11111111-1111-4111-8111-111111111111";
const STORED_THREAD = "22222222-2222-4222-8222-222222222222";
const STORED = new Set([STORED_THREAD]);

const GUEST_LEAD = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const GUEST_LEAD_2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const GUEST_LEAD_3 = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
/** Lead that signed up or logged in at some point: not in the guest set. */
const ACCOUNT_LEAD = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const GUESTS = new Set([GUEST_LEAD, GUEST_LEAD_2, GUEST_LEAD_3]);

let counter = 0;
function file(overrides: Partial<FileMetadata>): FileMetadata {
  counter++;
  return {
    id: `file-${counter}`,
    filename: `file-${counter}.png`,
    originalFilename: "generated-image.png",
    mimeType: "image/png",
    size: 1000,
    uploadedAt: OLD,
    threadId: INCOGNITO_THREAD,
    ...overrides,
  };
}

function classify(f: FileMetadata): string {
  return classifyGuestMedia(f, STORED, GUESTS, CUTOFF);
}

describe("retention", () => {
  it("defaults to 120 days (4 months)", () => {
    expect(GUEST_MEDIA_RETENTION_DAYS).toBe(120);
  });

  it("keeps a guest file that is 119 days old and deletes one 121 days old", () => {
    expect(
      classify(
        file({
          leadId: GUEST_LEAD,
          uploadedAt: new Date(NOW.getTime() - 119 * DAY_MS),
        }),
      ),
    ).toBe(GuestMediaVerdict.TOO_NEW);
    expect(
      classify(
        file({
          leadId: GUEST_LEAD,
          uploadedAt: new Date(NOW.getTime() - 121 * DAY_MS),
        }),
      ),
    ).toBe(GuestMediaVerdict.DELETE);
  });
});

describe("classifyGuestMedia", () => {
  it("deletes expired guest media outside saved threads", () => {
    expect(classify(file({ leadId: GUEST_LEAD }))).toBe(
      GuestMediaVerdict.DELETE,
    );
  });

  it("matches guest leads case-insensitively", () => {
    expect(classify(file({ leadId: GUEST_LEAD.toUpperCase() }))).toBe(
      GuestMediaVerdict.DELETE,
    );
  });

  it("keeps files of a lead that is linked to a user account", () => {
    expect(classify(file({ leadId: ACCOUNT_LEAD }))).toBe(
      GuestMediaVerdict.ACCOUNT_LEAD,
    );
  });

  it("keeps account-owned files even with a guest leadId", () => {
    expect(classify(file({ leadId: GUEST_LEAD, uploadedBy: "user-1" }))).toBe(
      GuestMediaVerdict.USER_OWNED,
    );
  });

  it("keeps files with no owner (legacy, screenshots, url cache)", () => {
    expect(classify(file({ threadId: "url-fetch-cache" }))).toBe(
      GuestMediaVerdict.UNOWNED,
    );
  });

  it("keeps guest files inside a saved thread", () => {
    expect(
      classify(file({ leadId: GUEST_LEAD, threadId: STORED_THREAD })),
    ).toBe(GuestMediaVerdict.STORED_THREAD);
  });

  it("matches saved threads case-insensitively", () => {
    expect(
      classify(
        file({ leadId: GUEST_LEAD, threadId: STORED_THREAD.toUpperCase() }),
      ),
    ).toBe(GuestMediaVerdict.STORED_THREAD);
  });

  it("keeps files inside the retention window and exactly at the cutoff", () => {
    expect(classify(file({ leadId: GUEST_LEAD, uploadedAt: FRESH }))).toBe(
      GuestMediaVerdict.TOO_NEW,
    );
    expect(classify(file({ leadId: GUEST_LEAD, uploadedAt: CUTOFF }))).toBe(
      GuestMediaVerdict.TOO_NEW,
    );
  });

  it("treats an unparseable upload date as too new", () => {
    expect(
      classify(
        file({ leadId: GUEST_LEAD, uploadedAt: new Date("not a date") }),
      ),
    ).toBe(GuestMediaVerdict.TOO_NEW);
  });
});

describe("selectGuestMediaForDeletion", () => {
  it("counts every verdict and respects the batch limit", () => {
    const deletable = [
      file({ leadId: GUEST_LEAD, size: 100 }),
      file({ leadId: GUEST_LEAD_2, size: 200 }),
      file({ leadId: GUEST_LEAD_3, size: 300 }),
    ];
    const selection = selectGuestMediaForDeletion({
      files: [
        ...deletable,
        file({ leadId: GUEST_LEAD, uploadedAt: FRESH }),
        file({ leadId: GUEST_LEAD, uploadedBy: "user-1" }),
        file({}),
        file({ leadId: GUEST_LEAD, threadId: STORED_THREAD }),
        file({ leadId: ACCOUNT_LEAD }),
      ],
      storedThreadIds: STORED,
      guestLeadIds: GUESTS,
      cutoff: CUTOFF,
      limit: 2,
    });

    expect(selection.toDelete.map((f) => f.id)).toEqual([
      deletable[0]?.id,
      deletable[1]?.id,
    ]);
    expect(selection.deferred).toBe(1);
    expect(selection.skipped).toEqual({
      tooNew: 1,
      userOwned: 1,
      unowned: 1,
      storedThread: 1,
      accountLead: 1,
    });
  });

  it("deletes nothing when no lead is a confirmed guest", () => {
    const selection = selectGuestMediaForDeletion({
      files: [file({ leadId: GUEST_LEAD }), file({ leadId: ACCOUNT_LEAD })],
      storedThreadIds: STORED,
      guestLeadIds: new Set(),
      cutoff: CUTOFF,
      limit: 100,
    });
    expect(selection.toDelete).toHaveLength(0);
    expect(selection.skipped.accountLead).toBe(2);
  });

  it("returns nothing for an empty storage", () => {
    const selection = selectGuestMediaForDeletion({
      files: [],
      storedThreadIds: STORED,
      guestLeadIds: GUESTS,
      cutoff: CUTOFF,
      limit: 100,
    });
    expect(selection.toDelete).toHaveLength(0);
    expect(selection.deferred).toBe(0);
  });
});

describe("collectLeadIds", () => {
  it("collects unique lowercased lead ids of lead-owned files only", () => {
    expect(
      collectLeadIds([
        file({ leadId: GUEST_LEAD }),
        file({ leadId: GUEST_LEAD.toUpperCase() }),
        file({ leadId: GUEST_LEAD_2, uploadedBy: "user-1" }),
        file({ leadId: "not-a-uuid" }),
        file({}),
      ]),
    ).toEqual([GUEST_LEAD]);
  });
});

describe("isUuidCandidate", () => {
  it("accepts uuids and rejects other namespaces", () => {
    expect(isUuidCandidate(INCOGNITO_THREAD)).toBe(true);
    expect(isUuidCandidate(INCOGNITO_THREAD.toUpperCase())).toBe(true);
    expect(isUuidCandidate("url-fetch-cache")).toBe(false);
    expect(isUuidCandidate("browser-session-abc")).toBe(false);
  });
});
