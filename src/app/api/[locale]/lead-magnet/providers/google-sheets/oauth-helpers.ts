/**
 * Google Sheets OAuth helpers
 * Handles OAuth URL construction, state token generation, and token exchange
 */
import "server-only";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

function getClientId(): string {
  return process.env["GOOGLE_SHEETS_CLIENT_ID"] ?? "";
}

function getClientSecret(): string {
  return process.env["GOOGLE_SHEETS_CLIENT_SECRET"] ?? "";
}

function getRedirectUri(baseUrl: string): string {
  const override = process.env["GOOGLE_SHEETS_REDIRECT_URI"];
  if (override) {
    return override;
  }
  return `${baseUrl}/api/en/lead-magnet/providers/google-sheets/oauth/callback`;
}

export function buildGoogleAuthUrl(baseUrl: string, state: string): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(baseUrl),
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(
  code: string,
  baseUrl: string,
): Promise<GoogleTokenResponse | null> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: getRedirectUri(baseUrl),
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; expiry: string } | null> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GoogleTokenResponse;
  const expiry = new Date(Date.now() + data.expires_in * 1000).toISOString();

  return { accessToken: data.access_token, expiry };
}

export interface GoogleSpreadsheet {
  id: string;
  name: string;
}

export async function listSpreadsheets(
  accessToken: string,
): Promise<GoogleSpreadsheet[]> {
  const params = new URLSearchParams({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: "files(id,name)",
    orderBy: "modifiedTime desc",
    pageSize: "50",
  });

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    files: Array<{ id: string; name: string }>;
  };
  return data.files ?? [];
}

export async function appendRowToSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetTab: string,
  values: string[],
): Promise<boolean> {
  const range = sheetTab ? `${sheetTab}!A:Z` : "A:Z";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append`;

  const response = await fetch(`${url}?valueInputOption=USER_ENTERED`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [values],
    }),
  });

  return response.ok;
}
