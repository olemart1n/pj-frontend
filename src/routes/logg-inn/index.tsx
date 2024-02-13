import { component$, useSignal, $, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { appContext } from "~/context";
import { BtnWithLoader } from "~/components/UI/btn-with-loader";
export default component$(() => {
  const app = useContext(appContext);
  const nav = useNavigate();
  const isSigningUp = useSignal(false);
  const username = useSignal("");
  const email = useSignal("");
  const passord = useSignal("");
  const isLoading = useSignal(false);
  const errorMessage = useSignal<string | null>();
  const emailRef = useSignal<HTMLInputElement>();

  const sign = $(async () => {
    if (!emailRef.value?.validity.valid) return;
    isLoading.value = true;
    const req = await fetch(
      import.meta.env.PUBLIC_SERVER_URL + "/api/auth/sign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.value,
          password: passord.value,
          username: isSigningUp.value && username.value,
        }),
      },
    );

    const { data, error } = await req.json();
    if (data) {
      isLoading.value = false;
      app.isLoggedIn = true;
      nav("/");
    }
    if (error) {
      errorMessage.value = error as string;
      isLoading.value = false;
    }
    return { data, error };
  });

  return (
    <div class="mx-auto  ">
      <div class="mx-auto mt-16  grid w-fit space-y-4">
        <a
          href={import.meta.env.PUBLIC_SERVER_URL + "/api/auth/google"}
          class="group flex h-10 rounded-full border-2 border-gray-300 px-6 
 align-middle transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
        >
          <div class="relative  flex items-center justify-center space-x-4">
            <img
              src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
              class=" mx-3 w-5"
              alt="google logo"
              height={50}
              width={50}
            />
            <span class="block w-max text-sm font-semibold tracking-wide text-gray-700 transition duration-300 group-hover:text-blue-600 dark:text-white sm:text-base">
              Logg inn med Google
            </span>
          </div>
        </a>
        <a
          href={import.meta.env.PUBLIC_SERVER_URL + "/api/auth/github"}
          class="group flex h-10 rounded-full border-2 border-gray-300 px-6 align-middle transition duration-300 
 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
        >
          <div class="relative  flex items-center justify-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="mx-3 w-5 text-gray-700"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span class="block w-max text-sm font-semibold tracking-wide text-gray-700 transition duration-300 group-hover:text-blue-600 dark:text-white sm:text-base">
              Logg inn med Github
            </span>
          </div>
        </a>
      </div>
      <div class="mx-auto mt-10 w-1/2 sm:w-full sm:max-w-sm">
        <form class="space-y-6" preventdefault:submit>
          {isSigningUp.value && (
            <div>
              <label
                for="username"
                class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Brukernavn
              </label>
              <div class="mt-2">
                <input
                  id="username"
                  name="username"
                  bind:value={username}
                  type="text"
                  required
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >
              Mail addresse
            </label>
            <div class="mt-2">
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                bind:value={email}
                required
                class="text-md block w-full rounded-md border-0 py-1.5 pl-2 leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Passord
              </label>
              {!isSigningUp.value && (
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Glemt passord?
                  </a>
                </div>
              )}
            </div>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                bind:value={passord}
                autocomplete="current-password"
                required
                class="text-md block w-full rounded-md border-0 py-1.5 pl-2 leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>
          </div>
          <div>
            {errorMessage.value && (
              <p class="rounded bg-red-200 p-3">{errorMessage.value}</p>
            )}
          </div>
          <div>
            <BtnWithLoader
              isLoading={isLoading}
              onClick$={sign}
              // isDisabled={
              //   passord.value.length === 0 && email.value.length === 0
              // }
            >
              {isSigningUp.value ? "Registrer" : "Logg inn"}
            </BtnWithLoader>
          </div>
          <p class="mt-10 text-center text-sm text-gray-500 dark:text-white">
            Har du ikke bruker?
            <button
              onClick$={() => (isSigningUp.value = true)}
              class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Registrer
            </button>
          </p>
        </form>
      </div>
    </div>
  );
});
