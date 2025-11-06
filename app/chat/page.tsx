"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import {
  ActionPillBar,
  type ActionType,
} from "@/components/copilot/action-pill-bar";

export default function ChatPage() {
  const [triggerPrompt, setTriggerPrompt] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType | undefined>(
    undefined
  );

  const handleActionSelect = (action: ActionType, prompt: string) => {
    setActiveAction(action);
    // Add a timestamp to make each trigger unique, allowing the same action to be triggered multiple times
    setTriggerPrompt(`${prompt} [${Date.now()}]`);
  };

  const handlePromptTriggered = () => {
    // Reset trigger prompt after it's been processed
    // This allows the same action to be triggered again if needed
    setTimeout(() => {
      setTriggerPrompt(null);
    }, 100);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Action Pill Bar */}
      <div className="flex-shrink-0">
        <ActionPillBar
          onActionSelect={handleActionSelect}
          activeAction={activeAction}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          triggerPrompt={triggerPrompt}
          onPromptTriggered={handlePromptTriggered}
          className="h-full"
        />
      </div>
    </div>
  );
}
