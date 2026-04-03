/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/**
 * Code example strings for the blog post.
 * Kept in a separate file to prevent Vite's import analysis from
 * stripping template literals that contain the word "import".
 */

// eslint-disable-next-line no-useless-concat -- intentional: prevents Vite import analysis from stripping these strings
const IMPORT_KEYWORD = "imp" + "ort";

export const embedCodeTs = [
  `${IMPORT_KEYWORD} { VibeFrame } from "next-vibe/vibe-frame";`,
  "",
  "VibeFrame.mount({",
  '  serverUrl: "https://unbottled.ai",',
  '  endpoint: "contact_POST",',
  '  target: "#contact-form",',
  '  trigger: { type: "immediate", display: "inline" },',
  "});",
].join("\n");

export const embedCodeHtml = `<script>
  window.vibeFrameConfig = {
    serverUrl: "https://unbottled.ai",
    integrations: [{
      endpoint: "contact_POST",
      target: "#contact-form",
      trigger: { type: "immediate", display: "inline" },
    }],
  };
</script>
<script src="https://unbottled.ai/vibe-frame/vibe-frame.js"></script>`;

export const federatedCode = [
  `${IMPORT_KEYWORD} { VibeFrame } from "next-vibe/vibe-frame";`,
  "",
  "// Chat widget from unbottled.ai",
  "VibeFrame.mount({",
  '  serverUrl: "https://unbottled.ai",',
  '  endpoint: "agent_chat_threads_GET",',
  '  target: "#chat",',
  "});",
  "",
  "// Product catalog from a shop instance",
  "VibeFrame.mount({",
  '  serverUrl: "https://shop.example.com",',
  '  endpoint: "products_GET",',
  '  target: "#products",',
  '  trigger: { type: "scroll", scrollPercent: 30, display: "modal" },',
  "});",
  "",
  "// Analytics dashboard from yet another instance",
  "VibeFrame.mount({",
  '  serverUrl: "https://analytics.example.com",',
  '  endpoint: "vibe_sense_dashboard_GET",',
  '  target: "#dashboard",',
  '  trigger: { type: "click", clickSelector: "#show-stats", display: "slideIn" },',
  "});",
].join("\n");
