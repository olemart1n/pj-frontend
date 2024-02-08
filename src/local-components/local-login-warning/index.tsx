import { component$ } from "@builder.io/qwik";

export const LocalLogInWarning = component$(() => {
  return (
    <div class=" h-20 w-40 bg-red-300">
      Logg inn for å utføre denne handlingen
    </div>
  );
});
