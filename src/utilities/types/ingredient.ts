export interface Ingredient {
  id: number;
  name: string;
  unit?: string;
  quantity?: string | number;
  purchased: boolean;
  store?: string;
  is_fresh_ingredient: boolean;
  created_at?: string;
  updated_at?: string;
  meal_id?: string;
}
