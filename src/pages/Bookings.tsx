import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Payment {
  _id: string;
  serviceDetails: {
    title: string;
    category: string;
    consultant: string;
    duration: string;
    price: string;
  };
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  stripePaymentIntentId: string;
  hasRefundRequest: boolean;
  refundStatus: string | null;
  refundId: string | null;
  purchaseStatus?: string; // Add purchase status
  isCancelled?: boolean; // Add cancelled flag
}

export default function Bookings() {
  console.log('📄 Bookings component rendered');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    console.log('🚀 fetchBookings called!');
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payments/my-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        console.log('📥 Raw API response:', data);
        console.log('📊 Debug info from backend:', data.debug);
        console.log('Bookings data received:', data.data.map(booking => ({
          id: booking._id,
          status: booking.status,
          isCancelled: booking.isCancelled,
          purchaseStatus: booking.purchaseStatus,
          hasRefundRequest: booking.hasRefundRequest,
          refundStatus: booking.refundStatus
        })));
        setBookings(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch bookings");
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = (booking: Payment) => {
    setSelectedBooking(booking);
    setRefundReason("");
    setIsRefundDialogOpen(true);
  };

  const submitRefundRequest = async () => {
    if (!selectedBooking) return;

    if (!refundReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the refund",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/refunds/request`,
        {
          paymentId: selectedBooking._id,
          refundReason: refundReason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast({
          title: "Success",
          description: "Refund request submitted successfully. We'll review it shortly.",
        });
        setIsRefundDialogOpen(false);
        setSelectedBooking(null);
        setRefundReason("");
        fetchBookings(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to submit refund request");
      }
    } catch (error: any) {
      console.error("Error submitting refund:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit refund request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: "Completed", variant: "default" as const, icon: CheckCircle },
      processing: { label: "Processing", variant: "secondary" as const, icon: Clock },
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      refunded: { label: "Refunded", variant: "outline" as const, icon: RefreshCw },
      failed: { label: "Failed", variant: "destructive" as const, icon: XCircle },
      canceled: { label: "Canceled", variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRefundStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Review", variant: "secondary" as const, icon: Clock },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle },
      processing: { label: "Processing", variant: "secondary" as const, icon: Clock },
      succeeded: { label: "Refunded", variant: "default" as const, icon: CheckCircle },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
      failed: { label: "Failed", variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const canRequestRefund = (booking: Payment) => {
    return (
      (booking.status === "succeeded" || booking.status === "processing") &&
      !booking.hasRefundRequest &&
      booking.status !== "canceled" &&
      !booking.isCancelled
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              View all your service bookings and manage refund requests
            </p>
          </div>

          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't booked any services yet. Browse our services to get started.
              </p>
              <Button onClick={() => navigate("/services")}>Browse Services</Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking._id} className={`overflow-hidden hover:shadow-lg transition-shadow ${(booking.status === "canceled" || booking.isCancelled) ? 'opacity-75 border-red-200 dark:border-red-800' : ''}`}>
                  <CardHeader className={`border-b ${(booking.status === "canceled" || booking.isCancelled) ? 'bg-red-50 dark:bg-red-900/20' : 'bg-muted/50'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {booking.serviceDetails.title}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(booking.status)}
                        {booking.hasRefundRequest && booking.refundStatus && (
                          <div className="text-sm text-muted-foreground">
                            Refund: {getRefundStatusBadge(booking.refundStatus)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Category</p>
                          <p className="text-base">{booking.serviceDetails.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Consultant</p>
                          <p className="text-base">{booking.serviceDetails.consultant}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-base">{booking.serviceDetails.duration}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                          <p className="text-2xl font-bold flex items-center gap-1">
                            <DollarSign className="h-5 w-5" />
                            {(booking.amount / 100).toFixed(2)} {booking.currency.toUpperCase()}
                          </p>
                        </div>
                        {(() => {
                          console.log('🔍 Booking render check for', booking._id, ':', {
                            status: booking.status,
                            isCancelled: booking.isCancelled,
                            purchaseStatus: booking.purchaseStatus,
                            hasRefundRequest: booking.hasRefundRequest,
                            condition1: booking.status === "canceled",
                            condition2: booking.status === "cancelled",
                            condition3: booking.isCancelled,
                            overallCondition: booking.status === "canceled" || booking.status === "cancelled" || booking.isCancelled,
                            canRequestRefund: canRequestRefund(booking)
                          });
                          return booking.status === "canceled" || booking.status === "cancelled" || booking.isCancelled ? (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                                <XCircle className="h-4 w-4 inline mr-1" />
                                Your order has been cancelled
                              </p>
                              <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                                You can no longer access this service or contact the consultant.
                              </p>
                            </div>
                          ) : (
                            <>
                              {canRequestRefund(booking) && (
                                <Button
                                  onClick={() => handleRefundRequest(booking)}
                                  variant="outline"
                                  className="w-full md:w-auto"
                                >
                                  Request Refund
                                </Button>
                              )}
                              {booking.hasRefundRequest && booking.refundStatus === "pending" && (
                                <p className="text-sm text-amber-600 dark:text-amber-500">
                                  <Clock className="h-4 w-4 inline mr-1" />
                                  Your refund request is being reviewed by our team
                                </p>
                              )}
                              {booking.hasRefundRequest && booking.refundStatus === "rejected" && (
                                <p className="text-sm text-red-600 dark:text-red-500">
                                  <XCircle className="h-4 w-4 inline mr-1" />
                                  Your refund request was rejected
                                </p>
                              )}
                              {booking.status === "refunded" || booking.refundStatus === "succeeded" && (
                                <p className="text-sm text-green-600 dark:text-green-500">
                                  <CheckCircle className="h-4 w-4 inline mr-1" />
                                  This booking has been refunded
                                </p>
                              )}
                              {booking.status === "succeeded" && !booking.hasRefundRequest && (
                                <Button
                                  variant="outline"
                                  className="w-full md:w-auto"
                                  onClick={() => {/* Handle contact consultant */}}
                                >
                                  Contact Consultant
                                </Button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Refund Request Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Refund</DialogTitle>
            <DialogDescription>
              Please provide a reason for requesting a refund for this service.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="font-semibold">{selectedBooking.serviceDetails.title}</p>
                <p className="text-sm text-muted-foreground">
                  Amount: ${(selectedBooking.amount / 100).toFixed(2)} {selectedBooking.currency.toUpperCase()}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund-reason">Reason for Refund *</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="Please explain why you're requesting a refund..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={submitRefundRequest} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
