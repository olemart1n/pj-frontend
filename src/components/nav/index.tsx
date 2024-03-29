import { component$, useSignal, type Signal } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Icon } from "./icon";
import { appContext } from "~/context";
import { useContext } from "@builder.io/qwik";
import { LuSun, LuMoon, LuMoreVertical } from "@qwikest/icons/lucide";
import { useSetThemeCookie } from "~/routes/layout";
import { useLogOut } from "~/routes";
interface MobileMenu {
  isMobileMenu: Signal;
}
export default component$<MobileMenu>(({ isMobileMenu }) => {
  const app = useContext(appContext);
  const nav = useNavigate();
  const loc = useSignal<string>("/");
  const themeToggleAction = useSetThemeCookie();
  const logOut = useLogOut();
  return (
    <nav
      class={
        " mx-auto flex w-full flex-wrap items-center justify-between text-slate-200 lg:p-4 lg:px-8"
      }
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
            " -m-2.5 inline-flex items-center justify-center rounded-md p-2 text-slate-200 " +
            (isMobileMenu.value && " ring-4 ring-blue-300")
          }
          onClick$={() => {
            isMobileMenu.value = !isMobileMenu.value;
          }}
        >
          <span class="sr-only">Open main menu</span>
          <LuMoreVertical class="h-10 w-10 font-bold text-slate-800 dark:text-white" />
        </button>
      </div>
      {/* -------------------- */}
      <div
        // role="dialog"
        aria-modal="true"
        id=""
        class={
          "z-40 w-1/2 justify-around gap-2 p-2  text-lg text-gray-900 dark:text-white lg:flex lg:flex-row " +
          (isMobileMenu.value
            ? " fixed top-20 flex w-full flex-col bg-white text-center dark:bg-sky-950"
            : " hidden")
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
                loc.value = "handleliste";
                isMobileMenu.value = false;
              }}
            >
              Handleliste
            </Link>
            <Link
              href="/profil"
              class={
                " font-semibold leading-6  " +
                (loc.value === "profil" && "underline")
              }
              onClick$={() => {
                loc.value = "profil";
                isMobileMenu.value = false;
              }}
            >
              Profil
            </Link>
            <div class="inline ">
              <button
                onClick$={async () => {
                  const req = logOut.submit();
                  if ((await req).status) {
                    nav("/");
                    app.isLoggedIn = false;
                    isMobileMenu.value = false;
                  }
                }}
                class="text-sm font-semibold leading-6 "
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
            onClick$={() => (isMobileMenu.value = false)}
          >
            Logg inn <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
        <button
          class="relative mx-auto my-2 flex h-4 w-9 items-center rounded-full p-1 shadow shadow-gray-950 transition  duration-300 dark:outline dark:outline-1 lg:mx-0 lg:my-0"
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
