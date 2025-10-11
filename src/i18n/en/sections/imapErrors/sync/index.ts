import { accountTranslations } from "./account";
import { errorTranslations } from "./error";
import { folderTranslations } from "./folder";
import { getTranslations } from "./get";
import { messageTranslations } from "./message";
import { postTranslations } from "./post";
import { successTranslations } from "./success";

export const syncTranslations = {
  account: accountTranslations,
  error: errorTranslations,
  folder: folderTranslations,
  get: getTranslations,
  message: messageTranslations,
  post: postTranslations,
  success: successTranslations,
  failed: "IMAP synchronization failed",
};
