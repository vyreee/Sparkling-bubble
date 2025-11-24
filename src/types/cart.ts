export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'bundle' | 'addon' | 'prepay';
  category?: string; // e.g., 'regular', 'weekly', 'senior', 'senior_weekly'
  quantity: number;
  description?: string;
  metadata?: {
    couponCode?: string;
    weeks?: number;
    savings?: number;
    isMultiplier?: boolean;
    claimingFreeBag?: boolean;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
}
