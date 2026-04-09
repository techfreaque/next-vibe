export const translations = {
  category: "Lead Magnet",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Success",
      failed: "Failed",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "Email (via platform)",
    },
  },
  config: {
    title: "Lead Magnet Config",
    description: "Configure your lead magnet email integration",
    form: {
      title: "Lead Magnet Settings",
      description:
        "Connect your email platform to capture leads from your skill page",
      provider: {
        label: "Email Platform",
        description: "Which email marketing platform do you use?",
      },
      listId: {
        label: "List / Group ID",
        description: "The ID of the list or segment to add leads to (optional)",
      },
      headline: {
        label: "Form Headline",
        description: "The headline shown above the lead capture form",
        placeholder: "Get my AI prompt pack free",
      },
      buttonText: {
        label: "Button Text",
        description: "The text on the submit button",
        placeholder: "Get access →",
      },
      isActive: {
        label: "Active",
        description:
          "Enable or disable the lead magnet form on your skill page",
      },
      credentials: {
        label: "API Credentials",
        description: "Your email platform API credentials (stored encrypted)",
      },
    },
    success: {
      saved: "Lead magnet config saved",
      deleted: "Lead magnet config deleted",
    },
  },
  capture: {
    title: "Join the List",
    description: "Subscribe and get access",
    form: {
      title: "Get Access",
      description: "Enter your details to get access",
      firstName: {
        label: "First name",
        description: "Your first name",
      },
      email: {
        label: "Email address",
        description: "Your email address",
      },
      skillId: {
        label: "Skill ID",
        description: "Internal skill reference",
      },
    },
    success: {
      submitted: "You're in! Check your inbox.",
    },
  },
  errors: {
    providerError: "Email provider error",
  },
  providers: {
    shared: {
      listId: {
        label: "List / Group ID",
        description: "The ID of the list or segment to add leads to",
        placeholder: "e.g. abc123",
      },
      headline: {
        label: "Form Headline",
        description:
          "The headline shown above the lead capture form on your skill page",
        placeholder: "Get my AI prompt pack free",
      },
      buttonText: {
        label: "Button Text",
        description: "The text on the submit button",
        placeholder: "Get access →",
      },
      isActive: {
        label: "Active",
        description: "Enable the lead capture form on your skill page",
      },
      saveTitle: "Save Config",
      saveDescription: "Connect your email platform to capture leads",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Config Saved",
        description: "Your email platform is connected. Leads will flow in.",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Please check your input",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission",
        },
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "A conflict occurred" },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        internal: {
          title: "Server Error",
          description: "An internal error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
      },
      response: {
        provider: "Provider",
        isActive: "Active",
        headline: "Headline",
        buttonText: "Button text",
        listId: "List ID",
      },
    },
    klaviyo: {
      title: "Connect Klaviyo",
      description:
        "Connect your Klaviyo account to capture leads from your skill page",
      klaviyoApiKey: {
        label: "Klaviyo API Key",
        description: "Your private Klaviyo API key",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Connect GetResponse",
      description:
        "Connect your GetResponse account to capture leads from your skill page",
      getresponseApiKey: {
        label: "GetResponse API Key",
        description: "Your GetResponse API key from account settings",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Connect Emarsys",
      description:
        "Connect your Emarsys account to capture leads from your skill page",
      emarsysUserName: {
        label: "Username",
        description: "Your Emarsys API username",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "API Key",
        description: "Your Emarsys API secret key",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Subdomain",
        description: "Your Emarsys API subdomain (e.g. suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Connect Acumbamail",
      description:
        "Connect your Acumbamail account to capture leads from your skill page",
      acumbamailApiKey: {
        label: "API Key",
        description: "Your Acumbamail API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Connect CleverReach",
      description:
        "Connect your CleverReach account to capture leads from your skill page",
      cleverreachClientId: {
        label: "Client ID",
        description: "Your CleverReach OAuth client ID",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Client Secret",
        description: "Your CleverReach OAuth client secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "Group / List ID",
        description: "The ID of the CleverReach group to add contacts to",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "DOI Form ID (optional)",
        description: "Form ID for double opt-in. Leave blank to skip DOI.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Source (optional)",
        description: "Contact source label for tracking",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Connect Connectif",
      description:
        "Connect your Connectif account to capture leads from your skill page",
      connectifApiKey: {
        label: "API Key",
        description: "Your Connectif API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Connect DataNext",
      description:
        "Connect your DataNext account to capture leads from your skill page",
      datanextApiKey: {
        label: "API Key",
        description: "Your DataNext API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "API Secret",
        description: "Your DataNext API secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "Form ID",
        description: "The DataNext form ID for the opt-in form",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "Campaign ID",
        description: "The campaign ID to associate leads with",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Connect Edrone",
      description:
        "Connect your Edrone account to capture leads from your skill page",
      edroneAppId: {
        label: "App ID",
        description: "Your Edrone app ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Connect ExpertSender",
      description:
        "Connect your ExpertSender account to capture leads from your skill page",
      expertSenderApiDomain: {
        label: "API Domain",
        description: "Your ExpertSender API domain",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "API Key",
        description: "Your ExpertSender API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Connect FreshMail",
      description:
        "Connect your FreshMail account to capture leads from your skill page",
      freshmailApiKey: {
        label: "API Key",
        description: "Your FreshMail API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "API Secret",
        description: "Your FreshMail API secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "List Hash",
        description: "The hash of the subscriber list to add leads to",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Connect MailUp",
      description:
        "Connect your MailUp account to capture leads from your skill page",
      mailupClientId: {
        label: "Client ID",
        description: "Your MailUp OAuth client ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Client Secret",
        description: "Your MailUp OAuth client secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Username",
        description: "Your MailUp account username",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Password",
        description: "Your MailUp account password",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "List ID",
        description: "The numeric ID of the list to subscribe contacts to",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Connect Mapp",
      description:
        "Connect your Mapp account to capture leads from your skill page",
      mappUsername: {
        label: "Username",
        description: "Your Mapp API username",
        placeholder: "username",
      },
      mappPassword: {
        label: "Password",
        description: "Your Mapp API password",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Domain",
        description: "Your Mapp API domain",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Connect Sailthru",
      description:
        "Connect your Sailthru account to capture leads from your skill page",
      sailthruApiKey: {
        label: "API Key",
        description: "Your Sailthru API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "API Secret",
        description: "Your Sailthru API secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "List Name",
        description: "The name of the Sailthru list to subscribe contacts to",
        placeholder: "My Subscribers",
      },
    },
    salesmanago: {
      title: "Connect SALESmanago",
      description:
        "Connect your SALESmanago account to capture leads from your skill page",
      salesManagoClientId: {
        label: "Client ID",
        description: "Your SALESmanago client ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "API Key",
        description: "Your SALESmanago API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "Your SALESmanago SHA hash for authentication",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Domain",
        description: "Your SALESmanago API domain",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "Owner Email",
        description: "The owner email for your SALESmanago account",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Connect Shopify",
      description:
        "Connect your Shopify store to capture leads from your skill page",
      shopifyDomain: {
        label: "Store Domain",
        description: "Your Shopify store domain",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Access Token",
        description: "Your Shopify Admin API access token",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Connect Spotler",
      description:
        "Connect your Spotler account to capture leads from your skill page",
      spotlerConsumerKey: {
        label: "Consumer Key",
        description: "Your Spotler API consumer key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Consumer Secret",
        description: "Your Spotler API consumer secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Connect YouLead",
      description:
        "Connect your YouLead account to capture leads from your skill page",
      youLeadAppId: {
        label: "App ID",
        description: "Your YouLead application ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Client ID",
        description: "Your YouLead client ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "App Secret Key",
        description: "Your YouLead application secret key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Connect Adobe Campaign",
      description:
        "Connect your Adobe Campaign account to capture leads from your skill page",
      adobeCampaignOrganizationId: {
        label: "Organization ID",
        description: "Your Adobe IMS Organization ID",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Client ID",
        description: "Your Adobe Campaign API client ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Client Secret",
        description: "Your Adobe Campaign API client secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "API Key",
        description: "Your Adobe Campaign API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "List ID",
        description: "The Adobe Campaign profile list ID to add leads to",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Notify via platform email",
      description:
        "Get an email notification every time someone signs up via your lead magnet",
      notifyEmail: {
        label: "Notification email",
        description: "Where to send lead notifications",
        placeholder: "you@example.com",
      },
      notifyEmailName: {
        label: "Your name",
        description: "Name shown in the notification email",
        placeholder: "Jane",
      },
    },
    googleSheets: {
      title: "Connect Google Sheets",
      description:
        "Append a row to your Google Spreadsheet each time a lead signs up",
      saveTitle: "Save Google Sheets config",
      connect: {
        label: "Connect Google Account",
      },
      connected: {
        description: "Your Google account is connected",
      },
      spreadsheetId: {
        label: "Spreadsheet",
        description: "Select the spreadsheet where leads will be added",
        placeholder: "Select a spreadsheet…",
      },
      sheetTab: {
        label: "Sheet tab (optional)",
        description:
          "The tab name within the spreadsheet. Leave blank to use the first tab.",
        placeholder: "e.g. Leads",
      },
      widget: {
        connectTitle: "Connect Google Sheets",
        connectDescription:
          "Sign in with Google to automatically add every new lead as a row in your spreadsheet.",
        redirectNote:
          "You'll be redirected to Google to grant spreadsheet access.",
        reconnect: "Reconnect",
        loading: "Loading spreadsheets…",
        noSheets: "No spreadsheets found",
        refresh: "Refresh list",
        selectRequired: "Please select a spreadsheet",
        saveFailed: "Failed to save. Please try again.",
        saving: "Saving…",
      },
    },
  },
};
