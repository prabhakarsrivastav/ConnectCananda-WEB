import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, RefreshCw, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Booking {
  _id: string;
  serviceDetails: {
    title: string;
    category: string;
    consultant?: string;
    duration?: string;
  };
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'failed' | 'refunded' | 'canceled' | 'cancelled';
  createdAt: string;
  customerName: string;
  refundStatus?: string;
  hasRefundRequest?: boolean;
  isCancelled?: boolean;
  purchaseStatus?: string;
}

export default function MyBookings() {
  console.log('📄 MyBookings component rendered');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    console.log('🚀 fetchBookings called!');
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/payments/my-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;
      console.log('📥 Raw API response:', result);
      console.log('📊 Debug info from backend:', result.debug);
      console.log('Bookings data received:', result.data?.map(booking => ({
        id: booking._id,
        status: booking.status,
        isCancelled: booking.isCancelled,
        purchaseStatus: booking.purchaseStatus,
        hasRefundRequest: booking.hasRefundRequest,
        refundStatus: booking.refundStatus
      })));
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async () => {
    if (!selectedBooking || !refundReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for the refund',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/refunds/request`, {
        paymentId: selectedBooking._id,
        refundReason: refundReason.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Refund request submitted successfully'
        });
        setSelectedBooking(null);
        setRefundReason('');
        fetchBookings();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to submit refund request',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit refund request',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, refundStatus?: string) => {
    if (refundStatus === 'approved') {
      return <Badge className="bg-red-500/10 text-red-500">Refunded</Badge>;
    }

    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-red-500/10 text-red-500">Refunded</Badge>;
      case 'canceled':
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-500">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Bookingss</h2>
        <p className="text-[#848e9c]">View your service bookings and payment history</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center bg-[#181A20] border-[#2b3139]">
          <p className="text-[#848e9c]">You haven't booked any services yet. Visit our services page to get started!</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="p-6 bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">
                    {booking.serviceDetails?.title || 'Service Booking'}
                  </h3>
                  <p className="text-[#848e9c] text-sm">
                    {booking.serviceDetails?.category && `Category: ${booking.serviceDetails.category}`}
                    {booking.serviceDetails?.consultant && ` • Consultant: ${booking.serviceDetails.consultant}`}
                  </p>
                </div>
                {getStatusBadge(booking.status, booking.refundStatus)}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#848e9c]">
                  <DollarSign className="h-4 w-4" />
                  <span>${(booking.amount / 100).toFixed(2)} {booking.currency.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#848e9c]">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                </div>

                {booking.serviceDetails?.duration && (
                  <div className="flex items-center gap-2 text-sm text-[#848e9c]">
                    <MessageSquare className="h-4 w-4" />
                    <span>{booking.serviceDetails.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {(() => {
                  console.log('🔍 Booking render check for', booking._id, ':', {
                    status: booking.status,
                    isCancelled: booking.isCancelled,
                    purchaseStatus: booking.purchaseStatus,
                    hasRefundRequest: booking.hasRefundRequest,
                    condition1: booking.status === "canceled",
                    condition2: booking.status === "cancelled",
                    overallCondition: booking.status === "canceled" || booking.status === "cancelled"
                  });
                  return null;
                })()}
                {booking.status === 'succeeded' && !booking.hasRefundRequest && !booking.isCancelled && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-[#2b3139] text-[#848e9c] hover:bg-[#2b3139]"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Refund
                  </Button>
                )}
                
                {booking.hasRefundRequest && (
                  <Badge className="bg-orange-500/10 text-orange-500">
                    Refund {booking.refundStatus || 'Pending'}
                  </Badge>
                )}

                {booking.status === 'processing' && (
                  <Button size="sm" disabled className="bg-yellow-500/10 text-yellow-500">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Awaiting Confirmation
                  </Button>
                )}

                {booking.status === 'succeeded' && !['canceled', 'cancelled', 'refunded'].includes(booking.status) && !booking.isCancelled && (
                  <Button size="sm" className="bg-[#F0B90B] text-black hover:bg-[#F3BA2F]">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Consultant
                  </Button>
                )}

                {(booking.status === 'canceled' || booking.status === 'cancelled' || booking.isCancelled) && (
                  <p className="text-sm text-red-400">This booking has been cancelled and is no longer accessible.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-[#181A20] border-[#2b3139]">
          <DialogHeader>
            <DialogTitle className="text-white">Request Refund</DialogTitle>
            <DialogDescription className="text-[#848e9c]">
              {selectedBooking?.serviceDetails?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white">Refund Amount</Label>
              <p className="text-[#F0B90B] font-bold text-lg">
                ${selectedBooking ? (selectedBooking.amount / 100).toFixed(2) : '0.00'} {selectedBooking?.currency.toUpperCase()}
              </p>
            </div>

            <div>
              <Label htmlFor="reason" className="text-white">Reason for Refund *</Label>
              <Textarea
                id="reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Please explain why you're requesting a refund..."
                className="bg-[#0B0E11] border-[#2b3139] text-white mt-2"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
                className="flex-1 border-[#2b3139] text-[#848e9c] hover:bg-[#2b3139]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRefundRequest}
                disabled={submitting || !refundReason.trim()}
                className="flex-1 bg-[#F0B90B] text-black hover:bg-[#F3BA2F]"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}