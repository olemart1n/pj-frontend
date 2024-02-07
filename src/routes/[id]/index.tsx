import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import {
  useLocation,
  routeAction$,
  server$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { MealIngredient } from "~/components/meal-ingredient";
import { MealDropdown } from "~/components/meal-dropdown";
import { mealContext } from "~/context";
import type { Ingredient, Meal } from "~/utilities/types";
import {
  getFetchWithJwt,
  postFetchWithJwt,
  deleteFetchWithJwt,
} from "~/dryFunctions";
import { MealIngredientForm } from "~/components/meal-ingredient-form";
import { observer } from "~/utilities/observer";

export const useDbInsertIngredient = routeAction$(async (formData, reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  const response = postFetchWithJwt("/api/meals/ingredients", jwt, formData);
  return response;
});
export const useDbDeleteMealList = routeAction$(async (data, reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;

  const req = await deleteFetchWithJwt("/api/meals/ingredients", jwt, data);
  return req;
});
export const dbTogglePurchased = server$(async function (data) {
  const reqEv = this;
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  console.log(jwt);
  await fetch(import.meta.env.PUBLIC_SERVER_URL + "/api/meals/ingredients", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt.value}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
});

export const useDbGetMeal = routeLoader$(async (reqEv) => {
  interface ResponseObj {
    data: {
      meal: Meal;
      ingredients: Ingredient[];
    };
    error: any;
  }
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return null;
  const name = reqEv.url.pathname.replace(/\//g, "");
  const res: ResponseObj = await getFetchWithJwt(
    "/api/meals/meal?name=" + name,
    jwt,
  );

  return res;
});
export default component$(() => {
  const mealState = useContext(mealContext);
  const urlId = useLocation().params.id;
  const day = urlId.replace("-", " ");
  const routeLoaderData = useDbGetMeal();
  const ingredientsArray = useSignal<Ingredient[]>();
  const isAddingIngredient = useSignal(false);
  useTask$(() => {
    if (!routeLoaderData.value?.data) return;
    mealState.meal = routeLoaderData.value.data.meal;
    mealState.ingredients = routeLoaderData.value.data.ingredients;
    ingredientsArray.value = routeLoaderData.value.data.ingredients;
  });

  useTask$(({ track }) => {
    track(() => mealState.animation.idOfComponentToMove);
    if (mealState.animation.idOfComponentToMove === 0) return;
    if (!ingredientsArray.value) return;
    const itemId = mealState.animation.idOfComponentToMove;

    const updatedList = ingredientsArray.value.map((ing: Ingredient) => {
      if (ing.id === itemId) {
        ing.purchased = !ing.purchased;
        return ing;
      }
      return ing;
    });
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
    dbTogglePurchased({ id: itemId });
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
                <MealIngredientForm form={isAddingIngredient} />
              </div>
            )}
          </div>
          <MealDropdown form={isAddingIngredient} />
        </div>
      </div>

      {
        <>
          <div class=" p-2">
            <h2 class="text-center font-bold dark:text-slate-50">
              Handleliste
            </h2>
            {ingredientsArray.value?.map(
              (ing: Ingredient, i: number) =>
                !ing.purchased && <MealIngredient props={ing} key={i} />,
            )}
          </div>
          <div class="p-2 ">
            <h2 class="mt-20 text-center  dark:text-slate-50">Handlet</h2>
            {ingredientsArray.value?.map(
              (ing: Ingredient, i: number) =>
                ing.purchased && <MealIngredient props={ing} key={i} />,
            )}
          </div>
        </>
      }
    </>
  );
});
