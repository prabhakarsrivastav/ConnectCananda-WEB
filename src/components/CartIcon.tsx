import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartIcon = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/cart')}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#F0B90B] text-black text-xs">
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};
