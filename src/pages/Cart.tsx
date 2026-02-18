import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Cart() {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to proceed with checkout.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items to cart before checkout.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/payments/create-cart-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            itemType: item.itemType,
            itemId: item.itemId,
            quantity: item.quantity
          })),
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create checkout session');
      }

      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11]">
      <Header />
      <main className="flex-1 container px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        {isLoading ? (
          <Card className="p-12 text-center bg-[#181A20] border-[#2b3139]">
            <Loader2 className="h-12 w-12 animate-spin text-[#F0B90B] mx-auto mb-4" />
            <p className="text-[#848e9c] text-lg">Loading your cart...</p>
            <p className="text-[#848e9c] text-sm mt-2">Please wait while we fetch your items.</p>
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center bg-[#181A20] border-[#2b3139]">
            <p className="text-[#848e9c] text-lg">Your cart is empty</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item._id} className="p-4 bg-[#181A20] border-[#2b3139]">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{item.details?.title}</h3>
                      <p className="text-sm text-[#848e9c] capitalize">{item.itemType}</p>
                      <p className="text-[#F0B90B] font-bold mt-2">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-white">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-[#181A20] border-[#2b3139] h-fit">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[#848e9c]">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#848e9c]">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-[#2b3139] pt-2 flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full bg-[#F0B90B] text-black hover:bg-[#F3BA2F]"
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
