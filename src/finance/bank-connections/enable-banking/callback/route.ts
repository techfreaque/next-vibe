// oxlint-disable boilerplate/route-pattern -- The provider callback returns a browser redirect.
import "server-only";

import {
  configuredConsentOrigin,
  configuredConsentTransport,
} from "../connect/repository";
import { redirectBankConsent } from "./repository";

export function GET(request: Request): Promise<Response> {
  return redirectBankConsent(
    request,
    configuredConsentOrigin(),
    configuredConsentTransport(),
  );
}
