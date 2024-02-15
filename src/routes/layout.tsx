import {
  component$,
  Slot,
  useTask$,
  useContext,
  useStore,
  useContextProvider,
  useSignal,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import { appContext, type App } from "~/context";
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
    maxAge: 1,
  });
};

export const useSetThemeCookie = routeAction$(async (_, reqEv) => {
  const theme = reqEv.cookie.get("theme");
  if (theme?.value === "dark") {
    reqEv.cookie.delete("theme");
    reqEv.cookie.set("theme", "light", {
      expires: "999999999",
      path: "/",
    });
  } else {
    reqEv.cookie.set("theme", "dark", {
      expires: "999999999",
      path: "/",
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
  const routeLoader = useDbCheckJwt();
  const isMobileMenuActive = useSignal(false);
  const headerDiv = useSignal<HTMLElement>();
  useOnDocument(
    "click",
    $((event) => {
      if (!headerDiv.value) return;
      if (
        isMobileMenuActive.value &&
        event.clientY > headerDiv.value.clientHeight + headerDiv.value.clientTop
      ) {
        isMobileMenuActive.value = false;
      }
    }),
  );
  const appState: App = useStore({
    isLoggedIn: false,
    ping: false,
    theme: "light",
    listDeleted: false,
  });

  useContextProvider(appContext, appState);
  const app = useContext(appContext);
  useTask$(() => {
    app.isLoggedIn = routeLoader.value.isAuthenticated ? true : false;
    app.theme = routeLoader.value.theme;
  });

  return (
    <>
      <header
        class={
          "z-4 p-0 transition-all duration-200 " +
          (app.theme === "dark" && " dark bg-sky-950 ")
        }
        ref={headerDiv}
      >
        <Nav isMobileMenu={isMobileMenuActive} />
      </header>

      <main
        class={
          "bg-slate-300  " +
          (app.theme === "dark" &&
            "dark bg-gradient-to-br   from-sky-950 to-sky-700")
        }
      >
        <Slot />
      </main>
      <footer class={"bg-slate-200 p-0 text-lg " + app.theme}>
        <div class="dark flex w-full justify-around p-3 dark:bg-sky-700 dark:text-white">
          <span>Just for fun</span>
        </div>
      </footer>
    </>
  );
});
