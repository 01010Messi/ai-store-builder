export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          AI Store Setup Engine
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl">
          Describe your business in your own words. We'll automatically generate your online store structure.
        </p>
      </div>
    </header>
  );
}
