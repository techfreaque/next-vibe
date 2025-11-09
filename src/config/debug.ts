// this only affects local development

// using constants to avoid eslint warnings  in other places
const _true = true as boolean;
const _false = false as boolean;

export const enableDebugLogger = _true;
export const debugCli = _false;
export const debugCron = _false;
export const debugMiddleware = _false;
export const debugApp = enableDebugLogger;
export const debugLibrary = _true;
export const translationsKeyMode = _false;

// Form clearing behavior in development
export const clearFormsAfterSuccessInDev = _false;
