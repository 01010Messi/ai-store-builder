import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatContainer } from "@/components/ChatContainer";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const { messages, conversationState, isLoading, blueprint, sendMessage } = useChat();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer
          messages={messages}
          conversationState={conversationState}
          isLoading={isLoading}
          blueprint={blueprint}
          onSendMessage={sendMessage}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
