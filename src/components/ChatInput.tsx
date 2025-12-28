import { useState, KeyboardEvent, forwardRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSend, disabled = false, placeholder = "Describe your business..." }, ref) => {
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
          "bg-card border border-border rounded-2xl p-3 flex items-end gap-3 shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20",
          disabled && "opacity-60 cursor-not-allowed bg-muted/50"
        )}
      >
        <textarea
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Blueprint generated" : placeholder}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground px-2 py-3 text-base max-h-48 min-h-[56px]",
            disabled && "cursor-not-allowed"
          )}
          style={{
            height: 'auto',
            minHeight: '56px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 192) + 'px';
          }}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-xl shrink-0 transition-all duration-200",
            input.trim() ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
