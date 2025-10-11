"use client";

import {
  BookOpen,
  Clock,
  Code2,
  Database,
  FileText,
  GitBranch,
  Globe,
  Home,
  Layers,
  Mail,
  Package,
  Rocket,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX, ReactNode } from "react";

const navigation = [
  { name: "Overview", href: "/vibe", icon: Home },
  { name: "Architecture", href: "/vibe/architecture", icon: Layers },
  { name: "Getting Started", href: "/vibe/getting-started", icon: Rocket },
  { name: "CLI Tools", href: "/vibe/cli-tools", icon: Terminal },
  { name: "Data-Driven UI", href: "/vibe/data-driven-ui", icon: Code2 },
  { name: "Database", href: "/vibe/database", icon: Database },
  { name: "Background Jobs", href: "/vibe/background-jobs", icon: Clock },
  { name: "Communications", href: "/vibe/communications", icon: Mail },
  { name: "i18n", href: "/vibe/i18n", icon: Globe },
  { name: "Type Safety", href: "/vibe/type-safety", icon: Shield },
  { name: "Development", href: "/vibe/development-loop", icon: Zap },
  { name: "Remote CLI", href: "/vibe/remote-cli", icon: GitBranch },
  { name: "Vibe Guard", href: "/vibe/vibe-guard", icon: Shield },
  { name: "Builder", href: "/vibe/builder-release", icon: Package },
  { name: "Examples", href: "/vibe/examples", icon: FileText },
  { name: "Docs", href: "/vibe/docs", icon: BookOpen },
];

function VibeNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

interface VibeLayoutProps {
  children: ReactNode;
}

export default function VibeLayout({ children }: VibeLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative">
          <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/vibe"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Zap className="h-8 w-8 text-purple-400" />
                  <h1 className="text-2xl font-bold text-white">
                    Vibe Framework
                  </h1>
                </Link>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-300 hidden md:block">
                    One Code, Every Interface
                  </p>
                  <Link
                    href="/"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Site
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <VibeNav />
          {children}
        </div>
      </div>
    </div>
  );
}
