/// <reference types="node" />
/* eslint-disable i18next/no-literal-string */
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { promisify } from "node:util";

// eslint-disable-next-line eslint-plugin-import/no-named-as-default
import simpleGit from "simple-git";

import type {
  LaunchpadConfig,
  LaunchpadFolder,
  LaunchpadPackage,
} from "../types/types.js";

const execAsync = promisify(exec);
const git = simpleGit;

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

/**
 * Type guard to check if an object is a LaunchpadPackage
 */
function isLaunchpadPackage(
  obj: LaunchpadPackage | LaunchpadFolder,
): obj is LaunchpadPackage {
  return "branch" in obj && "repoUrl" in obj;
}

// Recursively process the config to extract all repository entries
export function extractRepos(
  obj: LaunchpadPackage | LaunchpadFolder,
  currentPath: string[] = [],
): { path: string[]; config: LaunchpadPackage }[] {
  if (isLaunchpadPackage(obj)) {
    // This is a package
    return [{ path: [...currentPath], config: obj }];
  } else {
    // This is a folder
    let results: { path: string[]; config: LaunchpadPackage }[] = [];
    for (const [key, value] of Object.entries(obj)) {
      results = [...results, ...extractRepos(value, [...currentPath, key])];
    }
    return results;
  }
}

// Get all repositories from config
export function getAllRepos(config: LaunchpadConfig): {
  config: LaunchpadPackage;
  path: string[];
}[] {
  let repos: { path: string[]; config: LaunchpadPackage }[] = [];
  for (const [key, value] of Object.entries(config.packages)) {
    repos = [...repos, ...extractRepos(value, [key])];
  }

  return repos;
}

// Check if repository exists locally
export function repoExists(repoPath: string[], rootDir?: string): boolean {
  const folderPath = path.join(rootDir || process.cwd(), ...repoPath);
  return (
    fs.existsSync(folderPath) && fs.existsSync(path.join(folderPath, ".git"))
  );
}

// Clone a repository
export async function cloneRepo(
  repoUrl: string,
  repoPath: string,
  branch = "main",
  rootDir: string,
): Promise<void> {
  // Ensure we use rootDir when determining the full path
  const fullPath = path.isAbsolute(repoPath)
    ? repoPath
    : path.join(rootDir, repoPath);

  // Create parent directories if they don't exist
  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  // Use simple-git to clone the repo with the full path
  await git().clone(repoUrl, fullPath);

  // Change directory to the cloned repo
  const repo = git(fullPath);

  // Check out the specified branch
  await repo.checkout(branch);
}

// Update a repository (stash, pull, pop stash)
export async function updateRepo(
  repoPath: string[],
  branch: string,
  force = false,
  rootDir?: string,
): Promise<void> {
  const folderPath = path.join(rootDir || process.cwd(), ...repoPath);

  // Check for local changes
  const { stdout: statusOutput } = await execAsync("git status --porcelain", {
    cwd: folderPath,
  });
  const hasChanges = statusOutput.trim() !== "";

  if (hasChanges && !force) {
    const answer = await prompt(
      `Repository ${repoPath.join("/")} has local changes. Stash them before pulling? (y/n): `,
    );
    if (answer.toLowerCase() !== "y") {
      return;
    }
  }

  if (hasChanges) {
    await execAsync("git stash", { cwd: folderPath });
  }

  await execAsync(`git checkout ${branch} && git pull`, { cwd: folderPath });

  if (hasChanges) {
    await execAsync("git stash pop", { cwd: folderPath });
  }
}

// Update the root repository (the launchpad itself)
export async function updateRootRepo(
  force = false,
  rootPath: string,
): Promise<void> {
  // Check for local changes
  const { stdout: statusOutput } = await execAsync("git status --porcelain", {
    cwd: rootPath,
  });
  const hasChanges = statusOutput.trim() !== "";

  if (hasChanges && !force) {
    const answer = await prompt(
      "Root repository has local changes. Stash them before pulling? (y/n): ",
    );
    if (answer.toLowerCase() !== "y") {
      return;
    }
  }

  if (hasChanges) {
    await execAsync("git stash", { cwd: rootPath });
  }

  await execAsync("git pull", { cwd: rootPath });

  if (hasChanges) {
    await execAsync("git stash pop", { cwd: rootPath });
  }
}

// Close readline interface
export function closePrompt(): void {
  rl.close();
}
