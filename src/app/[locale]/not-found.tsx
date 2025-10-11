import type { JSX } from "react";

import Loading from "./loading";

/**
 * This route should not get hit as we have localized versions of the not found page.
 * Its just here to get rid of some console errors.
 *
 * @returns JSX Element
 */
export default function NotFound(): JSX.Element {
  return <Loading />;
}
