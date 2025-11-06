"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton, useActiveWalletChain } from "thirdweb/react";
import { client } from "@/components/providers/thirdweb-provider";
import { polygon } from "thirdweb/chains";
import { Rocket, MessageCircle, Menu, X } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const activeChain = useActiveWalletChain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCopilotActive = pathname === "/" || pathname === "/copilot";
  const isChatActive = pathname === "/chat";

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

        {/* Navigation Links - Centered (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isCopilotActive
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Rocket className="w-4 h-4" />
            Copilot
          </Link>
          <Link
            href="/chat"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isChatActive
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Link>
        </div>

        {/* Desktop Connect Button */}
        <div className="hidden md:block flex-shrink-0">
          <ConnectButton client={client} chain={activeChain || polygon} />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto p-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isCopilotActive
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Rocket className="w-5 h-5" />
              Copilot
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isChatActive
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Chat
            </Link>
            <div className="pt-2">
              <ConnectButton client={client} chain={activeChain || polygon} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
