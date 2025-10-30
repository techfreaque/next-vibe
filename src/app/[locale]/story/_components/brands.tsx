"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface BrandsProps {
  locale: CountryLanguage;
}

export function BrandsSection({ locale }: BrandsProps): JSX.Element {
  // TODO remove this once we have polish examples
  if (locale.startsWith("pl")) {
    return <></>;
  }
  return (
    <section
      id="brands"
      className="w-full py-12 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
    >
      <Brands locale={locale} />
    </section>
  );
}

export function Brands({ locale }: BrandsProps): JSX.Element {
  const { t } = simpleT(locale);
  const brands: Brand[] = [
    {
      name: "app.story._components.home.brands.brand1.name",
      className: "app.story._components.home.brands.brand1.className",
      logo: "app.story._components.home.brands.brand1.logo",
      link: "app.story._components.home.brands.brand1.link",
    },
    {
      name: "app.story._components.home.brands.brand2.name",
      className: "app.story._components.home.brands.brand2.className",
      logo: "app.story._components.home.brands.brand2.logo",
      link: "app.story._components.home.brands.brand2.link",
    },
    {
      name: "app.story._components.home.brands.brand3.name",
      logo: "app.story._components.home.brands.brand3.logo",
      link: "app.story._components.home.brands.brand3.link",
    },
    {
      name: "app.story._components.home.brands.brand4.name",
      className: "app.story._components.home.brands.brand4.className",
      logo: "app.story._components.home.brands.brand4.logo",
      link: "app.story._components.home.brands.brand4.link",
    },
    {
      name: "app.story._components.home.brands.brand5.name",
      className: "app.story._components.home.brands.brand5.className",
      logo: "app.story._components.home.brands.brand5.logo",
      link: "app.story._components.home.brands.brand5.link",
    },
    {
      name: "app.story._components.home.brands.brand6.name",
      className: "app.story._components.home.brands.brand6.className",
      logo: "app.story._components.home.brands.brand6.logo",
      link: "app.story._components.home.brands.brand6.link",
    },
    {
      name: "app.story._components.home.brands.brand7.name",
      logo: "app.story._components.home.brands.brand7.logo",
      link: "app.story._components.home.brands.brand7.link",
    },
  ];

  return (
    <div className="container px-4 md:px-6" id="brands">
      <div className="text-center mb-8">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("app.story._components.home.brands.title")}
        </p>
      </div>
      <motion.div
        className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {brands.map((brand, index) => (
          <button
            key={index}
            onClick={() => {
              window.open(t(brand.link), "_blank", "noopener,noreferrer");
            }}
            className={cn(
              brand.className ? t(brand.className) : "",

              "flex items-center justify-center bg-transparent border-none p-0 cursor-pointer",
            )}
          >
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="transition-all duration-300 grayscale opacity-70 hover:grayscale-0 hover:opacity-100">
                <Image
                  src={t(brand.logo)}
                  alt={t(brand.name)}
                  width={120}
                  height={40}
                />
              </div>
            </motion.div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

interface Brand {
  name: TranslationKey;
  logo: TranslationKey;
  link: TranslationKey;
  className?: TranslationKey;
}
