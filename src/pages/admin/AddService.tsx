import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

export default function AddService() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: ServiceFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        navigate('/admin/services');
      } else {
        throw new Error(data.error || 'Failed to create service');
      }
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

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
        <h1 className="text-2xl font-bold text-white">Add New Service</h1>
        <p className="text-[#848e9c]">Create a new service offering</p>
      </div>

      {/* Form Card */}
      <Card className="bg-[#181a20] border-[#2b3139] p-6">
        <ServiceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Create Service"
          loading={loading}
        />
      </Card>
    </div>
  );
}
