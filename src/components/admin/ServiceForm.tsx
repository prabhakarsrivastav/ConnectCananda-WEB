import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Home, Briefcase, Rocket, FileText, DollarSign,
  Scale, Heart, GraduationCap, Users, Truck, Smartphone,
  Loader2, Plus, X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const iconOptions = [
  { value: 'Home', icon: Home, label: 'Home' },
  { value: 'Briefcase', icon: Briefcase, label: 'Briefcase' },
  { value: 'Rocket', icon: Rocket, label: 'Rocket' },
  { value: 'FileText', icon: FileText, label: 'File Text' },
  { value: 'DollarSign', icon: DollarSign, label: 'Dollar Sign' },
  { value: 'Scale', icon: Scale, label: 'Scale' },
  { value: 'Heart', icon: Heart, label: 'Heart' },
  { value: 'GraduationCap', icon: GraduationCap, label: 'Graduation Cap' },
  { value: 'Users', icon: Users, label: 'Users' },
  { value: 'Truck', icon: Truck, label: 'Truck' },
  { value: 'Smartphone', icon: Smartphone, label: 'Smartphone' },
];

const categoryOptions = [
  'Arrival',
  'Settlement',
  'Career',
  'Financial',
  'Legal',
  'Health',
  'Education',
  'Business',
  'Technology',
  'Other'
];

export function ServiceForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  loading = false
}: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceId: initialData.serviceId || 0,
    title: initialData.title || '',
    category: initialData.category || '',
    description: initialData.description || '',
    aboutService: initialData.aboutService || '',
    price: initialData.price || '',
    duration: initialData.duration || '',
    rating: initialData.rating || 0,
    reviews: initialData.reviews || 0,
    consultant: initialData.consultant || '',
    consultantTitle: initialData.consultantTitle || '',
    features: initialData.features || [],
    icon: initialData.icon || 'Briefcase',
  });

  const [newFeature, setNewFeature] = useState('');
  const [fetchingNextId, setFetchingNextId] = useState(false);

  useEffect(() => {
    // If no serviceId provided (new service), fetch next available ID
    if (!initialData.serviceId) {
      fetchNextServiceId();
    }
  }, [initialData.serviceId]);

  const fetchNextServiceId = async () => {
    setFetchingNextId(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/services/next-id`);
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, serviceId: data.nextServiceId }));
      }
    } catch (error) {
      console.error('Error fetching next service ID:', error);
    } finally {
      setFetchingNextId(false);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const SelectedIcon = iconOptions.find(opt => opt.value === formData.icon)?.icon || Briefcase;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service ID */}
        <div>
          <Label htmlFor="serviceId" className="text-white">Service ID</Label>
          <Input
            id="serviceId"
            type="number"
            value={formData.serviceId}
            onChange={(e) => handleInputChange('serviceId', parseInt(e.target.value))}
            disabled={!!initialData.serviceId || fetchingNextId}
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-white">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-white">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger className="bg-[#0B0E11] border-[#2b3139] text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-[#181a20] border-[#2b3139]">
              {categoryOptions.map(cat => (
                <SelectItem key={cat} value={cat} className="text-white hover:bg-[#2b3139]">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Icon */}
        <div>
          <Label htmlFor="icon" className="text-white">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
            <SelectTrigger className="bg-[#0B0E11] border-[#2b3139] text-white">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <SelectedIcon className="h-4 w-4" />
                  <span>{formData.icon}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#181a20] border-[#2b3139]">
              {iconOptions.map(opt => {
                const IconComponent = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-[#2b3139]">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" className="text-white">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="e.g., $299/session"
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <Label htmlFor="duration" className="text-white">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 60 minutes"
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <Label htmlFor="rating" className="text-white">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Reviews Count */}
        <div>
          <Label htmlFor="reviews" className="text-white">Reviews Count</Label>
          <Input
            id="reviews"
            type="number"
            min="0"
            value={formData.reviews}
            onChange={(e) => handleInputChange('reviews', parseInt(e.target.value))}
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Consultant Name */}
        <div>
          <Label htmlFor="consultant" className="text-white">Consultant Name</Label>
          <Input
            id="consultant"
            value={formData.consultant}
            onChange={(e) => handleInputChange('consultant', e.target.value)}
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>

        {/* Consultant Title */}
        <div>
          <Label htmlFor="consultantTitle" className="text-white">Consultant Title</Label>
          <Input
            id="consultantTitle"
            value={formData.consultantTitle}
            onChange={(e) => handleInputChange('consultantTitle', e.target.value)}
            placeholder="e.g., RCIC, Arrival Expert"
            className="bg-[#0B0E11] border-[#2b3139] text-white"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-white">Short Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="bg-[#0B0E11] border-[#2b3139] text-white min-h-[100px]"
          required
        />
      </div>

      {/* About Service */}
      <div>
        <Label htmlFor="aboutService" className="text-white">About Service (Detailed)</Label>
        <Textarea
          id="aboutService"
          value={formData.aboutService}
          onChange={(e) => handleInputChange('aboutService', e.target.value)}
          className="bg-[#0B0E11] border-[#2b3139] text-white min-h-[150px]"
          required
        />
      </div>

      {/* Features */}
      <div>
        <Label className="text-white">Features</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="Add a feature"
              className="bg-[#0B0E11] border-[#2b3139] text-white"
            />
            <Button
              type="button"
              onClick={addFeature}
              className="bg-[#fcd535] hover:bg-[#fcd535]/90 text-black"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.features.length > 0 && (
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#0B0E11] border border-[#2b3139] rounded-lg p-3"
                >
                  <span className="text-white">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#fcd535] hover:bg-[#fcd535]/90 text-black font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-[#2b3139] text-white hover:bg-[#2b3139]"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
