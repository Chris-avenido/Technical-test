export type SupportedLanguage = 'en' | 'nl' | 'de' | 'fr';

export interface NutrimentsData {
  energyKcal100g?: number | null;
  energyKj100g?: number | null;
  fat100g?: number | null;
  saturatedFat100g?: number | null;
  carbohydrates100g?: number | null;
  sugars100g?: number | null;
  fiber100g?: number | null;
  proteins100g?: number | null;
  salt100g?: number | null;
  sodium100g?: number | null;
  [key: string]: any;
}

export interface ProductSummary {
  code: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  categories: string[];
  nutriscoreGrade: string | null;
}

export interface ProductDetail extends ProductSummary {
  quantity?: string | null;
  ingredientsText?: string | null;
  ecoscoreGrade?: string | null;
  novaGroup?: number | null;
  isSubscribed: boolean;
  nutriments: NutrimentsData | null;
  nutritionLocked: boolean;
}

export interface SearchResultResponse {
  query: string;
  language: SupportedLanguage;
  page: number;
  pageSize: number;
  totalCount: number;
  products: ProductSummary[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
