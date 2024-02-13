import { component$, useSignal } from "@builder.io/qwik";
import { BtnWithLoader } from "~/components/UI/btn-with-loader";
export default component$(() => {
  const isLoading = useSignal(false);
  return (
    <>
      <h1>Devving components</h1>
      <div class="align-center flex h-full w-full flex-row ">
        <BtnWithLoader
          isLoading={isLoading}
          onClick$={() => console.log("hello")}
        >
          Hello
        </BtnWithLoader>
      </div>
    </>
  );
});
