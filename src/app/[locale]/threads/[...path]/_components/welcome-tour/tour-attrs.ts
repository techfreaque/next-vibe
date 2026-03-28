// Data-tour attribute constants - no JSX/React imports so this is safe
// to import from API-layer widgets without creating circular dependencies.

export const TOUR_DATA_ATTRS = {
  MODEL_SELECTOR: "model-selector",
  MODEL_SELECTOR_FAVORITES: "model-selector-favorites",
  MODEL_SELECTOR_SHOW_ALL: "model-selector-show-all",
  MODEL_SELECTOR_SEARCH: "model-selector-search",
  MODEL_SELECTOR_GROUP: "model-selector-group",
  SKILL_SELECTOR: "skill-selector",
  SKILL_SELECTOR_FAVORITES: "skill-selector-favorites",
  SKILL_SELECTOR_SHOW_ALL: "skill-selector-show-all",
  SKILL_SELECTOR_SEARCH: "skill-selector-search",
  SKILL_SELECTOR_GROUP: "skill-selector-group",
  SIDEBAR_TOGGLE: "sidebar-toggle",
  ROOT_FOLDERS: "root-folders",
  INCOGNITO_FOLDER: "incognito-folder",
  PUBLIC_FOLDER: "public-folder",
  PRIVATE_FOLDER: "private-folder",
  SHARED_FOLDER: "shared-folder",
  NEW_CHAT_BUTTON: "new-chat-button",
  SIDEBAR_LOGIN: "sidebar-login",
  SUBSCRIPTION_BUTTON: "subscription-button",
  CHAT_INPUT: "chat-input",
  SPEECH_INPUT: "speech-input",
  CALL_MODE_BUTTON: "call-mode-button",
  // Favorites selector - post-onboarding tour steps
  FAVORITES_COMPANION_GROUP: "favorites-companion-group",
  FAVORITES_BROWSE_SKILLS: "favorites-browse-skills",
} as const;

export type TourDataAttr =
  (typeof TOUR_DATA_ATTRS)[keyof typeof TOUR_DATA_ATTRS];

export const getTourSelector = (attr: TourDataAttr): string => {
  return `[data-tour="${attr}"]`;
};

export const getFolderTourAttr = (
  folderId: string,
): TourDataAttr | undefined => {
  const folderMap: Record<string, TourDataAttr> = {
    private: TOUR_DATA_ATTRS.PRIVATE_FOLDER,
    shared: TOUR_DATA_ATTRS.SHARED_FOLDER,
    public: TOUR_DATA_ATTRS.PUBLIC_FOLDER,
    incognito: TOUR_DATA_ATTRS.INCOGNITO_FOLDER,
  };
  return folderMap[folderId];
};
