"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton, useActiveWalletChain } from "thirdweb/react";
import { client } from "@/components/providers/thirdweb-provider";
import { polygon } from "thirdweb/chains";

export function Navigation() {
  const pathname = usePathname();
  const activeChain = useActiveWalletChain();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto relative flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img
                src="/polypuff.svg"
                alt="Polypuff"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Polypuff
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/" || pathname === "/copilot"
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Copilot
          </Link>
          <Link
            href="/chat"
            className={`text-sm font-medium transition-colors ${
              pathname === "/chat"
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Chat
          </Link>
        </div>

        {/* Connect Button */}
        <div className="flex-shrink-0">
          <ConnectButton client={client} chain={activeChain || polygon} />
        </div>
      </div>
    </nav>
  );
}
