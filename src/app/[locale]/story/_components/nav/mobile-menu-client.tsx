"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Menu } from "next-vibe-ui/ui/icons/Menu";
import { X } from "next-vibe-ui/ui/icons/X";
import { Link } from "next-vibe-ui/ui/link";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { ThemeToggleMobile } from "../../../_components/theme-toggle";
import type { BadgeVariant } from "next-vibe-ui/ui/badge";

import type { NavItemType } from "./nav-constants";

interface MobileMenuClientProps {
  locale: CountryLanguage;
  navigationItems: NavItemType[];
}

// Helper function to get badge classes based on variant

function getBadgeClasses(variant: BadgeVariant | null): string {
  const VARIANT_STYLES = {
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background text-foreground",
    default: "bg-primary text-primary-foreground",
    notification: "bg-blue-500 text-white",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    info: "bg-info text-info-foreground",
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
    case "success":
      return VARIANT_STYLES.success;
    case "warning":
      return VARIANT_STYLES.warning;
    case "info":
      return VARIANT_STYLES.info;
    default:
      // Handles "secondary", null, undefined, and any other cases
      return VARIANT_STYLES.secondary;
  }
}

export function MobileMenuClient({
  locale,
  navigationItems,
}: MobileMenuClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return (): void => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen, closeMenu]);

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
        aria-label={t("common.accessibility.srOnly.toggleMenu")}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isMenuOpen && (
        <Div
          className="fixed inset-0 top-16 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <MotionDiv
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] bg-background md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Div className="container py-6 flex flex-col gap-6 px-4">
              {/* Theme toggle inside mobile menu */}
              <ThemeToggleMobile locale={locale} />

              {/* Dynamic Navigation items */}
              <Div className="flex flex-col gap-3">
                {navigationItems.map((item) => {
                  if (item.children) {
                    // Dropdown item with children
                    const isExpanded = expandedItems[item.title] ?? false;
                    return (
                      <Div key={item.title}>
                        {/* Parent item header */}
                        <Div
                          className="flex flex flex-row gap-2 pb-4 border-b text-base font-medium hover:text-primary transition-colors py-2 cursor-pointer"
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
                          <Div className="pl-7 flex flex-col gap-3 mb-4">
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
                  }
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
                })}
              </Div>
            </Div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
