import { createPageWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/app/[locale]/user/(account)/referral/page"),
);
