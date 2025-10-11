/**
 * Form auto-prefill types and configurations
 */

export interface AutoPrefillConfig {
  /** Enable auto-prefill from server data (default: true) */
  autoPrefill?: boolean;
  /** Enable auto-prefill from local storage (default: true) */
  autoPrefillFromLocalStorage?: boolean;
  /** Show unsaved changes alert when form is dirty (default: true) */
  showUnsavedChangesAlert?: boolean;
  /** Clear local storage after successful submit (default: true in production, false in dev) */
  clearStorageAfterSubmit?: boolean;
}

export interface FormDataSources<T> {
  /** Default values from form configuration */
  defaultValues?: Partial<T>;
  /** Server data from API response */
  serverData?: T;
  /** Local storage data (unsaved changes) */
  localStorageData?: Partial<T>;
  /** Initial state override */
  initialState?: Partial<T>;
}

export interface FormDataPriority<T> {
  /** Final merged data to use for form */
  finalData: Partial<T>;
  /** Source that was used for the data */
  dataSource: "default" | "server" | "localStorage" | "initialState";
  /** Whether local storage data was used (indicates unsaved changes) */
  hasUnsavedChanges: boolean;
}
