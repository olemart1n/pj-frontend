import { component$, useSignal, type Signal } from "@builder.io/qwik";
import { LocalMealDeleteList } from "../local-meal-delete-list";
interface DropdownProps {
  form: Signal;
  dropdown: Signal;
}
export const LocalMealDropdown = component$<DropdownProps>(
  ({ form, dropdown }) => {
    const deleteModal = useSignal(false);

    return (
      <div class=" z-30 inline-block text-left">
        <div>
          <button
            type="button"
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick$={() => {
              dropdown.value = !dropdown.value;
              form.value = false;
            }}
          >
            Valg
            <svg
              class="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        {dropdown.value && (
          <div
            class="absolute mt-2  w-56 origin-top-right -translate-x-1/2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div class="py-1" role="none">
              <button
                type="button"
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                onClick$={() => (deleteModal.value = true)}
              >
                Slett liste
              </button>
              <button
                type="button"
                class="block px-4 py-2 text-sm text-gray-700 line-through"
                role="menuitem"
                onClick$={() =>
                  alert("login inn for å utføre denne handlingen")
                }
              >
                Kopier
              </button>
            </div>
          </div>
        )}

        {deleteModal.value && (
          <LocalMealDeleteList deleteModal={deleteModal} dropdown={dropdown} />
        )}
      </div>
    );
  },
);
