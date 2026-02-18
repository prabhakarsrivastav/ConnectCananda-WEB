import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ServiceFormData {
  serviceId: number;
  title: string;
  category: string;
  description: string;
  aboutService: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  consultant: string;
  consultantTitle: string;
  features: string[];
  icon: string;
}

export default function EditService() {
  const [initialData, setInitialData] = useState<Partial<ServiceFormData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    setFetchingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services/${id}`);
      const data = await response.json();

      if (data.success) {
        setInitialData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch service');
      }
    } catch (error: any) {
      console.error('Error fetching service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch service",
        variant: "destructive",
      });
      navigate('/admin/services');
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (formData: ServiceFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
        navigate('/admin/services');
      } else {
        throw new Error(data.error || 'Failed to update service');
      }
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#fcd535]" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-12">
        <p className="text-[#848e9c]">Service not found</p>
        <Button
          onClick={handleCancel}
          className="mt-4 bg-[#fcd535] hover:bg-[#fcd535]/90 text-black"
        >
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-[#848e9c] hover:text-white hover:bg-[#2b3139]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Edit Service</h1>
        <p className="text-[#848e9c]">Update service information</p>
      </div>

      {/* Form Card */}
      <Card className="bg-[#181a20] border-[#2b3139] p-6">
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Update Service"
          loading={loading}
        />
      </Card>
    </div>
  );
}
