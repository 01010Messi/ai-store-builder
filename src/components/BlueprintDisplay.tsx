import { StoreBlueprint } from "@/types/conversation";
import { Separator } from "@/components/ui/separator";

interface BlueprintDisplayProps {
  blueprint: StoreBlueprint;
}

export function BlueprintDisplay({ blueprint }: BlueprintDisplayProps) {
  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm font-medium text-primary">Store Blueprint Generated</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Brand Overview */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Brand Overview
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xl font-semibold text-foreground">{blueprint.brandOverview.name}</h4>
              <p className="text-muted-foreground italic">{blueprint.brandOverview.tagline}</p>
            </div>
            <p className="text-foreground/90 leading-relaxed">{blueprint.brandOverview.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Target Audience</span>
                <p className="text-sm text-foreground mt-1">{blueprint.brandOverview.targetAudience}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Positioning</span>
                <p className="text-sm text-foreground mt-1">{blueprint.brandOverview.positioning}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Product Categories
          </h3>
          <div className="grid gap-3">
            {blueprint.productCategories.map((category, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3">
                <span className="font-medium text-foreground">{category.name}</span>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Products */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Sample Products
          </h3>
          <div className="space-y-3">
            {blueprint.sampleProducts.map((product, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-foreground">{product.name}</span>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.description}</p>
                  <span className="text-xs text-muted-foreground mt-1 inline-block">{product.category}</span>
                </div>
                <span className="text-sm font-medium text-primary ml-4">{product.priceRange}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Homepage Structure */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Homepage Structure
          </h3>
          <div className="space-y-3">
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <span className="text-xs text-primary uppercase tracking-wide">Hero Section</span>
              <p className="text-sm text-foreground mt-1">{blueprint.homepageStructure.hero}</p>
            </div>
            <div className="space-y-2">
              {blueprint.homepageStructure.sections.map((section, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Essential Pages & Policies */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Essential Pages
              </h3>
              <ul className="space-y-1.5">
                {blueprint.essentialPages.map((page, index) => (
                  <li key={index} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {page}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Store Policies
              </h3>
              <ul className="space-y-1.5">
                {blueprint.policies.map((policy, index) => (
                  <li key={index} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {policy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
