import type { Ingredient } from "../types/ingredient";
export const togglePurchased = (day: string, index: number) => {
  if (!localStorage.getItem(day)) return;
  const arr = JSON.parse(localStorage.getItem(day) as string);
  const item: Ingredient = { ...arr[index] };
  item.purchased = !item.purchased;
  arr.splice(index, 1);
  arr.push(item);
  localStorage.setItem(day, JSON.stringify(arr));
};
