import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PurchasedItem {
  _id: string;
  title: string;
  description: string;
  type: 'product' | 'webinar';
  price: string | number;
  purchaseDate: string;
  coverImage?: string;
}

export default function MyProducts() {
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/my-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Products</h2>
        <p className="text-[#848e9c]">Access your purchased e-books and courses</p>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center bg-[#181A20] border-[#2b3139]">
          <p className="text-[#848e9c]">You haven't purchased any products yet. Visit the shop to buy e-books and courses!</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item._id} className="p-6 bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/30 transition-all">
              <div className="flex gap-4">
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#848e9c] mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[#848e9c] mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>Purchased {format(new Date(item.purchaseDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <Button size="sm" className="bg-[#F0B90B] text-black hover:bg-[#F3BA2F]">
                    <Download className="h-4 w-4 mr-2" />
                    Access
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
