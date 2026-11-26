/** Each alternative lists all env keys required by that kind of local configuration. */
export const bankFeedAvailability = {
  configuredWhen: [
    ["ENABLE_BANKING_APP_ID", "ENABLE_BANKING_PRIVATE_KEY"],
    ["ENABLE_BANKING_APP_ID", "ENABLE_BANKING_PRIVATE_KEY_FILE"],
  ],
};
