"use client";

import { useState } from "react";
import { TrendingUp, Lightbulb, Zap, Search, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionType =
  | "analyze-portfolio"
  | "suggest-strategies"
  | "optimize-yields"
  | "discover-opportunities"
  | "copy-trade";

export interface ActionPillBarProps {
  onActionSelect?: (action: ActionType, prompt: string) => void;
  activeAction?: ActionType;
}

const actions: Array<{
  id: ActionType;
  icon: React.ReactNode;
  label: string;
  prompt: string;
}> = [
  {
    id: "analyze-portfolio",
    icon: <TrendingUp className="w-3 h-3" />,
    label: "Analyze Portfolio",
    prompt:
      "Analyze my portfolio. Scan my wallet, detect idle assets, risk exposure, and yield sources.",
  },
  {
    id: "suggest-strategies",
    icon: <Lightbulb className="w-3 h-3" />,
    label: "Suggest Strategies",
    prompt:
      "Suggest DeFi strategies based on my current holdings and preferences. Design 2-3 optimal DeFi moves with APY estimates.",
  },
  {
    id: "optimize-yields",
    icon: <Zap className="w-3 h-3" />,
    label: "Optimize Yields",
    prompt:
      "Optimize my yields. Run yield optimizer and smart routing engine to find better routes and opportunities.",
  },
  {
    id: "discover-opportunities",
    icon: <Search className="w-3 h-3" />,
    label: "Discover Opportunities",
    prompt:
      "Discover new opportunities. Show me trending Polygon protocols, new farms, and high-yield pools.",
  },
  {
    id: "copy-trade",
    icon: <Copy className="w-3 h-3" />,
    label: "Copy Trade",
    prompt:
      "Show me top wallet strategies to mirror. Find wallets with successful DeFi positions that I could copy.",
  },
];

export function ActionPillBar({
  onActionSelect,
  activeAction,
}: ActionPillBarProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(
    activeAction || null
  );

  const handleActionClick = (action: (typeof actions)[0]) => {
    const newSelectedAction = selectedAction === action.id ? null : action.id;
    setSelectedAction(newSelectedAction);

    if (onActionSelect && newSelectedAction) {
      onActionSelect(action.id, action.prompt);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-1.5 justify-center px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        {actions.map((action) => {
          const isActive = selectedAction === action.id;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150",
                "hover:opacity-80 active:opacity-70",
                isActive
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <span className={cn("w-3 h-3", isActive ? "text-white" : "")}>
                {action.icon}
              </span>
              <span className="whitespace-nowrap">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
