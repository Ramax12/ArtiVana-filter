import { DeliveryOption } from '@js/typescript/types';
export interface IProduct {
  id: number;
  group_id?: number;
  created_at: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  name: string;
  article: number;
  brand: string;
  model?: string;
  link: string;
  original_price?: number;
  final_price: number;
  stock: number;
  images: Array<string> | string;
  rating: number;
  chars_general: Record<string, string | number>;
  chars_extra?: Record<string, string | number>;
  package?: string;
  description: string;
  shipping_options: Array<DeliveryOption>;
  tags: Array<string> | null;
}

export interface ISubsubcategory {
  id: string;
  name: string;
  image: string;
}

export interface ISubcategory {
  id: string;
  name: string;
  image: string;
  subsubcategories: Array<ISubsubcategory>;
}

export interface ICategory {
  id: string;
  name: string;
  image: string;
  subcategories: Array<ISubcategory>;
}

export interface IOption {
  id: number | string;
  name: string;
}
