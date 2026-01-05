export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
}

export const orders: Order[] = [];
