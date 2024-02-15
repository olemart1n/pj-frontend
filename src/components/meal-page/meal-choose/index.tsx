import { component$, useSignal, $ } from "@builder.io/qwik";
import { LuChevronDown } from "@qwikest/icons/lucide";
import { useDbInsertPremade } from "~/routes/[id]";
import type { Ingredient, Meal } from "~/utilities/types";
import {
  ribbe,
  lutefisk,
  type PremadeMeal,
} from "~/utilities/predefined-meals";

interface Props {
  mealId: string;
  store: MealStore;
}
interface MealStore {
  meal: Meal;
  ingredients: Ingredient[];
}
export const MealChoose = component$<Props>(({ mealId, store }: Props) => {
  const setMealAction = useDbInsertPremade();
  const isDropdown = useSignal(false);
  const chosenMeal = useSignal<PremadeMeal[] | null>(null);
  const mealName = useSignal("trykk på pila");
  const guestCount = useSignal<string | undefined>("3");
  const submit = $(async () => {
    const req = await setMealAction.submit({
      mealId,
      guestCount: guestCount.value,
      meal: mealName,
    });
    if (req.status) {
      console.log("logged from comp");
      store.ingredients = req.value.ingredients;
    }
  });
  return (
    <div>
      <p class="mx-auto w-fit  p-1">
        Velg et måltid eller sett opp listen selv
      </p>
      <div class="relative mx-auto flex-col bg-white p-1">
        <div class="grid w-full grid-cols-2">
          <div class="text-center">
            <span class="mx-2">Velg måltid</span>
            <button
              class="aspect-square h-8 rounded border-2 border-slate-200 shadow-sm"
              onClick$={() => (isDropdown.value = !isDropdown.value)}
            >
              <LuChevronDown class="m-auto" />
            </button>
          </div>

          <h2 class="my-auto">{mealName.value}</h2>

          <ul
            class={
              isDropdown.value
                ? "absolute left-20 top-10   flex flex-col rounded bg-white shadow-sm "
                : "hidden"
            }
          >
            <button
              class="p-2"
              onClick$={() => {
                mealName.value = "Ribbe";
                chosenMeal.value = ribbe;
                isDropdown.value = false;
              }}
            >
              Ribbe
            </button>

            <button
              class="p-2"
              onClick$={() => {
                mealName.value = "Lutefisk";
                chosenMeal.value = lutefisk;
                isDropdown.value = false;
              }}
            >
              Lutefisk
            </button>
          </ul>
        </div>
        <div>
          <div class="my-5 grid w-full grid-cols-2 justify-around">
            <p class="col-span-1 text-center">Antall personer</p>
            <div class=" grid grid-cols-4">
              <div class="col-span-1">
                <p>{guestCount.value}</p>
              </div>

              <div class="col-span-3">
                <input
                  class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  bind:value={guestCount}
                  type="range"
                  name="guests"
                  id="guests"
                  min="0"
                  max="25"
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {chosenMeal.value &&
            chosenMeal.value.map((meal, index) => (
              <div key={index} class="grid grid-cols-3">
                <h2>{meal.name}</h2>
                <p>{meal.unit}</p>
                {meal.quantity && (
                  <p>
                    {(meal.quantity * Number(guestCount.value)) % 1 === 0
                      ? (meal.quantity * Number(guestCount.value)).toFixed(0)
                      : (meal.quantity * Number(guestCount.value)).toFixed(1)}
                  </p>
                )}
              </div>
            ))}
        </div>
        {chosenMeal.value && (
          <div class="my-5 flex w-full place-content-center">
            {" "}
            <button
              onClick$={submit}
              class=" active:opacity-85 inline cursor-pointer rounded-md bg-slate-800 px-3 py-1 text-center text-sm font-bold text-white"
            >
              Velg måltid
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
