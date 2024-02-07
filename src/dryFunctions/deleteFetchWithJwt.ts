/**
 *
 * @param {*} api route
 * @param {*} jwt.value
 * @returns response object from server
 */

import type { CookieValue } from "@builder.io/qwik-city";
export const deleteFetchWithJwt = async (
  route: string,
  cookie: CookieValue,
  formData: object,
) => {
  try {
    const req = await fetch(import.meta.env.PUBLIC_SERVER_URL + route, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${cookie.value}`,
      },
      body: JSON.stringify(formData),
    });
    return req.status;
  } catch (error) {
    console.log(error);
    return error;
  }
};
