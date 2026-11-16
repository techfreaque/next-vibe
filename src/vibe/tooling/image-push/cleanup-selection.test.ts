/**
 * image-push local cleanup selection unit tests.
 * Pure-function coverage for which local image refs and commit export dirs
 * `vibe image-push` may drop after a deploy.
 */

import { describe, expect, it } from "bun:test";

import {
  CLEANUP_IMAGE_REPO,
  type ExportDirEntry,
  type LocalImageEntry,
  parseDockerCreatedAt,
  PINNED_TAGS,
  selectExportDirsToPark,
  selectImageRefsToRemove,
} from "./cleanup-selection";

const REPO = CLEANUP_IMAGE_REPO;

/** Build `n` (1-based) is created on day `n`: higher n = newer. */
function build(n: number, tags: string[]): LocalImageEntry[] {
  const day = String(n).padStart(2, "0");
  return tags.map((tag) => ({
    repository: REPO,
    tag,
    id: `sha256:${String(n).repeat(4)}`,
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
    keepBuilds: 3,
    keepTags: overrides.keepTags ?? [...PINNED_TAGS],
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
    expect(select(entries, { keepTags: [...PINNED_TAGS, "redeployed-old"] })).toEqual(
      [],
    );
  });

  it("never removes an image a container uses", () => {
    const entries = [
      ...build(5, ["e5"]),
      ...build(4, ["d4"]),
      ...build(3, ["c3"]),
      ...build(2, ["b2"]),
      ...build(1, ["a1"]),
    ];
    expect(
      select(entries, { containerImageIds: [`sha256:${"2".repeat(4)}`] }),
    ).toEqual([`${REPO}:a1`]);
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
    expect(select(entries)).toEqual([`sha256:${"1".repeat(4)}`]);
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

describe("selectExportDirsToPark", () => {
  const sha = (c: string): string => c.repeat(40);
  const dir = (c: string, mtimeMs: number): ExportDirEntry => ({
    name: sha(c),
    isDirectory: true,
    mtimeMs,
  });

  it("keeps the newest 3 and parks the rest", () => {
    const entries = [
      dir("a", 1),
      dir("b", 2),
      dir("c", 3),
      dir("d", 4),
      dir("e", 5),
    ];
    expect(
      selectExportDirsToPark({ entries, keep: 3, currentSha: sha("e") }).toSorted(),
    ).toEqual([sha("a"), sha("b")]);
  });

  it("never parks the current commit's export", () => {
    const entries = [dir("a", 1), dir("b", 2), dir("c", 3), dir("d", 4)];
    expect(
      selectExportDirsToPark({ entries, keep: 3, currentSha: sha("a") }),
    ).toEqual([]);
  });

  it("ignores markers, files and non-sha names", () => {
    const entries: ExportDirEntry[] = [
      { name: `${sha("a")}.done`, isDirectory: false, mtimeMs: 0 },
      { name: "notes", isDirectory: true, mtimeMs: 0 },
      { name: sha("f"), isDirectory: false, mtimeMs: 0 },
      dir("b", 2),
      dir("c", 3),
      dir("d", 4),
      dir("e", 5),
    ];
    expect(
      selectExportDirsToPark({ entries, keep: 3, currentSha: sha("e") }),
    ).toEqual([sha("b")]);
  });
});
