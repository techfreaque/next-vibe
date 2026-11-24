import { describe, expect, it } from "bun:test";
import { join } from "node:path";

import { dockerBuildArgs } from "./build-args";

describe("dockerBuildArgs", () => {
  const revision = "0123456789abcdef0123456789abcdef01234567";
  const contextDir = join(".tmp", "image-build", revision);
  const options = {
    contextDir,
    platform: "linux/amd64",
    refs: ["next-vibe:0123456", "next-vibe:latest"],
    revision,
    created: new Date("2026-11-24T04:15:00+01:00"),
  };

  it("labels a locally loaded image and passes the same revision into Dockerfile", () => {
    expect(dockerBuildArgs({ ...options, pushToRegistry: false })).toEqual([
      "--platform",
      "linux/amd64",
      "--network=host",
      "-f",
      join(contextDir, "Dockerfile"),
      "-t",
      "next-vibe:0123456",
      "-t",
      "next-vibe:latest",
      "--label",
      `org.opencontainers.image.revision=${revision}`,
      "--label",
      "org.opencontainers.image.created=2026-11-24T03:15:00.000Z",
      "--label",
      "org.opencontainers.image.source=https://github.com/techfreaque/next-vibe.git",
      "--build-arg",
      `VIBE_IMAGE_REVISION=${revision}`,
      "--load",
      contextDir,
    ]);
  });

  it("keeps the same metadata when pushing directly to a registry", () => {
    const localArgs = dockerBuildArgs({ ...options, pushToRegistry: false });
    expect(dockerBuildArgs({ ...options, pushToRegistry: true })).toEqual([
      ...localArgs.slice(0, -2),
      "--push",
      contextDir,
    ]);
  });
});
