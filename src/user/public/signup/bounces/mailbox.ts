import type { SystemMailboxConfig } from "@/messenger/system-mailbox/config";

export interface SignupMailboxCandidate {
  source: string;
  host: string | null | undefined;
  username: string | null | undefined;
  password: string | null | undefined;
  port?: number | null;
  secure?: boolean | null;
}

const HOSTNAME =
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/i;

export function signupMailboxConfigs(
  candidates: readonly SignupMailboxCandidate[],
  invalidHost: (source: string) => void,
): SystemMailboxConfig["imap"][] {
  const configs: SystemMailboxConfig["imap"][] = [];
  for (const { source, host, username, password, port, secure } of candidates) {
    if (host && !HOSTNAME.test(host)) {
      invalidHost(source);
      continue;
    }
    const tlsPort = port ?? 993;
    if (!host || !username || !password || (tlsPort !== 993 && !secure)) {
      continue;
    }
    if (
      configs.some(
        (config) =>
          config.host === host &&
          config.port === tlsPort &&
          config.username === username &&
          config.password === password,
      )
    ) {
      continue;
    }
    configs.push({ host, username, password, port: tlsPort, secure: true });
  }
  return configs;
}
