/**
 * Pure selection tests for local image and export cleanup and server retention.
 */

import { describe, expect, it } from "bun:test";

import {
  CLEANUP_IMAGE_REPO,
  type ExportEntry,
  KEEP_BUILDS,
  type LocalImageEntry,
  parseDockerCreatedAt,
  parseRemoteInventory,
  PINNED_TAGS,
  remoteInventoryScript,
  remotePinnedTags,
  remoteRetentionScript,
  selectExportEntriesToRemove,
  selectImageRefsToRemove,
  selectLocalImageRefsToRemove,
} from "./cleanup-selection";

const REPO = CLEANUP_IMAGE_REPO;

/** Build `n` (1-based) is created on day `n`: higher n = newer. */
function build(n: number, tags: string[]): LocalImageEntry[] {
  const day = String(n).padStart(2, "0");
  return tags.map((tag) => ({
    repository: REPO,
    tag,
    id: id(n),
    createdAt: `2026-11-${day} 04:37:44 +0100 CET`,
  }));
}

function select(
  entries: LocalImageEntry[],
  overrides: { keepTags?: string[]; containerImageIds?: string[] } = {},
): string[] {
  return selectImageRefsToRemove({
    repository: REPO,
    entries,
    keepBuilds: KEEP_BUILDS,
    keepTags: overrides.keepTags ?? PINNED_TAGS,
    containerImageIds: overrides.containerImageIds ?? [],
  });
}

describe("parseDockerCreatedAt", () => {
  it("parses docker's CreatedAt with offset", () => {
    expect(parseDockerCreatedAt("2026-11-16 04:37:44 +0100 CET")).toBe(
      Date.parse("2026-11-16T03:37:44Z"),
    );
  });

  it("returns NaN for unknown formats", () => {
    expect(Number.isNaN(parseDockerCreatedAt("3 days ago"))).toBe(true);
  });
});

describe("selectImageRefsToRemove", () => {
  it("keeps the newest 3 builds and removes every tag of older ones", () => {
    const entries = [
      ...build(5, ["e5", "latest"]),
      ...build(4, ["d4", "deploy-x"]),
      ...build(3, ["c3"]),
      ...build(2, ["b2", "label-2"]),
      ...build(1, ["a1"]),
    ];
    expect(select(entries).toSorted()).toEqual(
      [`${REPO}:a1`, `${REPO}:b2`, `${REPO}:label-2`].toSorted(),
    );
  });

  it("counts builds by image id, not by tag", () => {
    const entries = [
      ...build(4, ["d4", "x", "y", "z"]),
      ...build(3, ["c3"]),
      ...build(2, ["b2"]),
      ...build(1, ["a1"]),
    ];
    expect(select(entries)).toEqual([`${REPO}:a1`]);
  });

  it("never removes builds carrying pinned tags", () => {
    const entries = [
      ...build(6, ["f6", "latest"]),
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3", "rollback"]),
      ...build(2, ["b2", "prod-current-good"]),
      ...build(1, ["a1"]),
    ];
    expect(select(entries)).toEqual([`${REPO}:a1`]);
  });

  it("never removes the build just deployed, even when older", () => {
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      ...build(1, ["redeployed-old"]),
    ];
    expect(
      select(entries, { keepTags: [...PINNED_TAGS, "redeployed-old"] }),
    ).toEqual([]);
  });

  it("never removes an image a container uses", () => {
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      ...build(2, ["b2"]),
      ...build(1, ["a1"]),
    ];
    expect(select(entries, { containerImageIds: [id(2)] })).toEqual([
      `${REPO}:a1`,
    ]);
  });

  it("ignores rows from any other repository", () => {
    const foreign: LocalImageEntry = {
      repository: "postgres",
      tag: "16",
      id: "sha256:9999",
      createdAt: "2020-01-01 00:00:00 +0000 UTC",
    };
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      foreign,
    ];
    expect(select(entries)).toEqual([]);
  });

  it("does nothing for an image that is not the app repository", () => {
    expect(
      selectImageRefsToRemove({
        repository: "ghcr.io/someone/else",
        entries: [1, 2, 3, 4, 5].flatMap((n) =>
          build(n, [`t${String(n)}`]).map((e) => ({
            ...e,
            repository: "ghcr.io/someone/else",
          })),
        ),
        keepBuilds: 3,
        keepTags: [],
        containerImageIds: [],
      }),
    ).toEqual([]);
  });

  it("removes an old untagged build by image id", () => {
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      ...build(1, ["<none>"]),
    ];
    expect(select(entries)).toEqual([id(1)]);
  });

  it("keeps builds whose creation time cannot be parsed", () => {
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      ...build(2, ["b2"]),
      ...build(1, ["a1"]).map((e) => ({ ...e, createdAt: "garbage" })),
    ];
    // a1 is kept but does not take one of the 3 slots, so only b2 goes.
    expect(select(entries)).toEqual([`${REPO}:b2`]);
  });
});

describe("selectLocalImageRefsToRemove", () => {
  it("keeps the current build, the newest other build and images used by containers", () => {
    const entries = [
      ...build(6, ["newer"]),
      ...build(5, ["rollback", "old-custom"]),
      ...build(4, ["prod-current-good"]),
      ...build(3, ["unreadable-date"]).map((entry) => ({
        ...entry,
        createdAt: "",
      })),
      ...build(2, ["in-use", "in-use-alias"]),
      ...build(1, ["current-sha", "custom-tag", "latest"]),
    ];
    // current (1) + container (2) + the newest other build (6) are protected.
    expect(
      selectLocalImageRefsToRemove({
        entries,
        currentTag: "current-sha",
        containerImageIds: [id(2)],
      }),
    ).toEqual(
      ["rollback", "old-custom", "prod-current-good", "unreadable-date"].map(
        (tag) => `${REPO}:${tag}`,
      ),
    );
  });

  it("keeps the two newest builds after a registry-only push and scopes cleanup to the repository", () => {
    const entries = [
      ...build(4, ["x"]).map((entry) => ({ ...entry, repository: "postgres" })),
      ...build(3, ["c"]),
      ...build(2, ["b"]),
      ...build(1, ["a", "latest"]),
    ];
    expect(
      selectLocalImageRefsToRemove({
        entries,
        currentTag: undefined,
        containerImageIds: [],
      }),
    ).toEqual([`${REPO}:a`, `${REPO}:latest`]);
  });

  it("trims other repositories independently", () => {
    const entries = [
      ...build(3, ["c"]).map((e) => ({ ...e, repository: "next-vibe-commit-proof" })),
      ...build(2, ["b"]).map((e) => ({ ...e, repository: "next-vibe-commit-proof" })),
      ...build(1, ["a"]).map((e) => ({ ...e, repository: "next-vibe-commit-proof" })),
    ];
    expect(
      selectLocalImageRefsToRemove({
        repository: "next-vibe-commit-proof",
        entries,
        currentTag: undefined,
        containerImageIds: [],
      }),
    ).toEqual(["next-vibe-commit-proof:a"]);
  });

  it("skips image cleanup if the expected local commit tag is missing", () => {
    expect(
      selectLocalImageRefsToRemove({
        entries: build(1, ["latest"]),
        currentTag: "current-sha",
        containerImageIds: [],
      }),
    ).toBeUndefined();
  });
});

const exportSha = (character: string): string => character.repeat(40);
const exportDir = (character: string): ExportEntry => ({
  name: exportSha(character),
  isDirectory: true,
  isFile: false,
});
const exportFile = (name: string): ExportEntry => ({
  name,
  isDirectory: false,
  isFile: true,
});

describe("selectExportEntriesToRemove", () => {
  it("keeps the previous export (newest mtime) and removes the rest, including incomplete exports", () => {
    const entries = [
      exportDir("a"),
      exportFile(`${exportSha("a")}.done`),
      { ...exportDir("b"), mtimeMs: 10 },
      exportFile(`${exportSha("b")}.done`),
      { ...exportDir("c"), mtimeMs: 30 },
      { ...exportDir("d"), mtimeMs: 20 },
      exportFile(`${exportSha("d")}.done`),
    ];
    // c is the newest other export: it is the kept "previous" one.
    expect(
      selectExportEntriesToRemove({ entries, currentSha: exportSha("a") }),
    ).toEqual(
      new Map([
        [exportSha("b"), [exportSha("b"), `${exportSha("b")}.done`]],
        [exportSha("d"), [exportSha("d"), `${exportSha("d")}.done`]],
      ]),
    );
  });

  it("removes orphaned old markers including .checked and .gate-dirty, and skips unrelated entries", () => {
    const entries: ExportEntry[] = [
      exportFile(`${exportSha("a")}.done`),
      exportFile(`${exportSha("a")}.checked`),
      exportFile(`${exportSha("b")}.done`),
      exportFile(`${exportSha("b")}.checked`),
      exportFile(`${exportSha("b")}.gate-dirty`),
      { name: "notes", isDirectory: true, isFile: false },
      exportFile("notes.done"),
      exportFile("notes.checked"),
      exportFile(exportSha("f")),
      { name: `${exportSha("e")}.done`, isDirectory: true, isFile: false },
      { name: exportSha("d"), isDirectory: false, isFile: false },
    ];
    expect(
      selectExportEntriesToRemove({
        entries,
        currentSha: exportSha("a"),
        keep: 1,
      }),
    ).toEqual(
      new Map([
        [
          exportSha("b"),
          [
            `${exportSha("b")}.done`,
            `${exportSha("b")}.checked`,
            `${exportSha("b")}.gate-dirty`,
          ],
        ],
      ]),
    );
  });
});

describe("remotePinnedTags", () => {
  it("pins latest, rollback and prod-current-good on Server 1", () => {
    expect(remotePinnedTags("s1", "unbottled")).toEqual([
      "latest",
      "rollback",
      "prod-current-good",
    ]);
  });

  it("pins the node tag family on Server 2", () => {
    expect(remotePinnedTags("s2", "unbottled").toSorted()).toEqual(
      [
        "latest",
        "unbottled",
        "unbottled-prev",
        "unbottled-rollback",
      ].toSorted(),
    );
  });

  it("always pins heilpraktiker's :latest on Server 2, whatever the node tag", () => {
    for (const tag of ["", "  ", "latest", "other"]) {
      expect(remotePinnedTags("s2", tag)).toContain("latest");
    }
  });
});

/** One inventory line per image, as remoteInventoryScript prints it. */
function img(tag: string, n: number, created: string): string {
  return `VIBE_IMG|${REPO}|${tag}|sha256:${String(n).padStart(64, "0")}|${created} +0000 UTC`;
}
function id(n: number): string {
  return `sha256:${String(n).padStart(64, "0")}`;
}

describe("parseRemoteInventory", () => {
  it("parses free space, images and container image ids", () => {
    const stdout = [
      "VIBE_FREE_KB 97517568",
      img("unbottled", 1, "2026-11-16 12:23:14"),
      "VIBE_CTR|sha256:abc",
      "VIBE_INVENTORY_END",
    ].join("\n");
    expect(parseRemoteInventory(stdout)).toEqual({
      freeGb: 93,
      entries: [
        {
          repository: REPO,
          tag: "unbottled",
          id: id(1),
          createdAt: "2026-11-16 12:23:14 +0000 UTC",
        },
      ],
      containerImageIds: ["sha256:abc"],
    });
  });

  it("returns undefined without the end marker (failed or cut-off listing)", () => {
    expect(
      parseRemoteInventory(
        ["VIBE_FREE_KB 1", img("a", 1, "2026-11-16 12:23:14")].join("\n"),
      ),
    ).toBeUndefined();
  });

  it("leaves freeGb undefined when df printed nothing", () => {
    expect(
      parseRemoteInventory("VIBE_FREE_KB \nVIBE_INVENTORY_END")?.freeGb,
    ).toBeUndefined();
  });

  it("only lists the app repository", () => {
    expect(remoteInventoryScript(REPO)).toContain(
      `--format 'VIBE_IMG|{{.Repository}}|{{.Tag}}|{{.ID}}|{{.CreatedAt}}' ${REPO}`,
    );
    expect(remoteInventoryScript("ghcr.io/x/y; rm -rf /")).toBe("exit 2");
  });
});

describe("remoteRetentionScript", () => {
  it("uses plain docker rmi (never -f) and prunes dangling only", () => {
    const script = remoteRetentionScript([`${REPO}:old`, id(7)]);
    expect(script).toContain(`docker rmi '${REPO}:old'`);
    expect(script).toContain(`docker rmi '${id(7)}'`);
    expect(script).toContain("docker image prune -f");
    expect(script).not.toMatch(
      /rmi -f|rmi --force|prune -a|prune --all|system prune/,
    );
  });

  it("drops refs outside the app repository or with shell metacharacters", () => {
    const script = remoteRetentionScript([
      "postgres:16",
      `${REPO}:x'; rm -rf / #`,
      "heilpraktiker-brandstaetter-postgres:latest",
      "sha256:short",
    ]);
    expect(script).not.toContain("docker rmi");
  });
});

/** Mirrors ImagePushRemoteRetention.afterDeploy's selection. */
function selectRemote(
  node: "s1" | "s2",
  stdout: string,
  currentTags: string[],
): string[] {
  const inventory = parseRemoteInventory(stdout);
  if (!inventory) {
    expect(inventory).toBeDefined();
    return [];
  }
  return selectImageRefsToRemove({
    repository: REPO,
    entries: inventory.entries,
    keepBuilds: KEEP_BUILDS,
    keepTags: [...remotePinnedTags(node, "unbottled"), ...currentTags],
    containerImageIds: inventory.containerImageIds,
  });
}

describe("prod retention scenarios (inventories of 2026-11-16)", () => {
  it("Server 2: keeps heilpraktiker's old :latest, the node tags and the newest 3", () => {
    // After a deploy of build 20: :unbottled moved to 20, :unbottled-rollback
    // to 19 (funnel-1116). Build 1 is heilpraktiker's :latest from October,
    // run by its next-vibe-app container.
    const stdout = [
      "VIBE_FREE_KB 50000000",
      img("new-1116", 20, "2026-11-16 15:00:00"),
      img("unbottled", 20, "2026-11-16 15:00:00"),
      img("funnel-1116", 19, "2026-11-16 12:23:14"),
      img("unbottled-rollback", 19, "2026-11-16 12:23:14"),
      img("proxyhdr-1116", 18, "2026-11-16 11:41:38"),
      img("auth-locale-1116", 17, "2026-11-16 10:45:37"),
      img("seo-lag-1116", 16, "2026-11-16 10:08:38"),
      img("suite-fix-1113", 15, "2026-11-13 21:59:21"),
      img("1f4b1ceb47", 14, "2026-11-13 13:02:26"),
      img("ca158da240", 13, "2026-11-12 21:53:12"),
      img("envfix-variants", 13, "2026-11-12 21:53:12"),
      img("unbottled-prev", 12, "2026-11-09 18:08:53"),
      img("latest", 1, "2026-10-05 18:26:23"),
      `VIBE_CTR|${id(20)}`,
      `VIBE_CTR|${id(1)}`,
      "VIBE_CTR|sha256:postgres",
      "VIBE_INVENTORY_END",
    ].join("\n");
    const removed = selectRemote("s2", stdout, ["new-1116"]);
    expect(removed.toSorted()).toEqual(
      [
        `${REPO}:auth-locale-1116`,
        `${REPO}:seo-lag-1116`,
        `${REPO}:suite-fix-1113`,
        `${REPO}:1f4b1ceb47`,
        `${REPO}:ca158da240`,
        `${REPO}:envfix-variants`,
      ].toSorted(),
    );
    expect(removed).not.toContain(`${REPO}:latest`);
    expect(removed).not.toContain(`${REPO}:unbottled-prev`);
  });

  it("Server 2: heilpraktiker's :latest survives even when no container runs it", () => {
    const stdout = [
      img("unbottled", 5, "2026-11-16 15:00:00"),
      img("a", 4, "2026-11-16 14:00:00"),
      img("b", 3, "2026-11-16 13:00:00"),
      img("latest", 1, "2026-10-05 18:26:23"),
      "VIBE_INVENTORY_END",
    ].join("\n");
    expect(selectRemote("s2", stdout, [])).toEqual([]);
  });

  it("Server 1: keeps :latest/:rollback/:prod-current-good, the new build and the newest 3", () => {
    const stdout = [
      img("abc1234567", 30, "2026-11-16 15:00:00"),
      img("latest", 30, "2026-11-16 15:00:00"),
      img("216df376ac", 29, "2026-11-16 12:23:14"),
      img("rollback", 29, "2026-11-16 12:23:14"),
      img("prod-current-good", 29, "2026-11-16 12:23:14"),
      img("bf746e1185", 28, "2026-11-16 11:41:38"),
      img("proxyhdr-1116", 28, "2026-11-16 11:41:38"),
      img("1d134bed45", 27, "2026-11-16 11:14:11"),
      img("rollback-pre-ha", 10, "2026-11-12 20:24:40"),
      img("940e3325-good", 2, "2026-11-10 12:03:50"),
      `VIBE_CTR|${id(30)}`,
      "VIBE_INVENTORY_END",
    ].join("\n");
    expect(
      selectRemote("s1", stdout, ["abc1234567", "latest"]).toSorted(),
    ).toEqual(
      [
        `${REPO}:1d134bed45`,
        `${REPO}:rollback-pre-ha`,
        `${REPO}:940e3325-good`,
      ].toSorted(),
    );
  });

  it("Server 1: a stopped container's image is never selected", () => {
    const stdout = [
      img("n4", 4, "2026-11-16 15:00:00"),
      img("n3", 3, "2026-11-16 14:00:00"),
      img("n2", 2, "2026-11-16 13:00:00"),
      img("old", 1, "2026-11-01 13:00:00"),
      `VIBE_CTR|${id(1)}`,
      "VIBE_INVENTORY_END",
    ].join("\n");
    expect(selectRemote("s1", stdout, [])).toEqual([]);
  });
});
