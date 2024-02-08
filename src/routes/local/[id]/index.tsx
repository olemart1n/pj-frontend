import {
  component$,
  useSignal,
  useVisibleTask$,
  useContext,
  useTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LocalMealIngredient } from "~/local-components/local-meal-ingredient";
import type { Ingredient } from "~/utilities/types/ingredient";
import { LocalMealDropdown } from "~/local-components/local-meal-dropdown";
import { LocalMealIngredientForm } from "~/local-components/local-meal-ingredient-form";
import { appContext, mealContext } from "~/context";
import { observer } from "~/utilities/observer";
export default component$(() => {
  const app = useContext(appContext);
  const mealState = useContext(mealContext);
  const urlId = useLocation().params.id;
  const day = urlId.replace("-", " ");
  const ingredientsArray = useSignal<Ingredient[]>([]);
  const isAddingIngredient = useSignal(false);
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => app.ping);
    if (localStorage.getItem(urlId)) {
      const list = JSON.parse(localStorage.getItem(urlId) as string);
      ingredientsArray.value = list;
    }
    app.ping = false;
  });

  useTask$(({ track }) => {
    track(() => mealState.listDeleted);
    if (mealState.listDeleted) {
      ingredientsArray.value = [];
      localStorage.removeItem(urlId);
      mealState.listDeleted = false;
    }
  });

  useTask$(({ track }) => {
    track(() => mealState.animation.idOfComponentToMove);
    if (mealState.animation.idOfComponentToMove === 0) return;
    const itemId = mealState.animation.idOfComponentToMove;
    const updatedList = ingredientsArray.value.map((ing: Ingredient) => {
      if (ing.id === itemId) {
        ing.purchased = !ing.purchased;
        return ing;
      }
      return ing;
    });
    localStorage.setItem(urlId, JSON.stringify(updatedList));
    ingredientsArray.value = updatedList;

    // mealState.animation.isMoving = true;
    observer(itemId).then((component) => {
      const top = component.getBoundingClientRect().top;
      const yDistance = mealState.animation.originPositionTop - (top as number);
      component.offsetHeight;
      component.style.transform = `translateY(${yDistance}px)`;
      requestAnimationFrame(() => {
        component.style.transition = "transform 1000ms ease-in-out";
        component.style.zIndex = "30";
        component.style.transform = "";
        component.style.transition = "transform 1000ms ease-in-out";
      });
    });
    mealState.animation.idOfComponentToMove = 0;
  });

  return (
    <>
      <div class="flex justify-around p-1">
        <h1 class="my-auto text-xl dark:text-slate-50">{day}</h1>
        <div class="flex flex-row gap-2">
          <div class="relative z-10">
            <button
              onClick$={() =>
                (isAddingIngredient.value = !isAddingIngredient.value)
              }
              class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              + vare
            </button>
            {isAddingIngredient.value && (
              <div
                class="absolute mt-2 origin-top-right  -translate-x-1/2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <LocalMealIngredientForm form={isAddingIngredient} />
              </div>
            )}
          </div>
          <LocalMealDropdown form={isAddingIngredient} />
        </div>
      </div>

      {
        <>
          <div class=" p-2">
            <h2 class="text-center font-bold dark:text-slate-50">
              Handleliste
            </h2>
            {ingredientsArray.value.map(
              (ing: Ingredient, i: number) =>
                !ing.purchased && (
                  <LocalMealIngredient
                    props={ing}
                    key={i}
                    index={i}
                    day={urlId}
                  />
                ),
            )}
          </div>
          <div class="p-2 ">
            <h2 class="mt-20 text-center  dark:text-slate-50">Handlet</h2>
            {ingredientsArray.value.map(
              (ing: Ingredient, i: number) =>
                ing.purchased && (
                  <LocalMealIngredient
                    props={ing}
                    key={i}
                    index={i}
                    day={urlId}
                  />
                ),
            )}
          </div>
        </>
      }
    </>
  );
});
