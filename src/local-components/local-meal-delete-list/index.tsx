import { component$, useContext } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { useDbDeleteMealList } from "~/routes/[id]";
import { mealContext } from "~/context";
interface DelteModalProps {
  deleteModal: Signal;
}
export const LocalMealDeleteList = component$<DelteModalProps>(
  ({ deleteModal }) => {
    const meal = useContext(mealContext);
    const action = useDbDeleteMealList();
    return (
      <div
        class="z-3 50 absolute
    right-0 mt-2 flex h-56 w-56  origin-top-right flex-col justify-between rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:text-gray-700"
      >
        <div class="relative">
          <button
            class="absolute right-1 top-1"
            onClick$={() => (deleteModal.value = !deleteModal.value)}
          >
            X
          </button>
        </div>
        <p>Listen vil ikke kunne brukes igjen</p>
        <button
          class=" mx-auto block rounded border p-3 hover:bg-red-300"
          onClick$={async () => {
            const req = await action.submit({
              mealId: meal.meal && meal.meal.id,
            });
            if (req.status === 200) {
              meal.ingredients = [];
              deleteModal.value = !deleteModal.value;
            }
          }}
        >
          Slett
        </button>
      </div>
    );
  },
);
