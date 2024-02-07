import { component$, useSignal, useContext } from "@builder.io/qwik";
import { LuPencil } from "@qwikest/icons/lucide";
import type { Ingredient } from "~/utilities/types/ingredient";
import { togglePurchased } from "~/utilities/localstorage";
import { mealContext } from "~/context";

interface IngredientObj {
  props: Ingredient;
  index: number;
  day?: string;
}
export const LocalMealIngredient = component$<IngredientObj>(
  ({ props, index, day }) => {
    const mealState = useContext(mealContext);
    const isPurchased = props.purchased;
    const isToggled = useSignal(isPurchased);
    const thisEl = useSignal<HTMLDivElement>();
    return (
      <div
        ref={thisEl}
        class={
          " lg:w:2/3 relative mx-auto my-2 block w-11/12 rounded-lg border  text-gray-800  shadow-[0_2px_15px_-3px_rgba(d,f,d,f.2),0_10px_20px_-2px_rgba(0,0,0,0.1)] " +
          (isToggled.value ? " bg-green-100" : " bg-white")
        }
        data-id={props.id}
      >
        <div class=" mx-auto my-1 grid w-4/5 grid-cols-4 text-gray-800">
          <button onClick$={() => alert("funksjon ikke ferdig-utviklet")}>
            <LuPencil />
          </button>
          <h5
            class={
              "lg:text-xxl relative text-xl font-bold leading-tight " +
              (isToggled.value && " line-through decoration-2")
            }
          >
            {props.name}
          </h5>
          <p class=" text-base text-neutral-600 ">{props.quantity}</p>
          <div class="relative flex">
            <label class="relative flex w-full cursor-pointer items-center justify-center">
              <input
                type="checkbox"
                class="sr-only"
                onChange$={() => {
                  if (!thisEl.value) return;
                  const { top } = thisEl.value.getBoundingClientRect();
                  mealState.animation.idOfComponentToMove = props.id;
                  mealState.animation.originPositionTop = top;

                  day && togglePurchased(day, index);
                  isToggled.value = !isToggled.value;
                }}
              />

              <div
                class={
                  "relative block h-4 w-10 rounded-full " +
                  (isToggled.value ? "bg-gray-600" : "bg-red-100")
                }
              >
                <div
                  class={
                    "dot absolute left-0 h-4 w-4 rounded-full border bg-white transition " +
                    (isToggled.value && " translate-x-7 bg-green-500")
                  }
                />
              </div>
            </label>
          </div>
        </div>

        <div class="border-t-1 flex w-2/3 justify-around">
          {props.is_fresh_ingredient && (
            <div class="bg-amber-200">ferskvare</div>
          )}
          {props.store && <div class="bg-amber-200">{props.store}</div>}
        </div>
      </div>
    );
  },
);
