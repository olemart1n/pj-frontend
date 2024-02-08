import {
  $,
  component$,
  useContext,
  useSignal,
  type Signal,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { appContext } from "~/context";
import { locallySaveIngredient } from "~/utilities/localstorage";
interface ToggleDropDown {
  form: Signal;
  dropdown: Signal;
}
export const LocalMealIngredientForm = component$<ToggleDropDown>(
  ({ form, dropdown }) => {
    const app = useContext(appContext);
    const urlId = useLocation().params.id;
    const formData = useSignal<HTMLFormElement>();
    const submit = $(async () => {
      const data = new FormData(formData.value);
      const inputs = Object.fromEntries(data.entries());
      locallySaveIngredient(urlId, inputs);
      form.value = false;
      dropdown.value = false;
      app.ping = true;
    });

    return (
      <div class="z-30 w-72 p-2 text-gray-800">
        <h2 class="m-3">Legg til vare</h2>
        <form preventdefault:submit ref={formData}>
          <div class="relative mb-3">
            <input
              type="text"
              class=" peer block min-h-[auto] w-full rounded border px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 "
              id="Navn"
              name="name"
              placeholder="Vare"
              autoComplete="off"
              required
            />
            <p class="absolute right-2 top-2 h-1 w-1 text-xl font-bold text-red-300">
              *
            </p>
          </div>
          <div class="relative mb-3">
            <input
              type="text"
              class=" peer block min-h-[auto] w-full rounded border px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 "
              name="store"
              placeholder="Butikk"
            />
          </div>
          <div class="flex">
            <div class="flex">
              <div class="mb-[0.125rem] flex min-h-[1.5rem] flex-col ">
                <input
                  class="checked:border-primary checked:after:border-primary checked:after:bg-primary"
                  type="radio"
                  name="unit"
                  value="amount"
                  id="amount"
                />
                <label
                  class="mt-px  pl-[0.15rem] text-sm hover:cursor-pointer"
                  for="amount"
                >
                  Antall
                </label>
              </div>
              <div class="mb-[0.125rem] flex min-h-[1.5rem] flex-col pl-[1.5rem]">
                <input
                  class="checked:border-primary checked:after:border-primary checked:after:bg-primary"
                  type="radio"
                  name="unit"
                  value="liter"
                  id="liter"
                />
                <label
                  class="mt-px  pl-[0.15rem] text-sm hover:cursor-pointer"
                  for="liter"
                >
                  Liter
                </label>
              </div>
              <div class="mb-[0.125rem] flex min-h-[1.5rem] flex-col pl-[1.5rem]">
                <input
                  class="checked:border-primary checked:after:border-primary checked:after:bg-primary"
                  type="radio"
                  name="unit"
                  value="gram"
                  id="gram"
                />
                <label
                  class="mt-px  pl-[0.15rem] text-sm hover:cursor-pointer"
                  for="gram"
                >
                  gram
                </label>
              </div>
            </div>
            <div class="relative mb-3">
              <input
                type="text"
                class=" peer block min-h-[auto] w-full rounded border px-2 py-[0.16rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 "
                name="quantity"
                placeholder="1234"
                id="quantity"
              />
            </div>
          </div>
          <div class="my-[0.5rem] flex min-h-[1.5rem] justify-around ">
            <label
              class="mt-px  pl-[0.15rem] text-sm hover:cursor-pointer"
              for="quantity"
            >
              Er dette en ferskvare?
            </label>
            <input
              class="checked:border-primary checked:after:border-primary checked:after:bg-primary"
              type="checkbox"
              name="is_fresh_ingredient"
            />
          </div>
          <div class="relative mb-3 text-center">
            <button
              class="mx-auto rounded bg-blue-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black"
              onClick$={submit}
            >
              Legg til
            </button>
          </div>
        </form>
      </div>
    );
  },
);
