import { createPageWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () =>
    import("@/app/[locale]/story/blog/dead-trading-bot-to-monitoring-engine/page"),
);
