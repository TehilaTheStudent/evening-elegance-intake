export interface Listing {
  id?: string;
  description: string;
  city: string;
  size: string;
  color?: string;
  price: number;
  originalImageUrl: string;
  processedImageUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | null;
  userId: string;
}
