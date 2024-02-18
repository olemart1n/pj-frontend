import { component$, useSignal } from "@builder.io/qwik";
import { BtnWithLoader } from "~/components/UI/btn-with-loader";
import { QwikLottie } from "~/components/UI/qwik-lottie";
import lottieLoaderJson from "../../utilities/lottie-json/lottie-loader.json";
export default component$(() => {
  const isLoading = useSignal(false);
  const showAnimation = useSignal(false);
  return (
    <>
      <h1 class="dark:text-white">Devving components</h1>
      {showAnimation.value && <QwikLottie animationData={lottieLoaderJson} />}
      <div class="align-center flex h-full w-full flex-row ">
        <BtnWithLoader
          isLoading={isLoading}
          onClick$={() => (showAnimation.value = true)}
        >
          Hello
        </BtnWithLoader>
      </div>
    </>
  );
});
