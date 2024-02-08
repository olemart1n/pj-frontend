import { component$, useSignal, useContext, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getFetchWithJwt } from "~/dryFunctions";
import { MealIngredient } from "~/components/meal-ingredient";
import type { Ingredient } from "~/utilities/types";
import { mealContext } from "~/context";
import { dbTogglePurchased } from "../[id]";
export const useDbGetShoppingList = routeLoader$(async (reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  const response = await getFetchWithJwt("/api/meals/ingredients", jwt);
  return response;
});
export default component$(() => {
  const routeLoader = useDbGetShoppingList();
  const list = useSignal<Ingredient[]>(routeLoader.value.data);
  const mealState = useContext(mealContext);
  useTask$(({ track }) => {
    track(() => mealState.animation.idOfComponentToMove);
    if (mealState.animation.idOfComponentToMove === 0) return;
    const itemId = mealState.animation.idOfComponentToMove;
    dbTogglePurchased({ id: itemId });
  });

  return (
    <div>
      <h1>Samlet handleliste</h1>

      <div class="relative">
        {list.value.length > 0 &&
          list.value.map((ing: Ingredient, i: number) => (
            <MealIngredient props={ing} key={i} />
          ))}
      </div>
    </div>
  );
});
