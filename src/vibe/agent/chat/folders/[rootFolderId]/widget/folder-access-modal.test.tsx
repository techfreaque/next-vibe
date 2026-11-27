import { beforeAll, describe, expect, it, mock } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { scopedTranslation } from "../i18n";
import type {
  FOLDER_ACCESS_CONTENT as FolderAccessContentType,
  FolderAccessModal as FolderAccessModalType,
  getFolderAccessContent as GetFolderAccessContentType,
} from "./folder-access-modal";

const ALL_LOCALES: readonly CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
  "sk-SK",
];

const ALL_ROOT_FOLDERS: readonly DefaultFolderId[] =
  Object.values(DefaultFolderId);

let FolderAccessModal: typeof FolderAccessModalType;
let FOLDER_ACCESS_CONTENT: typeof FolderAccessContentType;
let getFolderAccessContent: typeof GetFolderAccessContentType;

beforeAll(async () => {
  // Radix Dialog renders into a browser portal, which produces empty SSR markup
  // in Bun. Stub only the Dialog shell so FolderAccessModal's real rendered
  // tree (title, requiresAccount description, explanation, and auth links)
  // is verified end-to-end.
  void mock.module("next-vibe/ui/components/dialog", () => ({
    Dialog: ({
      open,
      children,
    }: {
      open?: boolean;
      children?: ReactNode;
    }): ReactNode => (open ? <div role="dialog">{children}</div> : null),
    DialogContent: ({ children }: { children?: ReactNode }): ReactNode => (
      <div>{children}</div>
    ),
    DialogHeader: ({ children }: { children?: ReactNode }): ReactNode => (
      <header>{children}</header>
    ),
    DialogFooter: ({ children }: { children?: ReactNode }): ReactNode => (
      <footer>{children}</footer>
    ),
    DialogTitle: ({ children }: { children?: ReactNode }): ReactNode => (
      <h2>{children}</h2>
    ),
    DialogDescription: ({ children }: { children?: ReactNode }): ReactNode => (
      <p data-part="description">{children}</p>
    ),
  }));

  ({ FolderAccessModal, FOLDER_ACCESS_CONTENT, getFolderAccessContent } =
    await import("./folder-access-modal"));
});

function decodeHtmlEntities(text: string): string {
  return text
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

describe("FolderAccessModal (guest root-folder access dialog)", () => {
  it("maps every DefaultFolderId in FOLDER_ACCESS_CONTENT", () => {
    for (const folderId of ALL_ROOT_FOLDERS) {
      expect(FOLDER_ACCESS_CONTENT[folderId]).toBeDefined();
    }
  });

  for (const locale of ALL_LOCALES) {
    describe(`locale ${locale}`, () => {
      for (const folderId of ALL_ROOT_FOLDERS) {
        it(`renders non-empty localized copy for root folder "${folderId}"`, () => {
          const { t } = scopedTranslation.scopedT(locale);
          const content = getFolderAccessContent(folderId, t);

          expect(content.title.trim().length).toBeGreaterThan(0);
          expect(content.title).not.toBe(t("widget.accessModal.title"));
          expect(content.folderName.trim().length).toBeGreaterThan(0);
          expect(content.explanation.trim().length).toBeGreaterThan(20);

          const html = decodeHtmlEntities(
            renderToStaticMarkup(
              <FolderAccessModal
                open
                onOpenChange={() => undefined}
                folderId={folderId}
                locale={locale}
              />,
            ),
          );

          expect(html).toContain(`<h2>${content.title}</h2>`);
          expect(html).toContain(content.folderName);
          expect(html).toContain(content.explanation);

          // No missing interpolation, empty folder name gap, raw keys, or em dashes
          expect(html).not.toContain("{{");
          expect(html).not.toContain("To access ,");
          expect(html).not.toContain("widget.accessModal.");
          expect(html).not.toContain("widget.common.");
          expect(html).not.toContain("\u2014");

          // Guest auth actions point to locale-prefixed routes
          expect(html).toContain(`href="/${locale}/user/login"`);
          expect(html).toContain(`href="/${locale}/user/signup"`);
        });
      }
    });
  }

  it("renders specific Background and Remote copy in English", () => {
    const backgroundHtml = decodeHtmlEntities(
      renderToStaticMarkup(
        <FolderAccessModal
          open
          onOpenChange={() => undefined}
          folderId={DefaultFolderId.BACKGROUND}
          locale="en-US"
        />,
      ),
    );
    expect(backgroundHtml).toContain("Background Threads");
    expect(backgroundHtml).toContain(
      "To access Background Threads, you need to create an account or sign in.",
    );
    expect(backgroundHtml).toContain("sub-agents");

    const remoteHtml = decodeHtmlEntities(
      renderToStaticMarkup(
        <FolderAccessModal
          open
          onOpenChange={() => undefined}
          folderId={DefaultFolderId.REMOTE}
          locale="en-US"
        />,
      ),
    );
    expect(remoteHtml).toContain("Remote Threads");
    expect(remoteHtml).toContain(
      "To access Remote Threads, you need to create an account or sign in.",
    );
    expect(remoteHtml).toContain("connected instances");
  });
});
