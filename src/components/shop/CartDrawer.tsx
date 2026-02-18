import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CartDrawer() {
  const { items, removeFromCart, isLoading, totalPrice } = useCart();
  const navigate = useNavigate();

  // For now, we'll use a simple state for cart open/close since it's not in the context
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-l border-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Loading your cart...</p>
              <p className="text-sm text-muted-foreground">Please wait while we fetch your items.</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some products to get started!</p>
            </div>
            <Button onClick={() => setIsCartOpen(false)} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.itemType}-${item.itemId}`}
                  className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <img
                    src={item.details?.coverImage || item.details?.thumbnail || '/placeholder.svg'}
                    alt={item.details?.title || 'Product'}
                    className="w-20 h-28 object-cover rounded border border-border"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                          {item.details?.title || 'Product'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.itemType === 'product' ? 'Product' : 'Webinar'}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.itemId)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Cart Summary */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all text-lg py-6"
              >
                Proceed to Checkout
              </Button>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
