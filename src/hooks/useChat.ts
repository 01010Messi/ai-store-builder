import { useState, useCallback } from "react";
import { ChatMessage, ConversationState, StoreBlueprint } from "@/types/conversation";
import { useToast } from "@/hooks/use-toast";

const INITIAL_CONVERSATION_STATE: ConversationState = {
  stage: "INITIAL_INTENT",
  initial_intent: "",
  clarification_questions: [],
  clarification_answers: "",
};

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>(INITIAL_CONVERSATION_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<StoreBlueprint | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          conversation_state: conversationState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationState(data.conversation_state);

      if (data.conversation_state.stage === "BLUEPRINT" && data.blueprint) {
        setBlueprint(data.blueprint);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationState, toast]);

  return {
    messages,
    conversationState,
    isLoading,
    blueprint,
    sendMessage,
  };
}
