// import { type Signal, $ } from "@builder.io/qwik";
// import { type Ingredient } from "../types";
// import { mealContext } from "~/context";
// import { useContext } from "@builder.io/qwik";
// export const changePosition = $((isPurchased: boolean, isPurchasedList: Signal, notPurchasedList: Signal, ingToMove: Ingredient) => {

//     if (isPurchased) {

//     ingToMove.purchased = false;
//       const filtered: Ingredient[] = isPurchasedList.value.filter(
//         (ing: Ingredient) => ing.id !== props.id,
//       );
//       isPurchasedList.value = filtered;
//       mealState.notPurchased.push(ingToMove);
//     } else {

//       if (ingToMove) ingToMove.purchased = true;
//       const filtered: Ingredient[] = mealState.notPurchased.filter(
//         (ing: Ingredient) => ing.id !== props.id,
//       );
//       mealState.notPurchased = filtered;
//       ingToMove && mealState.purchased.push(ingToMove);
//     }
//   });

// export function promiseWaitForDestination(arg: Signal) {
//   return new Promise((resolve, reject) => {
//     const beforeChange = arg.value;
//     if (beforeChange !== arg.value) {
//       resolve("this is the new destinantion " + arg.value);
//     } else {
//       reject("Failed due to missing or falsy argument");
//     }
//   });
// }
