import { Slot, component$ } from "@builder.io/qwik";
import { LuX } from "@qwikest/icons/lucide";
export interface TitleModal {
  title: string;
}
export const Modal = component$<TitleModal>((props) => {
  return (
    <div>
      <div class="flex h-full w-full">
        <h1>{props.title}</h1>
        <LuX />
      </div>
      <Slot />
    </div>
  );
});
