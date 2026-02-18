import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/services/servicesService';

// Hook to get all services
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });
};

// Hook to get services by category
export const useServicesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['services', 'category', category],
    queryFn: () => servicesService.getByCategory(category),
    enabled: !!category,
  });
};

// Hook to get a single service
export const useService = (serviceId: number) => {
  return useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => servicesService.getById(serviceId),
    enabled: !!serviceId,
  });
};

// Hook to get reviews for a service
export const useServiceReviews = (serviceId: number) => {
  return useQuery({
    queryKey: ['services', serviceId, 'reviews'],
    queryFn: () => servicesService.getReviews(serviceId),
    enabled: !!serviceId,
  });
};

// Hook to get all reviews
export const useAllReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: servicesService.getAllReviews,
  });
};
