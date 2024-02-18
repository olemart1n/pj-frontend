import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
} from "@builder.io/qwik";
import lottie from "lottie-web";
import { type LottieOptions } from "~/utilities/types/lottie";

export const QwikLottie = component$<LottieOptions>((options) => {
  const store = useStore({
    anim: noSerialize({}),
  });
  const divEl = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    store.anim = noSerialize(
      lottie.loadAnimation({
        container: options.container || divEl.value,
        renderer: options.renderer || "svg",
        loop: options.loop || true,
        autoplay: options.autoplay || true,
        animationData: options.animationData,
        path: options.path,
        rendererSettings: options.rendererSettings,
        name: options.name,
      }),
    );
  });

  return <div ref={divEl}></div>;
});
