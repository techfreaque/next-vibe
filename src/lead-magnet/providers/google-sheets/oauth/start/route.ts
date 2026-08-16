// oxlint-disable boilerplate/route-pattern -- OAuth start uses raw Response.redirect(), cannot use endpointsHandler
import "server-only";

import { AuthRepository } from "next-vibe/identity/auth/repository";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { NextRequest } from "next-vibe/ui/lib/request";

import { buildGoogleAuthUrl } from "../../oauth-helpers";

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const locale = url.pathname.split("/")[2] ?? "en";
  const logger = createEndpointLogger(false, `${locale}-GLOBAL` as never);

  const user = await AuthRepository.getAuthMinimalUser(
    [
      UserRole.CUSTOMER,
      UserRole.ADMIN,
      UserRole.PARTNER_ADMIN,
      UserRole.PARTNER_EMPLOYEE,
    ] as const,
    {
      platform: Platform.NEXT_PAGE,
      locale: `${locale}-GLOBAL` as never,
      request,
    },
    logger,
  );

  if (user.isPublic || !user.id) {
    return Response.redirect(`${url.origin}/${locale}/user/login`, 302);
  }

  // State = userId (simple - Google validates redirect_uri, that's enough CSRF protection)
  const state = Buffer.from(user.id).toString("base64url");
  const authUrl = buildGoogleAuthUrl(url.origin, state);

  return Response.redirect(authUrl, 302);
}
