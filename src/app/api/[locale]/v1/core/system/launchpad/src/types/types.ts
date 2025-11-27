export interface LaunchpadFolder {
  [folder: string]: LaunchpadPackage | LaunchpadFolder;
}

export interface LaunchpadPackage {
  branch: string;
  repoUrl: string;
}

export interface LaunchpadConfig {
  packages: LaunchpadFolder;
}

// Release orchestration types
export interface ReleaseTarget {
  directory: string;
  configPath: string;
  hasReleaseConfig: boolean;
}

export interface ReleaseState {
  targets: ReleaseTarget[];
  completed: string[];
  failed: string[];
  skipped: string[];
  currentIndex: number;
  startTime: string;
  lastUpdated: string;
}

export type VersionBumpType = "patch" | "minor" | "major" | "init";

export interface ReleaseOrchestrationOptions {
  // Common options
  stateFile?: string;
  continueFromState?: boolean;
  allowSkip?: boolean;
  allowRetry?: boolean;

  // Dev mode options
  forceUpdate?: boolean;
  versionBump?: VersionBumpType;
  forceRelease?: boolean;

  // CI mode options
  ciMode?: boolean;
  targetDirectory?: string;
}
