/**
 * SSH / Machine Access Enums
 */

export enum SshAuthType {
  PASSWORD = "PASSWORD",
  PRIVATE_KEY = "PRIVATE_KEY",
  KEY_AGENT = "KEY_AGENT",
}

export const SshAuthTypeDB = [
  SshAuthType.PASSWORD,
  SshAuthType.PRIVATE_KEY,
  SshAuthType.KEY_AGENT,
] as const;

export enum SshSessionStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ERROR = "ERROR",
}

export const SshSessionStatusDB = [
  SshSessionStatus.IDLE,
  SshSessionStatus.ACTIVE,
  SshSessionStatus.CLOSED,
  SshSessionStatus.ERROR,
] as const;

export enum SshCommandStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  TIMEOUT = "TIMEOUT",
}

export const SshCommandStatusDB = [
  SshCommandStatus.SUCCESS,
  SshCommandStatus.ERROR,
  SshCommandStatus.TIMEOUT,
] as const;

export enum ExecBackend {
  LOCAL = "LOCAL",
  SSH = "SSH",
}

export const ExecBackendDB = [ExecBackend.LOCAL, ExecBackend.SSH] as const;
