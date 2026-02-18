import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  X,
  SlidersHorizontal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

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
}

export default function AdminBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "none">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    console.log("User state in Bookings:", user);
    if (user) {
      fetchBookings();
    } else {
      console.log("No user found, skipping fetch");
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken"); // Changed from "token" to "authToken"
      
      if (!token) {
        console.error("No token found");
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        });
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      console.log("Fetching bookings from:", `${apiUrl}/payments/my-payments`);

      const response = await fetch(
        `${apiUrl}/payments/my-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("Bookings fetched successfully:", data.data?.length || 0, "bookings");
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
      const token = localStorage.getItem("authToken"); // Changed from "token" to "authToken"

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      console.log("Submitting refund request to:", `${apiUrl}/refunds/request`);
      console.log("Payment ID:", selectedBooking._id);
      console.log("Refund reason:", refundReason.trim());
      
      const response = await fetch(
        `${apiUrl}/refunds/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId: selectedBooking._id,
            refundReason: refundReason.trim(),
          }),
        }
      );

      console.log("Refund request response status:", response.status);
      const data = await response.json();
      console.log("Refund request response data:", data);

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
      !booking.hasRefundRequest
    );
  };

  // Filter and sort bookings
  const getFilteredAndSortedBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (booking) =>
          booking.serviceDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.serviceDetails.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.serviceDetails.consultant.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status.toLowerCase() === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        const daysDiff = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return daysDiff === 0;
          case "week":
            return daysDiff <= 7;
          case "month":
            return daysDiff <= 30;
          case "3months":
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    // Price sort
    if (priceSort !== "none") {
      filtered.sort((a, b) => {
        return priceSort === "asc" ? a.amount - b.amount : b.amount - a.amount;
      });
    } else {
      // Default sort by date (newest first)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  };

  const filteredBookings = getFilteredAndSortedBookings();

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, priceSort]);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "succeeded").length,
    pending: bookings.filter((b) => b.status === "processing" || b.status === "pending").length,
    refunded: bookings.filter((b) => b.status === "refunded" || b.refundStatus === "succeeded").length,
    totalSpent: bookings.reduce((sum, b) => (b.status === "succeeded" ? sum + b.amount : sum), 0),
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setPriceSort("none");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFilter !== "all" || priceSort !== "none";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookingss</h2>
          <p className="text-gray-600 mt-1">
            View all your service bookings and manage refund requests
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Statistics Cards */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide antialiased">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1 antialiased">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide antialiased">Completed</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1 antialiased">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide antialiased">Pending</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1 antialiased">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500 dark:text-amber-400 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide antialiased">Refunded</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1 antialiased">{stats.refunded}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-purple-500 dark:text-purple-400 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide antialiased">Total Spent</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1 antialiased">
                    ${(stats.totalSpent / 100).toFixed(0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500 dark:text-emerald-400 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && bookings.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service name, category, or consultant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="succeeded">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Sort */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Sort by Price</Label>
                  <Select value={priceSort} onValueChange={(value: any) => setPriceSort(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Default (Newest)</SelectItem>
                      <SelectItem value="asc">Price: Low to High</SelectItem>
                      <SelectItem value="desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Items Per Page */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Items per page</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 per page</SelectItem>
                      <SelectItem value="12">12 per page</SelectItem>
                      <SelectItem value="24">24 per page</SelectItem>
                      <SelectItem value="48">48 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters & Clear Button */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="text-xs">
                        Search: {searchQuery}
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        Status: {statusFilter}
                      </Badge>
                    )}
                    {dateFilter !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        Date: {dateFilter}
                      </Badge>
                    )}
                    {priceSort !== "none" && (
                      <Badge variant="secondary" className="text-xs">
                        Sort: {priceSort === "asc" ? "Price ↑" : "Price ↓"}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Counter */}
      {bookings.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
            <strong className="text-foreground">{Math.min(endIndex, filteredBookings.length)}</strong> of{" "}
            <strong className="text-foreground">{filteredBookings.length}</strong> booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't booked any services yet. Browse our services to get started.
          </p>
        </Card>
      ) : currentBookings.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:gap-6">
            {currentBookings.map((booking) => (
            <Card 
              key={booking._id} 
              className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
            >
              <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-muted/10 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl mb-1 group-hover:text-primary transition-colors">
                          {booking.serviceDetails.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {booking.serviceDetails.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex flex-wrap gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(booking.status)}
                    {booking.hasRefundRequest && booking.refundStatus && (
                      <div className="text-xs">
                        {getRefundStatusBadge(booking.refundStatus)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Consultant</p>
                        <p className="text-sm font-semibold">{booking.serviceDetails.consultant}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm font-semibold">{booking.serviceDetails.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Amount Paid</p>
                      <p className="text-3xl font-bold flex items-center gap-1 text-primary">
                        <DollarSign className="h-6 w-6" />
                        {(booking.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{booking.currency.toUpperCase()}</p>
                    </div>
                    <div className="space-y-2">
                      {canRequestRefund(booking) && (
                        <Button
                          onClick={() => handleRefundRequest(booking)}
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          Request Refund
                        </Button>
                      )}
                      {booking.hasRefundRequest && booking.refundStatus === "pending" && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 p-2 rounded-md bg-amber-50 dark:bg-amber-950/20">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Refund under review</span>
                        </div>
                      )}
                      {booking.hasRefundRequest && booking.refundStatus === "rejected" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500 p-2 rounded-md bg-red-50 dark:bg-red-950/20">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">Refund rejected</span>
                        </div>
                      )}
                      {(booking.status === "refunded" || booking.refundStatus === "succeeded") && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 p-2 rounded-md bg-green-50 dark:bg-green-950/20">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Refunded successfully</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </>
      )}

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
