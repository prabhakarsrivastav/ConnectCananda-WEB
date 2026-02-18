const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Service {
  _id: string;
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
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

class ServicesService {
  // Get all services
  async getAll(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  }

  // Get services by category
  async getByCategory(category: string): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch services by category');
    }
    return response.json();
  }

  // Get single service
  async getById(id: string): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return response.json();
  }

  // Get reviews for a service
  async getReviews(id: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/services/${id}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  }

  // Get all reviews
  async getAllReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/services/all/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch all reviews');
    }
    return response.json();
  }
}

export const servicesService = new ServicesService();
