import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { DaysCalendar } from "~/components/days-calendar";

export const useLogOut = routeAction$(async (_, reqEv) => {
  import.meta.env.PUBLIC_NODE_ENV === "dev"
    ? reqEv.cookie.delete("jwt")
    : reqEv.cookie.delete("jwt", { domain: ".planleggjula.no", path: "/" });
});

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
