import { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType, ConversationState, StoreBlueprint } from "@/types/conversation";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { BlueprintDisplay } from "./BlueprintDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getPlaceholder = () => {
    switch (conversationState.stage) {
      case "INITIAL_INTENT":
        return "Describe your business idea (products, audience, vibe, pricing...)";
      case "CLARIFICATION":
        return "Select an option above or type here...";
      default:
        return "Blueprint generated";
    }
  };

  const handleOptionSelect = (option: string) => {
    if (option.toLowerCase().includes("other")) {
      // Focus input for typing
      inputRef.current?.focus();
      return;
    }
    onSendMessage(option);
  };

  const isInitial = messages.length === 0;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full relative">

      {/* Scroll Area for Messages */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4" ref={scrollRef}>
          <div className={cn("py-6 space-y-6 pb-32", isInitial ? "hidden" : "block")}>
            {/* Header removed from here, relying on Left Panel */}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelect={handleOptionSelect}
              />
            ))}

            {isLoading && <LoadingIndicator />}

            {blueprint && (
              <div className="mt-8 animate-fade-in">
                <BlueprintDisplay blueprint={blueprint} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className={cn(
        "transition-all duration-500 ease-in-out z-20 p-4",
        isInitial
          ? "absolute inset-0 flex flex-col justify-center items-center bg-background/50 backdrop-blur-sm" // Centered initially
          : "bg-background/80 backdrop-blur-sm" // Bottom normally
      )}>
        <div className={cn(
          "w-full transition-all duration-500",
          isInitial ? "max-w-xl" : "max-w-full"
        )}>
          {isInitial && (
            <div className="mb-8 text-center space-y-2 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Describe your business
              </h1>
              <p className="text-muted-foreground">
                We'll help you structure your store in seconds.
              </p>
            </div>
          )}
          <ChatInput
            ref={inputRef}
            onSend={onSendMessage}
            disabled={isComplete || isLoading}
            placeholder={getPlaceholder()}
          />
        </div>
      </div>
    </div>
  );
}
