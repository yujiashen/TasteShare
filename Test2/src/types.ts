export type Post = {
  id: number;
  image: string | null;
  name: string;
  username: string;
  description: string;
  userProfileImage?: string;
  likes: string[];
  comments: { username: string; text: string }[];
};

export type PizzaSize = 'S' | 'M' | 'L' | 'XL';

export type CartItem = {
  id: string;
  post: Post;
  post_id: number;
  size: PizzaSize;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export type OrderStatus = 'New' | 'Cooking' | 'Delivering' | 'Delivered';

export type Orders = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  post_id: number;
  posts: Post;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type Order = {
  id: string;
  group: string;
};
