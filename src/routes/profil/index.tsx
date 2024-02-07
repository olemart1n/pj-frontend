import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { dataOrError, getFetchWithJwt } from "~/dryFunctions";
export const useDbGetUser = routeLoader$(async (reqEv) => {
  const cookie = reqEv.cookie.get("jwt");
  if (!cookie) return;
  const res = await getFetchWithJwt("/api/users/user", cookie);
  console.log(res);
  return dataOrError(res);
});
export default component$(() => {
  const isDeleting = useSignal(false);
  const routeData = useDbGetUser();
  const deleteUser = $(async () => {
    await fetch(import.meta.env.PUBLIC_SERVER_URL + "/api/users/user/delete", {
      method: "DELETE",
      credentials: "include",
    });
  });
  if (!routeData.value) return <>No data retrieved</>;

  return (
    <div>
      <h1>Profil</h1>
      <section>
        {routeData.value.avatar.length > 0 && (
          <img
            src={routeData.value.avatar}
            alt="userpicture"
            width={50}
            height={50}
          />
        )}
        <h2>{routeData.value.username}</h2>
        <p>{routeData.value.email}</p>
      </section>
      <button
        class="my-10 rounded bg-slate-600 p-2 hover:bg-slate-400 "
        onClick$={() => (isDeleting.value = !isDeleting.value)}
      >
        Slett bruker
      </button>
      {isDeleting.value && (
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-zinc-900 bg-slate-100  p-3">
          <p>Din bruker og alle dine data vil bli slette fra systemet</p>
          <p class="my-2">
            Konfirmer: <input type="checkbox"></input>
          </p>
          <button
            onClick$={deleteUser}
            class="mx-auto my-10 block rounded border border-slate-600 p-1 hover:bg-slate-400 "
          >
            Slett bruker
          </button>
        </div>
      )}
    </div>
  );
});
