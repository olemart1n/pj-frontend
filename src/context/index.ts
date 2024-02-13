import { createContextId } from "@builder.io/qwik";

export interface App {
  isLoggedIn: boolean;
  ping: boolean;
  theme: string;
  listDeleted: boolean;
}
export const appContext = createContextId<App>("appContext");
