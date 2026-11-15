export const translations = {
  category: "Referral",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Reassign Referral Code",
    titleShort: "Reassign Code",
    description:
      "Move a referral code to another account. Users it already referred stay attributed to the code, so their future commission goes to the new owner. Past earnings stay with whoever earned them. Dry run by default.",
    fields: {
      code: {
        label: "Referral code",
        description: "The exact code to move",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "New owner",
        description: "User ID or email of the account that gets the code",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Dry run",
        description: "Preview the move without changing anything",
      },
    },
    response: {
      dryRun: "Dry run",
      code: "Code",
      fromUserId: "Previous owner ID",
      fromEmail: "Previous owner",
      toUserId: "New owner ID",
      toEmail: "New owner",
      referralsMoved: "Referred users moved",
      selfReferralsKept: "Self-referrals kept with previous owner",
      linksMoved: "Tracked links moved",
      linksTotal: "Campaign links using the code",
    },
    widget: {
      back: "Back",
      hint: "Commission follows the code owner. Run a dry run first, then turn it off to move the code.",
      submit: "Reassign code",
      preview: "Dry run. Nothing changed.",
      done: "Code moved.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Referral code {{code}} moved from {{from}} to {{to}} by {{admin}} at {{at}}. Referred users moved: {{referrals}}. Tracked links moved: {{links}}. Past earnings unchanged.",
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the code and the new owner",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin to reassign codes",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can reassign referral codes",
    },
    notFound: {
      title: "Not found",
      description: "Code or user does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "The new owner already owns this code",
    },
    server: {
      title: "Server error",
      description: "Could not reassign the code",
    },
    network: {
      title: "Network error",
      description: "Request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
    codeNotFound: "Referral code {{code}} does not exist",
    userNotFound: "No user matches {{target}}",
    alreadyOwner: "{{target}} already owns referral code {{code}}",
  },
  success: {
    title: "Done",
    description: "Referral code reassigned",
  },
};
