import { component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import days from "./days";
import { appContext } from "~/context";

export const DaysCalendar = component$(() => {
  const app = useContext(appContext);

  return (
    <div class="min-h-1/2 grid grid-cols-4 gap-3 ">
      {days.map((day, index) => (
        <Link
          key={index}
          href={(!app.isLoggedIn ? "/local" : "") + "/" + day.name}
          class=" w-20 rounded bg-slate-50 p-3  shadow shadow-gray-50 drop-shadow-lg hover:bg-cyan-700 sm:mx-auto sm:flex sm:w-fit "
        >
          <div>
            <h3>{day.date}</h3>
            <p>{day.day}</p>
          </div>
          <div class="hidden sm:block">
            <p class="text-lg">{day.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
});
