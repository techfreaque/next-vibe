/**
 * SendOnlyProvider — abstract base for providers that only support outbound messaging.
 * (Resend email, Twilio SMS, WhatsApp Business, Telegram Bot)
 *
 * Inbox operations fall back to local DB state via LocalStateProvider.
 * No remote folder sync — messages sent through these providers are tracked
 * locally only.
 */

import "server-only";

import { LocalStateProvider } from "./local-state-base";

export abstract class SendOnlyProvider extends LocalStateProvider {}
