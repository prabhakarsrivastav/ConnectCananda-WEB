import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Home, Briefcase, Rocket, FileText, DollarSign, 
  Scale, Heart, GraduationCap, Users, Truck, Smartphone,
  Loader2, Plus, Edit, Trash2, Search, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Service {
  serviceId: number;
  title: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  consultant: string;
  icon: string;
}

const iconMap: { [key: string]: any } = {
  Home,
  Briefcase,
  Rocket,
  FileText,
  DollarSign,
  Scale,
  Heart,
  GraduationCap,
  Users,
  Truck,
  Smartphone,
};

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.consultant.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services`);
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services/${serviceToDelete.serviceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        fetchServices();
      } else {
        throw new Error(data.error || 'Failed to delete service');
      }
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#fcd535]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Services</h1>
          <p className="text-[#848e9c]">Create, edit, or delete services</p>
        </div>
        <Button
          onClick={() => navigate('/admin/services/add')}
          className="bg-[#fcd535] hover:bg-[#fcd535]/90 text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848e9c]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services by title, category, or consultant..."
          className="pl-10 bg-[#181a20] border-[#2b3139] text-white"
        />
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="bg-[#181a20] border-[#2b3139] p-12 text-center">
          <p className="text-[#848e9c] text-lg">
            {searchQuery ? 'No services found matching your search' : 'No services available'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Briefcase;
            return (
              <Card key={service.serviceId} className="bg-[#181a20] border-[#2b3139] p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="h-16 w-16 rounded-lg bg-[#fcd535]/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-[#fcd535]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                        <p className="text-[#848e9c] text-sm mb-2">
                          <span className="inline-block bg-[#fcd535]/10 text-[#fcd535] px-2 py-1 rounded">
                            {service.category}
                          </span>
                          <span className="mx-2">•</span>
                          ID: {service.serviceId}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/services/edit/${service.serviceId}`)}
                          className="border-[#2b3139] text-[#fcd535] hover:bg-[#fcd535]/10"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(service)}
                          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <p className="text-white/70 mt-3 line-clamp-2">{service.description}</p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#2b3139]">
                      <div>
                        <p className="text-[#848e9c] text-xs">Price</p>
                        <p className="text-white font-semibold">{service.price}</p>
                      </div>
                      <div>
                        <p className="text-[#848e9c] text-xs">Duration</p>
                        <p className="text-white font-semibold">{service.duration}</p>
                      </div>
                      <div>
                        <p className="text-[#848e9c] text-xs">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#fcd535] fill-[#fcd535]" />
                          <span className="text-white font-semibold">{service.rating}</span>
                          <span className="text-[#848e9c] text-sm">({service.reviews})</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#848e9c] text-xs">Consultant</p>
                        <p className="text-white font-semibold">{service.consultant}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#181a20] border-[#2b3139]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Service</AlertDialogTitle>
            <AlertDialogDescription className="text-[#848e9c]">
              Are you sure you want to delete "{serviceToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent border-[#2b3139] text-white hover:bg-[#2b3139]"
              disabled={deleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
