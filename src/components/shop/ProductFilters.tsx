import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedType: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
}

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'immigration', label: 'Arrival' },
  { id: 'business', label: 'Business' },
  { id: 'ai-tools', label: 'AI Tools' },
  { id: 'finance', label: 'Finance' },
  { id: 'career', label: 'Career' },
];

export function ProductFilters({
  selectedCategory,
  selectedType,
  sortBy,
  onCategoryChange,
  onTypeChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-4 py-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(cat.id)}
              className={
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  : "border-border hover:border-primary/50"
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Type & Sort Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Type:</span>
            <div className="flex gap-2">
              <Badge
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onTypeChange('all')}
              >
                All
              </Badge>
              <Badge
                variant={selectedType === 'ebook' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onTypeChange('ebook')}
              >
                E-books
              </Badge>
              <Badge
                variant={selectedType === 'course' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onTypeChange('course')}
              >
                Courses
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] border-border bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
