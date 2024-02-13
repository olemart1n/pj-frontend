import { component$, type Signal, type QRL, Slot } from "@builder.io/qwik";
interface ButtonProps {
  isLoading: Signal<boolean>;
  isDisabled?: boolean;
  onClick$: QRL<() => any>;
}

export const BtnWithLoader = component$<ButtonProps>(
  ({ isLoading, onClick$, isDisabled }) => {
    return (
      <button
        disabled={isDisabled}
        onClick$={() => {
          onClick$();
        }}
        class={
          "text-md  text-shadow  aspect-[3/1]  h-8  rounded-md border-2 border-sky-600  font-semibold shadow-md dark:border-slate-200  dark:text-slate-200 " +
          (isLoading.value && " h-8 w-8 animate-spin rounded-full content-none")
        }
      >
        {!isLoading.value && <Slot />}
      </button>
    );
  },
);
