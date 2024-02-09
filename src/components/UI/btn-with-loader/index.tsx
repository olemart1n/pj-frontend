import { component$, type Signal, type QRL, Slot } from "@builder.io/qwik";
interface ButtonProps {
  isLoading: Signal;
  onClick$: QRL<() => any>;
}

export const BtnWithLoader = component$<ButtonProps>(
  ({ isLoading, onClick$ }) => {
    return (
      <button
        onClick$={() => {
          isLoading.value = !isLoading.value;
          onClick$();
        }}
        class={
          "text-md dark:text-dark text-dark mx-auto aspect-[3/1]  h-8 rounded-md  border-2 border-sky-950 px-3 py-1.5 font-semibold shadow-sm dark:border-slate-200  dark:text-slate-200 " +
          (isLoading.value && " animate-squareCircle")
        }
      >
        <Slot></Slot>
      </button>
    );
  },
);
