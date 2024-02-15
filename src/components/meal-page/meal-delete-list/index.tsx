import { component$, useContext } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { appContext } from "~/context";

interface DelteModalProps {
  deleteModal: Signal;
}

export const MealDeleteList = component$<DelteModalProps>(({ deleteModal }) => {
  const app = useContext(appContext);
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
        onClick$={() => {
          app.listDeleted = true;
          deleteModal.value = !deleteModal.value;
        }}
      >
        OK
      </button>
    </div>
  );
});
