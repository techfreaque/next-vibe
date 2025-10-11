import type { streamingErrorsTranslations as EnglishStreamingErrorsTranslations } from "../../../en/sections/streamingErrors";
import { aiStreamTranslations } from "./aiStream";
import { basicStreamTranslations } from "./basicStream";

export const streamingErrorsTranslations: typeof EnglishStreamingErrorsTranslations =
  {
    aiStream: aiStreamTranslations,
    basicStream: basicStreamTranslations,
  };
