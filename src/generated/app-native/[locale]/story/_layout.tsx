import { createLayoutWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createLayoutWrapperWithImport(
  () => import("@/_pages/story/layout"),
);
