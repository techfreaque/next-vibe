import { join } from "node:path";

export function dockerBuildArgs(options: {
  contextDir: string;
  platform: string;
  refs: string[];
  pushToRegistry: boolean;
  revision: string;
  created: Date;
}): string[] {
  return [
    "--platform",
    options.platform,
    "--network=host",
    "-f",
    join(options.contextDir, "Dockerfile"),
    ...options.refs.flatMap((ref) => ["-t", ref]),
    "--label",
    `org.opencontainers.image.revision=${options.revision}`,
    "--label",
    `org.opencontainers.image.created=${options.created.toISOString()}`,
    "--label",
    "org.opencontainers.image.source=https://github.com/techfreaque/next-vibe.git",
    "--build-arg",
    `VIBE_IMAGE_REVISION=${options.revision}`,
    options.pushToRegistry ? "--push" : "--load",
    options.contextDir,
  ];
}
