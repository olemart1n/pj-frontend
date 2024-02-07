import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { DaysCalendar } from "~/components/days-calendar";

export default component$(() => {
  return (
    <>
      <h1 class=" p-3 text-center text-xl dark:text-white">
        Planlegg Juletiden!
      </h1>
      <DaysCalendar />
    </>
  );
});

export const head: DocumentHead = {
  title: "PlanleggJula",
  meta: [
    {
      name: "description",
      content: "Planlegger",
    },
  ],
};
