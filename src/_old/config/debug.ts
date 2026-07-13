// use 'vibe dev -v' to enable middleware debug logging
export let debugMiddleware = process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true";
// Shows the translation keys in the UI
export const translationsKeyMode = false;
// Form clearing behavior in development
export const clearFormsAfterSuccessInDev = false;
