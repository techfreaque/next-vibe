import { createPageWrapperWithImport } from "@/app/api/[locale]/system/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () => import("@/app/[locale]/story/blog/referral-for-beginners/page"),
);
