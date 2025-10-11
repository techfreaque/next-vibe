"use client";

import { motion } from "framer-motion";
import type { JSX } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface Stat {
  value: number;
  suffix: string;
  title: string;
}

/**
 * Stats component displays key performance metrics in a visually appealing grid.
 *
 * TODO: Implement dynamic stats fetching from API instead of hardcoded values
 * TODO: Add customization options for colors, animations, and layout
 */
export function Stats({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = simpleT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats: Stat[] = [
    {
      value: 500,
      suffix: "+",
      title: t("pages.home.stats.clients"),
    },
    {
      value: 15000,
      suffix: "+",
      title: t("pages.home.stats.posts"),
    },
    {
      value: 300,
      suffix: "%",
      title: t("pages.home.stats.growth"),
    },
  ];

  return (
    <section
      className="py-20 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 md:px-6 w-full"
      ref={ref}
    >
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {inView ? <CountUp end={stat.value} duration={2.5} /> : 0}
                {stat.suffix}
              </div>
              <p className="text-blue-100">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
