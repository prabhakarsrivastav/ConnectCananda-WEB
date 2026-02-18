// Payment Service for user frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('🔐 Auth Token Check:');
  console.log('- Token exists:', !!token);
  console.log('- Token preview:', token?.substring(0, 20) + (token && token.length > 20 ? '...' : ''));
  return token;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  console.log('🔧 Auth Headers:', {
    contentType: headers['Content-Type'],
    hasAuth: !!headers.Authorization,
    authPreview: headers.Authorization?.substring(0, 20) + (headers.Authorization && headers.Authorization.length > 20 ? '...' : ''),
  });
  return headers;
};

export const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (serviceId: string) => {
    const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/services`;

    console.log('🔗 URL Check Debug:');
    console.log('- window.location.origin:', window.location.origin);
    console.log('- successUrl:', successUrl);
    console.log('- cancelUrl:', cancelUrl);

    const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        serviceId,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  },

  // Verify payment and ensure purchase record exists
  verifyPayment: async (sessionId: string) => {
    console.log('Verifying payment session:', sessionId);

    const response = await fetch(`${API_BASE_URL}/payments/verify-session/${sessionId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }

    return response.json();
  },

  // Get user's payment history
  getUserPayments: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/my-payments`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch payments');
    }

    return response.json();
  },

  // Request refund
  requestRefund: async (paymentId: string, reason: string) => {
    const response = await fetch(`${API_BASE_URL}/refunds/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        paymentId,
        refundReason: reason,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request refund');
    }

    return response.json();
  },

  // Get user's refund requests
  getUserRefunds: async () => {
    const response = await fetch(`${API_BASE_URL}/refunds/my-refunds`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch refunds');
    }

    return response.json();
  },
};
