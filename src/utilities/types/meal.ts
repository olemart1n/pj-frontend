import type { Ingredient } from "./ingredient";

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  guests: number;
  created_at: string;
  updated_at: string;
  date: string;
  description: string;
  ingredients_count: null | number;
  ingredients: Ingredient[];
}
