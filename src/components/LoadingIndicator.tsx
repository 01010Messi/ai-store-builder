export function LoadingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: '400ms' }} />
          </div>
          <span className="text-sm text-muted-foreground ml-1">Designing your store...</span>
        </div>
      </div>
    </div>
  );
}
