import { component$, useSignal } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Icon } from "./icon";
import { appContext } from "~/context";
import { useContext } from "@builder.io/qwik";
import { LuSun, LuMoon } from "@qwikest/icons/lucide";
import { useSetThemeCookie } from "~/routes/layout";
export default component$(() => {
  const app = useContext(appContext);
  const nav = useNavigate();

  const loc = useSignal<string>("/");
  const themeToggleAction = useSetThemeCookie();
  const isMobileMenu = useSignal(false);
  return (
    <nav
      class=" mx-auto flex w-full flex-wrap items-center justify-between dark:bg-sky-950 dark:text-white lg:p-4 lg:px-8"
      aria-label="Global"
    >
      <div class="flex p-3 lg:p-0">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Planlegg jula</span>
          <Icon />
        </a>
      </div>
      {/* nav icon */}
      <div class=" p-4 lg:hidden ">
        <button
          type="button"
          class={
            "-m-2.5 inline-flex items-center justify-center rounded-md p-2 text-gray-700 " +
            (isMobileMenu.value && " ring-4 ring-blue-300")
          }
          onClick$={() => {
            isMobileMenu.value = !isMobileMenu.value;
            console.log("hello");
          }}
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-10 w-10 dark:text-slate-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      {/* -------------------- */}
      <div
        // role="dialog"
        aria-modal="true"
        id=""
        class={
          "z-20 w-1/2 flex-row justify-around gap-2  p-2 text-lg text-gray-900 dark:text-white lg:flex " +
          (isMobileMenu.value ? "flex w-full flex-col text-center" : " hidden")
        }
      >
        {app.isLoggedIn && (
          <>
            <Link
              href="/handleliste"
              class={
                " font-semibold leading-6  " +
                (loc.value === "handleliste" && "underline")
              }
              onClick$={() => {
                isMobileMenu.value = false;
                loc.value = "handleliste";
              }}
            >
              Handleliste
            </Link>
            {/* <Link
              href="#"
              class="text-md font-semibold leading-6 "
              onClick$={() => isMobileMenu.value = false}
            >
              Chat
            </Link> */}
            <Link
              href="/profil"
              class={
                " font-semibold leading-6  " +
                (loc.value === "profil" && "underline")
              }
              onClick$={() => {
                isMobileMenu.value = false;
                loc.value = "profil";
              }}
            >
              Profil
            </Link>
            <div class="inline ">
              <button
                onClick$={() => {
                  fetch(
                    import.meta.env.PUBLIC_SERVER_URL + "/api/auth/logout",
                    {
                      credentials: "include",
                    },
                  ).then((data) => {
                    if (data.status === 200) {
                      nav("/");
                      app.isLoggedIn = false;
                      isMobileMenu.value = false;
                    }
                  });
                }}
                class="text-sm font-semibold leading-6"
              >
                Logg ut <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </>
        )}
        {!app.isLoggedIn && (
          <Link
            href="/logg-inn"
            class="text-md  font-semibold leading-6 "
            onClick$={() => (isMobileMenu.value = !isMobileMenu.value)}
          >
            Logg inn <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
        <button
          class="relative mx-auto flex h-4 w-9 items-center rounded-full p-1 shadow transition duration-300 dark:outline  dark:outline-1 lg:mx-0"
          onClick$={() => {
            if (app.theme === "dark") {
              app.theme = "light";
            } else app.theme = "dark";
            themeToggleAction.submit();
          }}
        >
          <LuSun class=" absolute left-0 transform transition duration-300 dark:left-auto dark:translate-x-5 dark:opacity-0" />
          <LuMoon class="absolute left-0 transform opacity-0 transition duration-300   dark:translate-x-5  dark:opacity-100" />
        </button>
      </div>
    </nav>
  );
});