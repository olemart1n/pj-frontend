import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getFetchWithJwt } from "~/dryFunctions";
import { MealIngredient } from "~/components/meal-page/meal-ingredient";
import type { Ingredient } from "~/utilities/types";
import { dbTogglePurchased } from "../[id]";
export const useDbGetShoppingList = routeLoader$(async (reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  const response = await getFetchWithJwt("/v1/meals/ingredients", jwt);
  return response;
});
export default component$(() => {
  const routeLoader = useDbGetShoppingList();
  const list = useSignal<Ingredient[]>(routeLoader.value.data);
  const animStore = useStore({
    idOfComponentToMove: 0,
    originPositionTop: 0,
    targetPositionTop: 0,
  });
  useTask$(({ track }) => {
    track(() => animStore.idOfComponentToMove);
    if (animStore.idOfComponentToMove === 0) return;
    const itemId = animStore.idOfComponentToMove;
    dbTogglePurchased({ id: itemId });
  });

  return (
    <div>
      <h1>Samlet handleliste</h1>

      <div class="relative">
        {list.value.length > 0 &&
          list.value.map((ing: Ingredient, i: number) => (
            <MealIngredient props={ing} key={i} animation={animStore} />
          ))}
      </div>
    </div>
  );
});
