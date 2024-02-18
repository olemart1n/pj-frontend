import {
  component$,
  useContext,
  useSignal,
  type Signal,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import days from "./days";
import { appContext } from "~/context";
import { QwikLottie } from "~/components/UI/qwik-lottie";
import lottieLoaderJson from "../../utilities/lottie-json/lottie-loader.json";
export const DaysCalendar = component$(() => {
  const app = useContext(appContext);
  const isLoggedIn = useSignal(app.isLoggedIn);
  return (
    <div class="min-h-1/2 grid grid-cols-4 gap-3 ">
      {days.map((day, index) => (
        <Child
          date={day.date}
          day={day.day}
          name={day.name}
          index={index}
          key={index}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
});

interface LinkButtonProps {
  date: string;
  name: string;
  day: string;
  index: number;
  isLoggedIn: Signal<boolean>;
}

export const Child = component$<LinkButtonProps>(
  ({ date, name, day, index, isLoggedIn }) => {
    const isClicked = useSignal(false);
    return !isClicked.value ? (
      <Link
        key={index}
        href={(!isLoggedIn.value ? "/local" : "") + "/" + name}
        class=" h-20 w-20 rounded bg-slate-50 p-3  shadow shadow-gray-50 drop-shadow-lg hover:bg-cyan-700 sm:mx-auto sm:flex sm:w-fit "
        onClick$={() => (isClicked.value = true)}
      >
        <div>
          <h3>{date}</h3>
          <p>{day}</p>
        </div>
        <div class="hidden sm:block">
          <p class="text-lg">{name}</p>
        </div>
      </Link>
    ) : (
      <div class="h-20 w-20">
        <QwikLottie animationData={lottieLoaderJson} />
      </div>
    );
  },
);
