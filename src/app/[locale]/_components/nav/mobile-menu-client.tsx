"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "next-vibe/shared/utils";
import { Div, Span } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { ChevronDown, ChevronUp, Menu, X } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { NavItemType } from "./nav-constants";
import { ThemeToggleMobile } from "./theme-toggle";

interface MobileMenuClientProps {
  locale: CountryLanguage;
  navigationItems: NavItemType[];
}

// Helper function to get badge classes based on variant

function getBadgeClasses(
  variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "notification"
    | null
    | undefined,
): string {
  const VARIANT_STYLES = {
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background text-foreground",
    default: "bg-primary text-primary-foreground",
    notification: "bg-blue-500 text-white",
    secondary: "bg-secondary text-secondary-foreground",
  } as const;

  switch (variant) {
    case "destructive":
      return VARIANT_STYLES.destructive;
    case "outline":
      return VARIANT_STYLES.outline;
    case "default":
      return VARIANT_STYLES.default;
    case "notification":
      return VARIANT_STYLES.notification;
    case "secondary":
    case null:
    case undefined:
    default:
      return VARIANT_STYLES.secondary;
  }
}

export function MobileMenuClient({
  locale,
  navigationItems,
}: MobileMenuClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (itemTitle: string): void => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={t("app.common.accessibility.srOnly.toggleMenu")}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed h-[80vh] inset-0 top-16 z-50 bg-background/98 backdrop-blur-sm md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Div className="container py-6 space-y-6 px-4">
              {/* Theme toggle inside mobile menu */}
              <ThemeToggleMobile locale={locale} />

              {/* Dynamic Navigation items */}
              <Div className="space-y-3">
                {navigationItems.map((item) => {
                  if (item.children) {
                    // Dropdown item with children
                    const isExpanded = expandedItems[item.title] ?? false;
                    return (
                      <Div key={item.title}>
                        {/* Parent item header */}
                        <Div
                          className="flex space-x-2 pb-4 border-b text-base font-medium hover:text-primary transition-colors py-2 cursor-pointer"
                          onClick={() => toggleDropdown(item.title)}
                        >
                          <Span className="my-auto">{item.icon}</Span>
                          <Span className="text-base font-medium my-auto flex-1">
                            {t(item.title)}
                          </Span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 my-auto" />
                          ) : (
                            <ChevronDown className="h-4 w-4 my-auto" />
                          )}
                        </Div>

                        {/* Children items */}
                        {isExpanded && (
                          <Div className="pl-7 space-y-3 mb-4">
                            {item.children.map((childItem) => {
                              const isChildDisabled = childItem.disabled;
                              const childDisabledReason =
                                childItem.disabledReason;
                              const isChildActive = childItem.isActive;
                              const childBadge = childItem.badge;
                              const childBadgeVariant = childItem.badgeVariant;
                              const childBadgePayload =
                                childItem.badgeTranslationPayload;

                              if (isChildDisabled && childDisabledReason) {
                                return (
                                  <Div
                                    key={childItem.title}
                                    className="relative"
                                  >
                                    <Div
                                      className={cn(
                                        "text-base flex items-center py-1 opacity-50 cursor-not-allowed",
                                        isChildActive && "text-primary",
                                      )}
                                    >
                                      <Span className="mr-2">
                                        {childItem.icon}
                                      </Span>
                                      <Div className="flex-1">
                                        <Div className="flex items-center">
                                          <Span>{t(childItem.title)}</Span>
                                          {childBadge && (
                                            <Span
                                              className={cn(
                                                "ml-2 px-2 py-0.5 text-xs rounded",
                                                getBadgeClasses(
                                                  childBadgeVariant,
                                                ),
                                              )}
                                            >
                                              {t(childBadge, childBadgePayload)}
                                            </Span>
                                          )}
                                        </Div>
                                        <Div className="text-xs text-gray-500 dark:text-gray-400">
                                          {t(childItem.description)}
                                        </Div>
                                      </Div>
                                    </Div>
                                    <Div className="text-xs text-muted-foreground mt-1 pl-6">
                                      {t(childDisabledReason)}
                                    </Div>
                                  </Div>
                                );
                              }

                              return (
                                <Link
                                  key={childItem.title}
                                  href={`/${locale}${childItem.href}`}
                                  className={cn(
                                    "text-base flex items-center py-1 hover:text-primary transition-colors",
                                    isChildActive &&
                                      "text-primary font-semibold",
                                  )}
                                  onClick={toggleMenu}
                                >
                                  <Span className="mr-2">{childItem.icon}</Span>
                                  <Div className="flex-1">
                                    <Div className="flex items-center">
                                      <Span>{t(childItem.title)}</Span>
                                      {childBadge && (
                                        <Span
                                          className={cn(
                                            "ml-2 px-2 py-0.5 text-xs rounded",
                                            getBadgeClasses(childBadgeVariant),
                                          )}
                                        >
                                          {t(childBadge, childBadgePayload)}
                                        </Span>
                                      )}
                                    </Div>
                                    <Div className="text-xs text-gray-500 dark:text-gray-400">
                                      {t(childItem.description)}
                                    </Div>
                                  </Div>
                                </Link>
                              );
                            })}
                          </Div>
                        )}
                      </Div>
                    );
                  } else {
                    // Single navigation item
                    const isDisabled = item.disabled;
                    const disabledReason = item.disabledReason;
                    const isActive = item.isActive;
                    const badge = item.badge;
                    const badgeVariant = item.badgeVariant;
                    const badgePayload = item.badgeTranslationPayload;

                    if (isDisabled && disabledReason) {
                      return (
                        <Div key={item.title} className="relative">
                          <Div
                            className={cn(
                              "flex text-base font-medium py-2 opacity-50 cursor-not-allowed",
                              isActive && "text-primary",
                            )}
                          >
                            <Span className="mr-2.5">{item.icon}</Span>
                            <Span className="flex-1">{t(item.title)}</Span>
                            {badge && (
                              <Span
                                className={cn(
                                  "ml-2 px-2 py-0.5 text-xs rounded",
                                  getBadgeClasses(badgeVariant),
                                )}
                              >
                                {t(badge, badgePayload)}
                              </Span>
                            )}
                          </Div>
                          <Div className="text-xs text-muted-foreground mt-1 pl-7">
                            {t(disabledReason)}
                          </Div>
                        </Div>
                      );
                    }

                    return (
                      <Link
                        key={item.title}
                        href={`/${locale}${item.href}`}
                        className={cn(
                          "flex text-base font-medium hover:text-primary transition-colors py-2",
                          isActive && "text-primary font-semibold",
                        )}
                        onClick={toggleMenu}
                      >
                        <Span className="mr-2.5">{item.icon}</Span>
                        <Span className="flex-1">{t(item.title)}</Span>
                        {badge && (
                          <Span
                            className={cn(
                              "ml-2 px-2 py-0.5 text-xs rounded",
                              getBadgeClasses(badgeVariant),
                            )}
                          >
                            {t(badge, badgePayload)}
                          </Span>
                        )}
                      </Link>
                    );
                  }
                })}
              </Div>
            </Div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
