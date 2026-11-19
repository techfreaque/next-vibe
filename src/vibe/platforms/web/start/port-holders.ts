/**
 * Which processes hold a TCP listener on a port (Linux /proc only).
 *
 * Prod 2026-11-19 13:06: after a crash the respawned server's Next.js failed
 * 13 times with EADDRINUSE on :3000 for five minutes and the logs could not
 * say who held the port. This names the holders (pid, parent, command) so the
 * next occurrence explains itself.
 */

import { readdirSync, readFileSync, readlinkSync } from "node:fs";

export interface PortHolder {
  pid: number;
  ppid: number | null;
  cmd: string;
}

const TCP_LISTEN = "0A";

function listeningInodes(port: number): Set<string> {
  const inodes = new Set<string>();
  const hexPort = port.toString(16).toUpperCase().padStart(4, "0");
  for (const table of ["/proc/net/tcp", "/proc/net/tcp6"]) {
    let text: string;
    try {
      text = readFileSync(table, "utf-8");
    } catch {
      continue;
    }
    for (const line of text.split("\n").slice(1)) {
      const cols = line.trim().split(/\s+/);
      const local = cols[1];
      if (!local || cols[3] !== TCP_LISTEN || !local.endsWith(`:${hexPort}`)) {
        continue;
      }
      const inode = cols[9];
      if (inode && inode !== "0") {
        inodes.add(inode);
      }
    }
  }
  return inodes;
}

function readProc(pid: string, file: string): string | null {
  try {
    return readFileSync(`/proc/${pid}/${file}`, "utf-8");
  } catch {
    return null;
  }
}

export function findPortHolders(port: number): PortHolder[] {
  if (process.platform !== "linux") {
    return [];
  }
  const inodes = listeningInodes(port);
  if (inodes.size === 0) {
    return [];
  }
  let pids: string[];
  try {
    pids = readdirSync("/proc").filter((entry) => /^\d+$/.test(entry));
  } catch {
    return [];
  }
  const holders: PortHolder[] = [];
  for (const pid of pids) {
    let fds: string[];
    try {
      fds = readdirSync(`/proc/${pid}/fd`);
    } catch {
      continue;
    }
    const holds = fds.some((fd) => {
      try {
        const target = readlinkSync(`/proc/${pid}/fd/${fd}`);
        const match = /^socket:\[(\d+)\]$/.exec(target);
        return match?.[1] !== undefined && inodes.has(match[1]);
      } catch {
        return false;
      }
    });
    if (!holds) {
      continue;
    }
    // stat: "pid (comm) state ppid ..." - comm may contain spaces/parens.
    const stat = readProc(pid, "stat");
    const afterComm = stat ? stat.slice(stat.lastIndexOf(")") + 2) : "";
    const ppid = Number.parseInt(afterComm.split(" ")[1] ?? "", 10);
    const cmdline = readProc(pid, "cmdline");
    holders.push({
      pid: Number.parseInt(pid, 10),
      ppid: Number.isInteger(ppid) ? ppid : null,
      cmd: (cmdline ?? "").replaceAll("\0", " ").trim().slice(0, 200),
    });
  }
  return holders;
}
