import {
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import {
  useLocation,
  routeAction$,
  server$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { MealIngredient } from "~/components/meal-page/meal-ingredient";
import { MealDropdown } from "~/components/meal-page/meal-dropdown";
import { MealChoose } from "~/components/meal-page/meal-choose";
// import { Loader } from "~/components/loader";
import type { Ingredient, Meal } from "~/utilities/types";
import {
  getFetchWithJwt,
  postFetchWithJwt,
  deleteFetchWithJwt,
} from "~/dryFunctions";
import { MealIngredientForm } from "~/components/meal-page/meal-ingredient-form";
import { observer } from "~/utilities/observer";
import { appContext } from "~/context";

export const useDbInsertIngredient = routeAction$(async (formData, reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;

  const response = postFetchWithJwt("/v1/meals/ingredients", jwt, formData);
  return response;
});
export const useDbGetMeal = routeLoader$(async (reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return null;
  const name = reqEv.url.pathname.replace(/\//g, "");
  const { data, error } = await getFetchWithJwt(
    "/v1/meals/meal?name=" + name,
    jwt,
  );
  if (error) {
    return reqEv.fail(404, {
      message: "Some error occured",
    });
  }
  return data as ResponseObj;
});
export const useDbInsertPremade = routeAction$(async (formData, reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  console.log("Hello from routeAction");

  const { data } = await postFetchWithJwt(
    "/v1/meals/ingredients/premade",
    jwt,
    formData,
  );
  return data;
});

export const useDbDeleteMealList = routeAction$(async (data, reqEv) => {
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  await deleteFetchWithJwt("/v1/meals/ingredients", jwt, data);
});
export const dbTogglePurchased = server$(async function (data) {
  const reqEv = this;
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return;
  await fetch(import.meta.env.PUBLIC_SERVER_URL + "/v1/meals/ingredients", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt.value}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
});

interface ResponseObj {
  meal: Meal;
  ingredients: Ingredient[];
}

// COMPONENT STARTS HERE --------------------------------------------------------
export default component$(() => {
  const app = useContext(appContext);
  const urlId = useLocation().params.id;
  const day = urlId.replace("-", " ");
  //
  const routeLoader = useDbGetMeal();

  if (routeLoader.value.failed) {
    return <p>{routeLoader.value.message}</p>;
  }
  const mealStore = useStore(routeLoader.value);
  const animStore = useStore({
    idOfComponentToMove: 0,
    originPositionTop: 0,
    targetPositionTop: 0,
  });
  const isAddingIngredient = useSignal(false);
  const isDropDown = useSignal(false);
  const deleteAction = useDbDeleteMealList();

  // TRACK LIST DELETION
  useTask$(({ track }) => {
    track(() => app.listDeleted);
    if (app.listDeleted === false) return;
    deleteAction.submit({
      mealId: mealStore.meal.id,
    });
    mealStore.ingredients = [];
    app.listDeleted = false;
  });
  // REACTING ON ID OF COMPONENT TO MOVE STATE
  useTask$(({ track }) => {
    track(() => animStore.idOfComponentToMove);
    if (animStore.idOfComponentToMove === 0) return;

    const itemId = animStore.idOfComponentToMove;

    const updatedList = mealStore.ingredients.map((ing: Ingredient) => {
      if (ing.id === itemId) {
        ing.purchased = !ing.purchased;
        return ing;
      }
      return ing;
    });
    mealStore.ingredients = updatedList;

    observer(itemId).then((component) => {
      const top = component.getBoundingClientRect().top;
      const yDistance = animStore.originPositionTop - (top as number);
      component.offsetHeight;
      component.style.transform = `translateY(${yDistance}px)`;
      requestAnimationFrame(() => {
        component.classList.add("animate-zIndexWhileMoving");
        component.style.transition = "transform 1000ms ease-in-out";
        component.style.transform = "";
      });
    });
    dbTogglePurchased({ id: itemId });
  });

  return (
    <>
      <div class="flex justify-around p-1">
        <h1 class="my-auto text-xl dark:text-slate-50">{day}</h1>
        {mealStore.ingredients.length > 0 && (
          <div class="flex flex-row gap-2">
            <div class="relative z-30">
              <button
                onClick$={() => {
                  isAddingIngredient.value = !isAddingIngredient.value;

                  isDropDown.value = false;
                }}
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                + vare
              </button>
              {isAddingIngredient.value && (
                <div
                  class="absolute z-40 mt-2 origin-top-right  -translate-x-1/2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                >
                  <MealIngredientForm
                    form={isAddingIngredient}
                    dropdown={isDropDown}
                    ingredientList={mealStore.ingredients}
                    mealId={mealStore.meal.id}
                  />
                </div>
              )}
            </div>
            <MealDropdown form={isAddingIngredient} dropdown={isDropDown} />
          </div>
        )}
      </div>

      {mealStore.ingredients.length === 0 && (
        <MealChoose mealId={mealStore.meal.id} store={mealStore} />
      )}

      {mealStore.ingredients.length > 0 && (
        <>
          <div class=" p-2">
            <h2 class="text-center font-bold dark:text-slate-50">
              Handleliste
            </h2>
            {mealStore.ingredients.map(
              (ing: Ingredient, i: number) =>
                !ing.purchased && (
                  <MealIngredient props={ing} key={i} animation={animStore} />
                ),
            )}
          </div>
          <div class="p-2 ">
            <h2 class="mt-20 text-center  dark:text-slate-50">Handlet</h2>
            {mealStore.ingredients.map(
              (ing: Ingredient, i: number) =>
                ing.purchased && (
                  <MealIngredient props={ing} key={i} animation={animStore} />
                ),
            )}
          </div>
        </>
      )}
    </>
  );
});
