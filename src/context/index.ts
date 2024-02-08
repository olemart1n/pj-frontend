import { createContextId } from "@builder.io/qwik";
import type { Meal, Ingredient } from "~/utilities/types";
export interface App {
  isLoggedIn: boolean;
  ping: boolean;
  theme: string;
}
export const appContext = createContextId<App>("appContext");

export interface MealState {
  meal: Meal | null;
  ingredients: Ingredient[];
  animation: IngredientAnimation;
  listDeleted: boolean;
}
interface IngredientAnimation {
  idOfComponentToMove: number;
  originPositionTop: number;
  targetPositionTop: number;
  finished: boolean;
}

export const mealContext = createContextId<MealState>("mealState");
