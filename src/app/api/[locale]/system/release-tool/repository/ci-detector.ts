/**
 * CI Environment Detection Service
 * Detects and provides information about CI/CD environments
 *
 * Supports: GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis CI,
 * Azure Pipelines, Bitbucket Pipelines, Drone, Buildkite, Woodpecker,
 * TeamCity, Codeship, AppVeyor, AWS CodeBuild, Google Cloud Build,
 * Semaphore, Buddy, Render, Vercel, Netlify
 */

import type { CIEnvironment } from "../definition";

// ============================================================================
// Types
// ============================================================================

/**
 * Extended CI environment info with additional metadata
 */
export interface ExtendedCIEnvironment extends CIEnvironment {
  /** Job/Build ID */
  buildId?: string | null;
  /** Build number */
  buildNumber?: string | null;
  /** Build URL */
  buildUrl?: string | null;
  /** Repository URL */
  repoUrl?: string | null;
  /** Actor/User who triggered the build */
  actor?: string | null;
  /** Event that triggered the build */
  event?: string | null;
  /** Runner/Agent name */
  runner?: string | null;
  /** Whether this is a trusted/protected build */
  trusted?: boolean;
}

// ============================================================================
// Interface
// ============================================================================

export interface ICIDetector {
  /**
   * Detect the current CI environment
   */
  detect(): ExtendedCIEnvironment;

  /**
   * Check if running in CI
   */
  isCI(): boolean;

  /**
   * Get the CI provider name
   */
  getProvider(): string | null;

  /**
   * Get the current branch name
   */
  getBranch(): string | null;

  /**
   * Get the current commit SHA
   */
  getCommit(): string | null;

  /**
   * Get the pull request number/ID
   */
  getPR(): string | null;

  /**
   * Get the tag name (if this is a tag build)
   */
  getTag(): string | null;

  /**
   * Check if this is a pull request build
   */
  isPullRequest(): boolean;

  /**
   * Check if this is a tag build
   */
  isTagBuild(): boolean;

  /**
   * Clear the cached environment (for testing)
   */
  clearCache(): void;

  /**
   * Check if provenance attestation is supported
   */
  supportsProvenance(): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class CIDetector implements ICIDetector {
  private cachedEnvironment: ExtendedCIEnvironment | null = null;

  detect(): ExtendedCIEnvironment {
    if (this.cachedEnvironment) {
      return this.cachedEnvironment;
    }

    const env = process.env;

    // GitHub Actions
    if (env.GITHUB_ACTIONS === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "github",
        branch: env.GITHUB_REF_NAME ?? env.GITHUB_HEAD_REF ?? null,
        commit: env.GITHUB_SHA ?? null,
        pr:
          env.GITHUB_EVENT_NAME === "pull_request"
            ? env.GITHUB_PR_NUMBER ?? env.GITHUB_REF?.match(/refs\/pull\/(\d+)/)?.[1] ?? null
            : null,
        tag: env.GITHUB_REF?.startsWith("refs/tags/")
          ? env.GITHUB_REF.replace("refs/tags/", "")
          : null,
        buildId: env.GITHUB_RUN_ID ?? null,
        buildNumber: env.GITHUB_RUN_NUMBER ?? null,
        buildUrl: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID
          ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
          : null,
        repoUrl: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY
          ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`
          : null,
        actor: env.GITHUB_ACTOR ?? null,
        event: env.GITHUB_EVENT_NAME ?? null,
        runner: env.RUNNER_NAME ?? null,
        trusted: env.GITHUB_REF_PROTECTED === "true",
      };
    }


    // GitLab CI
    if (!this.cachedEnvironment && env.GITLAB_CI === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "gitlab",
        branch: env.CI_COMMIT_REF_NAME ?? null,
        commit: env.CI_COMMIT_SHA ?? null,
        pr: env.CI_MERGE_REQUEST_IID ?? null,
        tag: env.CI_COMMIT_TAG ?? null,
        buildId: env.CI_JOB_ID ?? null,
        buildNumber: env.CI_PIPELINE_IID ?? null,
        buildUrl: env.CI_JOB_URL ?? null,
        repoUrl: env.CI_PROJECT_URL ?? null,
        actor: env.GITLAB_USER_LOGIN ?? null,
        event: env.CI_PIPELINE_SOURCE ?? null,
        runner: env.CI_RUNNER_DESCRIPTION ?? null,
        trusted: env.CI_COMMIT_REF_PROTECTED === "true",
      };
    }


    // Jenkins
    if (!this.cachedEnvironment && env.JENKINS_URL) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "jenkins",
        branch: env.GIT_BRANCH ?? env.BRANCH_NAME ?? null,
        commit: env.GIT_COMMIT ?? null,
        pr: env.CHANGE_ID ?? null,
        tag: env.TAG_NAME ?? null,
        buildId: env.BUILD_ID ?? null,
        buildNumber: env.BUILD_NUMBER ?? null,
        buildUrl: env.BUILD_URL ?? null,
        repoUrl: env.GIT_URL ?? null,
        actor: env.BUILD_USER ?? null,
        event: env.CHANGE_ID ? "pull_request" : "push",
        runner: env.NODE_NAME ?? null,
      };
    }


    // CircleCI
    if (!this.cachedEnvironment && env.CIRCLECI === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "circleci",
        branch: env.CIRCLE_BRANCH ?? null,
        commit: env.CIRCLE_SHA1 ?? null,
        pr: env.CIRCLE_PULL_REQUEST
          ? env.CIRCLE_PR_NUMBER ?? env.CIRCLE_PULL_REQUEST.split("/").pop() ?? null
          : null,
        tag: env.CIRCLE_TAG ?? null,
        buildId: env.CIRCLE_WORKFLOW_ID ?? null,
        buildNumber: env.CIRCLE_BUILD_NUM ?? null,
        buildUrl: env.CIRCLE_BUILD_URL ?? null,
        repoUrl: env.CIRCLE_REPOSITORY_URL ?? null,
        actor: env.CIRCLE_USERNAME ?? null,
      };
    }


    // Travis CI
    if (!this.cachedEnvironment && env.TRAVIS === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "travis",
        branch: env.TRAVIS_BRANCH ?? null,
        commit: env.TRAVIS_COMMIT ?? null,
        pr:
          env.TRAVIS_PULL_REQUEST !== "false"
            ? env.TRAVIS_PULL_REQUEST ?? null
            : null,
        tag: env.TRAVIS_TAG ?? null,
        buildId: env.TRAVIS_BUILD_ID ?? null,
        buildNumber: env.TRAVIS_BUILD_NUMBER ?? null,
        buildUrl: env.TRAVIS_BUILD_WEB_URL ?? null,
        repoUrl: `https://github.com/${env.TRAVIS_REPO_SLUG}`,
      };
    }


    // Azure Pipelines
    if (!this.cachedEnvironment && env.TF_BUILD === "True") {
      const sourceBranch = env.BUILD_SOURCEBRANCH ?? "";
      this.cachedEnvironment = {
        isCI: true,
        provider: "azure",
        branch: env.BUILD_SOURCEBRANCHNAME ?? null,
        commit: env.BUILD_SOURCEVERSION ?? null,
        pr: env.SYSTEM_PULLREQUEST_PULLREQUESTID ?? null,
        tag: sourceBranch.startsWith("refs/tags/")
          ? sourceBranch.replace("refs/tags/", "")
          : null,
        buildId: env.BUILD_BUILDID ?? null,
        buildNumber: env.BUILD_BUILDNUMBER ?? null,
        buildUrl: env.SYSTEM_TEAMFOUNDATIONSERVERURI && env.SYSTEM_TEAMPROJECT && env.BUILD_BUILDID
          ? `${env.SYSTEM_TEAMFOUNDATIONSERVERURI}${env.SYSTEM_TEAMPROJECT}/_build/results?buildId=${env.BUILD_BUILDID}`
          : null,
        repoUrl: env.BUILD_REPOSITORY_URI ?? null,
        actor: env.BUILD_REQUESTEDFOR ?? null,
        event: env.BUILD_REASON ?? null,
        runner: env.AGENT_NAME ?? null,
      };
    }


    // Bitbucket Pipelines
    if (!this.cachedEnvironment && env.BITBUCKET_BUILD_NUMBER) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "bitbucket",
        branch: env.BITBUCKET_BRANCH ?? null,
        commit: env.BITBUCKET_COMMIT ?? null,
        pr: env.BITBUCKET_PR_ID ?? null,
        tag: env.BITBUCKET_TAG ?? null,
        buildId: env.BITBUCKET_PIPELINE_UUID ?? null,
        buildNumber: env.BITBUCKET_BUILD_NUMBER ?? null,
        repoUrl: env.BITBUCKET_GIT_HTTP_ORIGIN ?? null,
        actor: env.BITBUCKET_STEP_TRIGGERER_UUID ?? null,
      };
    }


    // Drone CI
    if (!this.cachedEnvironment && env.DRONE === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "drone",
        branch: env.DRONE_BRANCH ?? null,
        commit: env.DRONE_COMMIT_SHA ?? null,
        pr: env.DRONE_PULL_REQUEST ?? null,
        tag: env.DRONE_TAG ?? null,
        buildId: env.DRONE_BUILD_NUMBER ?? null,
        buildNumber: env.DRONE_BUILD_NUMBER ?? null,
        buildUrl: env.DRONE_BUILD_LINK ?? null,
        repoUrl: env.DRONE_REPO_LINK ?? null,
        actor: env.DRONE_COMMIT_AUTHOR ?? null,
        event: env.DRONE_BUILD_EVENT ?? null,
        runner: env.DRONE_RUNNER_HOST ?? null,
      };
    }


    // Buildkite
    if (!this.cachedEnvironment && env.BUILDKITE === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "buildkite",
        branch: env.BUILDKITE_BRANCH ?? null,
        commit: env.BUILDKITE_COMMIT ?? null,
        pr: env.BUILDKITE_PULL_REQUEST !== "false"
          ? env.BUILDKITE_PULL_REQUEST ?? null
          : null,
        tag: env.BUILDKITE_TAG ?? null,
        buildId: env.BUILDKITE_BUILD_ID ?? null,
        buildNumber: env.BUILDKITE_BUILD_NUMBER ?? null,
        buildUrl: env.BUILDKITE_BUILD_URL ?? null,
        repoUrl: env.BUILDKITE_REPO ?? null,
        actor: env.BUILDKITE_BUILD_CREATOR ?? null,
        runner: env.BUILDKITE_AGENT_NAME ?? null,
      };
    }


    // Woodpecker CI (Drone fork)
    if (!this.cachedEnvironment && (env.CI === "woodpecker" || env.WOODPECKER === "true")) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "woodpecker",
        branch: env.CI_COMMIT_BRANCH ?? null,
        commit: env.CI_COMMIT_SHA ?? null,
        pr: env.CI_COMMIT_PULL_REQUEST ?? null,
        tag: env.CI_COMMIT_TAG ?? null,
        buildId: env.CI_PIPELINE_NUMBER ?? null,
        buildNumber: env.CI_PIPELINE_NUMBER ?? null,
        buildUrl: env.CI_PIPELINE_URL ?? null,
        repoUrl: env.CI_REPO_LINK ?? null,
        actor: env.CI_COMMIT_AUTHOR ?? null,
        event: env.CI_PIPELINE_EVENT ?? null,
      };
    }


    // TeamCity
    if (!this.cachedEnvironment && env.TEAMCITY_VERSION) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "teamcity",
        branch: env.TEAMCITY_BUILD_BRANCH ?? null,
        commit: env.BUILD_VCS_NUMBER ?? null,
        pr: null,
        tag: null,
        buildId: env.TEAMCITY_BUILD_ID ?? null,
        buildNumber: env.BUILD_NUMBER ?? null,
      };
    }


    // Codeship
    if (!this.cachedEnvironment && env.CI_NAME === "codeship") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "codeship",
        branch: env.CI_BRANCH ?? null,
        commit: env.CI_COMMIT_ID ?? null,
        pr: env.CI_PR_NUMBER ?? null,
        tag: null,
        buildId: env.CI_BUILD_ID ?? null,
        buildNumber: env.CI_BUILD_NUMBER ?? null,
        buildUrl: env.CI_BUILD_URL ?? null,
        repoUrl: env.CI_REPO_NAME ?? null,
        actor: env.CI_COMMITTER_NAME ?? null,
      };
    }


    // AppVeyor
    if (!this.cachedEnvironment && (env.APPVEYOR === "True" || env.APPVEYOR === "true")) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "appveyor",
        branch: env.APPVEYOR_REPO_BRANCH ?? null,
        commit: env.APPVEYOR_REPO_COMMIT ?? null,
        pr: env.APPVEYOR_PULL_REQUEST_NUMBER ?? null,
        tag: env.APPVEYOR_REPO_TAG_NAME ?? null,
        buildId: env.APPVEYOR_BUILD_ID ?? null,
        buildNumber: env.APPVEYOR_BUILD_NUMBER ?? null,
        repoUrl: `https://github.com/${env.APPVEYOR_REPO_NAME}`,
        actor: env.APPVEYOR_REPO_COMMIT_AUTHOR ?? null,
      };
    }


    // AWS CodeBuild
    if (!this.cachedEnvironment && env.CODEBUILD_BUILD_ID) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "codebuild",
        branch: env.CODEBUILD_WEBHOOK_HEAD_REF?.replace("refs/heads/", "") ?? null,
        commit: env.CODEBUILD_RESOLVED_SOURCE_VERSION ?? null,
        pr: env.CODEBUILD_WEBHOOK_TRIGGER?.startsWith("pr/")
          ? env.CODEBUILD_WEBHOOK_TRIGGER.replace("pr/", "")
          : null,
        tag: env.CODEBUILD_WEBHOOK_TRIGGER?.startsWith("tag/")
          ? env.CODEBUILD_WEBHOOK_TRIGGER.replace("tag/", "")
          : null,
        buildId: env.CODEBUILD_BUILD_ID ?? null,
        buildNumber: env.CODEBUILD_BUILD_NUMBER ?? null,
        repoUrl: env.CODEBUILD_SOURCE_REPO_URL ?? null,
        actor: env.CODEBUILD_INITIATOR ?? null,
      };
    }


    // Google Cloud Build
    if (!this.cachedEnvironment && (env.BUILDER_OUTPUT || env.PROJECT_ID)) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "cloudbuild",
        branch: env.BRANCH_NAME ?? null,
        commit: env.COMMIT_SHA ?? null,
        pr: env._PR_NUMBER ?? null,
        tag: env.TAG_NAME ?? null,
        buildId: env.BUILD_ID ?? null,
        repoUrl: env.REPO_NAME ?? null,
      };
    }


    // Semaphore
    if (!this.cachedEnvironment && env.SEMAPHORE === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "semaphore",
        branch: env.SEMAPHORE_GIT_BRANCH ?? null,
        commit: env.SEMAPHORE_GIT_SHA ?? null,
        pr: env.SEMAPHORE_GIT_PR_NUMBER ?? null,
        tag: env.SEMAPHORE_GIT_TAG_NAME ?? null,
        buildId: env.SEMAPHORE_WORKFLOW_ID ?? null,
        buildNumber: env.SEMAPHORE_WORKFLOW_NUMBER ?? null,
        repoUrl: env.SEMAPHORE_GIT_URL ?? null,
        actor: env.SEMAPHORE_GIT_COMMITTER ?? null,
      };
    }


    // Buddy
    if (!this.cachedEnvironment && env.BUDDY === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "buddy",
        branch: env.BUDDY_EXECUTION_BRANCH ?? null,
        commit: env.BUDDY_EXECUTION_REVISION ?? null,
        pr: env.BUDDY_EXECUTION_PULL_REQUEST_ID ?? null,
        tag: env.BUDDY_EXECUTION_TAG ?? null,
        buildId: env.BUDDY_EXECUTION_ID ?? null,
        buildUrl: env.BUDDY_EXECUTION_URL ?? null,
        repoUrl: env.BUDDY_REPO_SLUG ?? null,
      };
    }


    // Render
    if (!this.cachedEnvironment && env.RENDER === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "render",
        branch: env.RENDER_GIT_BRANCH ?? null,
        commit: env.RENDER_GIT_COMMIT ?? null,
        pr: null,
        tag: null,
        repoUrl: env.RENDER_GIT_REPO_SLUG ?? null,
      };
    }


    // Vercel
    if (!this.cachedEnvironment && (env.VERCEL === "1" || env.NOW_BUILDER === "1")) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "vercel",
        branch: env.VERCEL_GIT_COMMIT_REF ?? null,
        commit: env.VERCEL_GIT_COMMIT_SHA ?? null,
        pr: env.VERCEL_GIT_PULL_REQUEST_ID ?? null,
        tag: null,
        repoUrl: env.VERCEL_GIT_REPO_SLUG ?? null,
        actor: env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN ?? null,
      };
    }


    // Netlify
    if (!this.cachedEnvironment && env.NETLIFY === "true") {
      this.cachedEnvironment = {
        isCI: true,
        provider: "netlify",
        branch: env.BRANCH ?? null,
        commit: env.COMMIT_REF ?? null,
        pr: env.PULL_REQUEST === "true" ? env.REVIEW_ID ?? null : null,
        tag: null,
        buildId: env.BUILD_ID ?? null,
        repoUrl: env.REPOSITORY_URL ?? null,
      };
    }


    // Generic CI detection
    if (
      !this.cachedEnvironment &&
      (env.CI === "true" ||
        env.CI === "1" ||
        env.CONTINUOUS_INTEGRATION === "true")
    ) {
      this.cachedEnvironment = {
        isCI: true,
        provider: "unknown",
        branch: env.BRANCH ?? env.GIT_BRANCH ?? null,
        commit: env.COMMIT ?? env.GIT_COMMIT ?? null,
        pr: null,
        tag: null,
      };
    }

    // Default: not in CI
    if (!this.cachedEnvironment) {
      this.cachedEnvironment = {
        isCI: false,
        provider: null,
        branch: null,
        commit: null,
        pr: null,
        tag: null,
      };
    }

    return this.cachedEnvironment;
  }

  isCI(): boolean {
    return this.detect().isCI;
  }

  getProvider(): string | null {
    return this.detect().provider;
  }

  getBranch(): string | null {
    return this.detect().branch;
  }

  getCommit(): string | null {
    return this.detect().commit;
  }

  getPR(): string | null {
    return this.detect().pr;
  }

  getTag(): string | null {
    return this.detect().tag;
  }

  isPullRequest(): boolean {
    return this.detect().pr !== null;
  }

  isTagBuild(): boolean {
    return this.detect().tag !== null;
  }

  clearCache(): void {
    this.cachedEnvironment = null;
  }

  supportsProvenance(): boolean {
    const provider = this.getProvider();
    // Provenance is supported on GitHub Actions and GitLab CI
    return provider === "github" || provider === "gitlab";
  }
}

// Singleton instance
export const ciDetector = new CIDetector();
