/**
 * SSH / Machine Access Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

// ─── Auth Type ───────────────────────────────────────────────────────────────

export const {
  enum: SshAuthType,
  options: SshAuthTypeOptions,
  Value: SshAuthTypeValue,
} = createEnumOptions(scopedTranslation, {
  PASSWORD: "enums.authType.password",
  PRIVATE_KEY: "enums.authType.privateKey",
  KEY_AGENT: "enums.authType.keyAgent",
});

export const SshAuthTypeDB = [
  SshAuthType.PASSWORD,
  SshAuthType.PRIVATE_KEY,
  SshAuthType.KEY_AGENT,
] as const;

export type SshAuthTypeType = typeof SshAuthTypeValue;

// ─── Login Shell ─────────────────────────────────────────────────────────────

export const {
  enum: LoginShell,
  options: LoginShellOptions,
  Value: LoginShellValue,
} = createEnumOptions(scopedTranslation, {
  BASH: "enums.shell.bash",
  ZSH: "enums.shell.zsh",
  SH: "enums.shell.sh",
  FISH: "enums.shell.fish",
  DASH: "enums.shell.dash",
  NOLOGIN: "enums.shell.nologin",
});

export const LoginShellDB = [
  LoginShell.BASH,
  LoginShell.ZSH,
  LoginShell.SH,
  LoginShell.FISH,
  LoginShell.DASH,
  LoginShell.NOLOGIN,
] as const;

export type LoginShellType = typeof LoginShellValue;

// ─── Session Status ───────────────────────────────────────────────────────────

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

// ─── Command Status ───────────────────────────────────────────────────────────

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

// ─── Exec Backend ─────────────────────────────────────────────────────────────

export enum ExecBackend {
  LOCAL = "LOCAL",
  SSH = "SSH",
}

export const ExecBackendDB = [ExecBackend.LOCAL, ExecBackend.SSH] as const;
