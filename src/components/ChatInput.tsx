import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Describe your business..." }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-2 flex items-end gap-2 shadow-sm transition-opacity",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "Blueprint generated" : placeholder}
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground px-2 py-2 text-[15px] max-h-32 min-h-[40px]",
          disabled && "cursor-not-allowed"
        )}
        style={{ 
          height: 'auto',
          minHeight: '40px'
        }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 128) + 'px';
        }}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        size="icon"
        className="h-10 w-10 rounded-lg shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
