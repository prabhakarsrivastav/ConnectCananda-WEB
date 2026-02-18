import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  itemType: 'product' | 'webinar';
  itemId: string;
  quantity: number;
  price: number;
  details?: any;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (itemType: 'product' | 'webinar', itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (itemType: 'product' | 'webinar', itemId: string, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemType, itemId, quantity })
    });

    if (!response.ok) throw new Error('Failed to add to cart');
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to remove from cart');
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/update/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) throw new Error('Failed to update quantity');
    await refreshCart();
  };

  const clearCart = async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to clear cart');
    await refreshCart();
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
