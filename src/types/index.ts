export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planTier: 'free' | 'pro';
  status: 'active' | 'inactive';
  aiCreditsRemaining: number;
  currentPeriodEnd?: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
}

export interface GeneratedAd {
  id: string;
  productId: string;
  fbAdText: string;
  igCaption: string;
  videoScript: string;
  ctaLink: string;
  createdAt: Date;
}

export interface AdGenerationRequest {
  productName: string;
  price: number;
  description: string;
  imageUrl?: string;
}
