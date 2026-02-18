import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, Download, PlayCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  thumbnail?: string;
  type: 'ebook' | 'course';
  salesCount?: number;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = async () => {
    try {
      await addToCart('product', product.id);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Please login to add items to cart.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-lg">
              <img
                src={product.coverImage || product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {product.type === 'ebook' ? 'E-book' : 'Course'}
              </Badge>
              {product.salesCount !== undefined && product.salesCount > 0 && (
                <Badge variant="outline">
                  {product.salesCount} sold
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description</h3>
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8 out of 5)</span>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">What's Included</h3>
              <ul className="space-y-2">
                {product.type === 'ebook' ? (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-primary" />
                      <span>Instant digital download</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-primary" />
                      <span>Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-primary" />
                      <span>PDF format</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span>Video lessons</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span>Certificate of completion</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <Separator />

            {/* Price & Purchase */}
            <div className="space-y-4 pt-4">
              <div className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all text-lg py-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
