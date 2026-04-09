import "server-only";

import { exchangeCodeForTokens } from "../../oauth-helpers";
import { GoogleSheetsCredentialsRepository } from "../../repository";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const locale = url.pathname.split("/")[2] ?? "en";

  const settingsUrl = `${url.origin}/${locale}/user/settings`;

  if (error || !code || !state) {
    return Response.redirect(`${settingsUrl}?gs_error=1`, 302);
  }

  const userId = Buffer.from(state, "base64url").toString("utf8");
  if (!userId || userId.length < 10) {
    return Response.redirect(`${settingsUrl}?gs_error=1`, 302);
  }

  const tokens = await exchangeCodeForTokens(code, url.origin);

  if (!tokens) {
    return Response.redirect(`${settingsUrl}?gs_error=1`, 302);
  }

  if (!tokens.refresh_token) {
    return Response.redirect(`${settingsUrl}?gs_error=no_refresh_token`, 302);
  }

  const expiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await GoogleSheetsCredentialsRepository.saveOAuthCredentials(userId, {
    googleAccessToken: tokens.access_token,
    googleRefreshToken: tokens.refresh_token,
    googleTokenExpiry: expiry,
  });

  return Response.redirect(`${settingsUrl}?gs_connected=1`, 302);
}
