import { component$, $ } from "@builder.io/qwik";

export default component$(() => {
  const testFunc = $(async () => {
    const req = await fetch(import.meta.env.PUBLIC_SERVER_URL + "/test", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await req.json();
    console.log(data);
  });
  return (
    <div>
      Hello Qwik!
      <button onClick$={testFunc}>Test cookies </button>
    </div>
  );
});
