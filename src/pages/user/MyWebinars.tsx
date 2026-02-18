import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Play, Clock } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PurchasedWebinar {
  _id: string;
  title: string;
  description: string;
  type: 'webinar';
  price: string | number;
  purchaseDate: string;
  coverImage?: string;
  date?: string;
  time?: string;
}

export default function MyWebinars() {
  const [webinars, setWebinars] = useState<PurchasedWebinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedWebinars();
  }, []);

  const fetchPurchasedWebinars = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/webinars/my-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        const formattedWebinars = result.data.map((w: any) => ({
          _id: w._id,
          title: w.title,
          description: w.description,
          type: 'webinar',
          price: w.price,
          purchaseDate: w.createdAt,
          coverImage: w.cover_image,
          date: w.date,
          time: w.time
        }));
        setWebinars(formattedWebinars);
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
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
        <h2 className="text-2xl font-bold text-white mb-2">My Webinars</h2>
        <p className="text-[#848e9c]">Access your purchased webinar recordings</p>
      </div>

      {webinars.length === 0 ? (
        <Card className="p-12 text-center bg-[#181A20] border-[#2b3139]">
          <p className="text-[#848e9c]">You haven't purchased any webinars yet. Visit the webinars page to purchase recordings!</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {webinars.map((webinar) => (
            <Card key={webinar._id} className="p-6 bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/30 transition-all">
              <div className="flex gap-4">
                {webinar.coverImage && (
                  <img
                    src={webinar.coverImage}
                    alt={webinar.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{webinar.title}</h3>
                    <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] capitalize">
                      {webinar.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#848e9c] mb-3 line-clamp-2">{webinar.description}</p>

                  {webinar.date && webinar.time && (
                    <div className="flex items-center gap-2 text-xs text-[#848e9c] mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(webinar.date), 'MMM dd, yyyy')} at {webinar.time}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#848e9c] mb-4">
                    <Clock className="h-3 w-3" />
                    <span>Purchased {format(new Date(webinar.purchaseDate), 'MMM dd, yyyy')}</span>
                  </div>

                  <Button size="sm" className="bg-[#F0B90B] text-black hover:bg-[#F3BA2F]">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Recording
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