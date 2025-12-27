import { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType, ConversationState, StoreBlueprint } from "@/types/conversation";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { BlueprintDisplay } from "./BlueprintDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  messages: ChatMessageType[];
  conversationState: ConversationState;
  isLoading: boolean;
  blueprint: StoreBlueprint | null;
  onSendMessage: (message: string) => void;
}

export function ChatContainer({
  messages,
  conversationState,
  isLoading,
  blueprint,
  onSendMessage,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isComplete = conversationState.stage === "BLUEPRINT";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, blueprint]);

  const getPlaceholder = () => {
    switch (conversationState.stage) {
      case "INITIAL_INTENT":
        return "Describe your business in your own words...";
      case "CLARIFICATION":
        return "Answer the questions above...";
      default:
        return "Blueprint generated";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4 md:px-6" ref={scrollRef}>
        <div className="max-w-2xl mx-auto py-6 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Start by describing your business idea.
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                For example: "I sell handmade candles online"
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          {blueprint && <BlueprintDisplay blueprint={blueprint} />}
        </div>
      </ScrollArea>

      <div className="p-4 md:p-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            disabled={isComplete || isLoading}
            placeholder={getPlaceholder()}
          />
        </div>
      </div>
    </div>
  );
}
