/**
 * Visible breadcrumb trail for public pages. Pair it with the matching
 * BreadcrumbList JSON-LD (buildBreadcrumbList / buildBlogPostStructuredData)
 * so crawlers and readers see the same hierarchy.
 */

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "next-vibe/ui/components/breadcrumb";
import { Link } from "next-vibe/ui/components/link";
import { Fragment, type JSX } from "react";

export interface BreadcrumbTrailItem {
  name: string;
  /** Localized href; omit on the current page (always the last item). */
  href?: string;
}

export function BreadcrumbTrail({
  items,
  className,
}: {
  items: readonly BreadcrumbTrailItem[];
  className?: string;
}): JSX.Element {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="gap-y-0 sm:gap-x-2">
        {items.map((item, index) => (
          <Fragment key={item.href ?? item.name}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="min-w-0">
              {item.href === undefined ? (
                <BreadcrumbPage className="line-clamp-1 text-foreground/80">
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center font-medium"
                  >
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
