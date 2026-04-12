export const SKILLS_LIST_ALIAS = "skills" as const;
export const SKILL_CREATE_ALIAS = "skill-create" as const;
export const SKILL_DELETE_ALIAS = "skill-delete" as const;
export const SKILL_UPDATE_ALIAS = "skill-update" as const;
export const SKILL_GET_ALIAS = "skill-get" as const;
export const SKILL_VOTE_ALIAS = "skill-vote" as const;
export const SKILL_REPORT_ALIAS = "skill-report" as const;
export const SKILL_PUBLISH_ALIAS = "skill-publish" as const;
export const SKILL_MODERATION_ALIAS = "skill-moderation" as const;
export const NO_SKILL_ID = "default";
export const SKILL_CREATOR_ID = "skill-creator" as const;

/** Auto-upgrade threshold: vote_count >= this → trust_level = VERIFIED */
export const SKILL_VERIFIED_VOTE_THRESHOLD = 10;
/** Auto-hide threshold: report_count >= this → status = UNLISTED */
export const SKILL_AUTO_HIDE_REPORT_THRESHOLD = 5;
