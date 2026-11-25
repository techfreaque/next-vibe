/**
 * Model changelog URLs. Kept apart from model-changelog.ts so client bundles
 * (the /models index) can link the changelog without pulling in the history.
 */

/** Locale-less path of the changelog page. */
export const MODEL_CHANGELOG_PATH = "/models/changelog";

/** Root feed route (src/_pages/_root/models-changelog.xml). */
export const MODEL_CHANGELOG_FEED_PATH = "/models-changelog.xml";
