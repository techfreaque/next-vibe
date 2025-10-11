export interface PackageJson {
  name: string;
  version: string;
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  updateIgnoreDependencies?: string[];
}

export interface ReleaseConfig {
  packageManager?: "npm" | "yarn" | "pnpm" | "deno" | "bun";
  packages: ReleasePackage[];
  globalVersion?: string;
}

export type FoldersToZip = {
  input: string;
  output: string;
}[];

export interface ReleasePackage {
  directory: string;
  updateDeps: true | false | "force";
  lint: boolean;
  typecheck?: boolean;
  build: boolean;
  test: boolean;
  snyk?: boolean;
  release: ReleaseOptions | false;
}

export type AllowedVersionBumperExtension = "php" | "ts";
export type VersionBumperFileName =
  `${string}.${AllowedVersionBumperExtension}`;

export interface ReleaseOptions {
  version?: string; // Optional - defaults to package.json version
  tagPrefix: string; // can be an empty string for main package
  ciReleaseCommand?: {
    command: string[]; // will get concatenated with spaces
    env?: { [key: string]: string }; // e.g. NPM_TOKEN will get filled by ci
  };
  foldersToZip?: FoldersToZip;
  versionBumper?: {
    filePath: VersionBumperFileName;
    varName: string;
  }[];
  foldersToScanAndBumpThisPackage?: {
    folder: string;
  }[];
}
