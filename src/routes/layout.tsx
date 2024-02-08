import {
  component$,
  Slot,
  useTask$,
  useContext,
  useStore,
  useContextProvider,
} from "@builder.io/qwik";
import { appContext, mealContext, type MealState, type App } from "~/context";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Nav from "../components/nav";
import { getFetchWithJwt } from "~/dryFunctions";
export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 2,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  const localDate = new Date();
  localDate.setHours(localDate.getHours() + 1);
  const dateString = localDate.toISOString();
  return {
    date: dateString,
  };
});

export const useSetThemeCookie = routeAction$(async (_, reqEv) => {
  const theme = reqEv.cookie.get("theme");

  if (theme?.value === "dark") {
    reqEv.cookie.delete("theme");
    reqEv.cookie.set("theme", "light", {
      sameSite: "lax",
      expires: "999999999",
    });
  } else {
    reqEv.cookie.delete("theme");
    reqEv.cookie.set("theme", "dark", {
      sameSite: "lax",
      expires: "999999999",
    });
  }
});

export const useDbCheckJwt = routeLoader$(async (reqEv) => {
  const returnObj = {
    isAuthenticated: false,
    theme: reqEv.cookie.get("theme")?.value as string,
  };
  const jwt = reqEv.cookie.get("jwt");
  if (!jwt) return returnObj;
  const response = await getFetchWithJwt("/api/auth/checkjwt", jwt);
  const { isAuthenticated } = response;
  if (isAuthenticated) {
    returnObj.isAuthenticated = true;
    return returnObj;
  } else return returnObj;
});

export default component$(() => {
  const serverTime = useServerTimeLoader();
  const routeLoader = useDbCheckJwt();
  const appState: App = useStore({
    isLoggedIn: false,
    ping: false,
    theme: "light",
  });
  const mealState: MealState = useStore({
    meal: null,
    ingredients: [],
    animation: {
      idOfComponentToMove: 0,
      originPositionTop: 0,
      targetPositionTop: 0,
      finished: false,
    },
    listDeleted: false,
  });
  useContextProvider(appContext, appState);
  useContextProvider(mealContext, mealState);
  const app = useContext(appContext);
  useTask$(() => {
    app.isLoggedIn = routeLoader.value.isAuthenticated ? true : false;
    app.theme = routeLoader.value.theme;
  });

  return (
    <>
      <header class={" p-0 " + app.theme}>
        <Nav />
      </header>

      <main
        class={
          "bg-slate-200 " +
          (app.theme === "dark" &&
            "dark bg-gradient-to-br   from-sky-950 to-sky-700")
        }
      >
        <Slot />
      </main>
      <footer class={"bg-slate-200 p-0 text-lg " + app.theme}>
        <div class="dark flex w-full justify-around p-3 dark:bg-sky-700 dark:text-white">
          <span>Just for fun</span>
          <span>{serverTime.value.date}</span>
        </div>
      </footer>
    </>
  );
});
