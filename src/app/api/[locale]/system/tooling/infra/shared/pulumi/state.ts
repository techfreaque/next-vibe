import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Local file-based Pulumi state helpers.
 * State is stored at .pulumi/<clusterName>/ in the project root.
 * This directory should be git-ignored.
 */

export interface ClusterState {
  clusterName: string;
  kubeconfig: string;
  controlPlaneIp: string;
  nodeToken: string;
  createdAt: string;
  updatedAt: string;
}

export function readClusterState(stateDir: string): ClusterState | null {
  const statePath = `${stateDir}/state.json`;
  if (!existsSync(statePath)) {
    return null;
  }
  const raw = readFileSync(statePath, "utf-8");
  return JSON.parse(raw) as ClusterState;
}

export function writeClusterState(stateDir: string, state: ClusterState): void {
  mkdirSync(stateDir, { recursive: true });
  const statePath = `${stateDir}/state.json`;
  writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

export function readKubeconfig(kubeconfigPath: string): string | null {
  if (!existsSync(kubeconfigPath)) {
    return null;
  }
  return readFileSync(kubeconfigPath, "utf-8");
}

export function writeKubeconfig(
  kubeconfigPath: string,
  kubeconfig: string,
): void {
  mkdirSync(dirname(kubeconfigPath), { recursive: true });
  writeFileSync(kubeconfigPath, kubeconfig, { encoding: "utf-8", mode: 0o600 });
}

export function ensureGitignore(projectRoot: string): void {
  const gitignorePath = `${projectRoot}/.gitignore`;
  const entry = ".pulumi/";
  if (!existsSync(gitignorePath)) {
    return;
  }
  const content = readFileSync(gitignorePath, "utf-8");
  if (!content.includes(entry)) {
    writeFileSync(gitignorePath, `${content}\n${entry}\n`, "utf-8");
  }
}
