import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getFetchWithJwt } from "~/dryFunctions";
import { MealIngredient } from "~/components/meal-ingredient";
import type { Ingredient } from "~/utilities/types";
export const useDbGetShoppingList = routeLoader$(async (reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  const response = await getFetchWithJwt("/api/meals/ingredients", jwt);
  return response;
});
export default component$(() => {
  const routeLoader = useDbGetShoppingList();
  const list = useSignal<Ingredient[]>(routeLoader.value.data);

  return (
    <div>
      <h1>Samlet handleliste</h1>

      <div class="relative">
        {list.value.length > 0 ? (
          list.value.map((ing: Ingredient, i: number) => (
            <MealIngredient props={ing} key={i} index={i} />
          ))
        ) : (
          <div>Velg et måltid eller legg til ingredientser selv</div>
        )}
      </div>
    </div>
  );
});
