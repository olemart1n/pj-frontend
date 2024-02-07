/**
 *
 * @param {*} api route
 * @param {*} jwt token as cookie
 * @returns data from server
 */

import type { CookieValue } from "@builder.io/qwik-city";
export const getFetchWithJwt = async (route: string, cookie: CookieValue) => {
  try {
    const req = await fetch(import.meta.env.PUBLIC_SERVER_URL + route, {
      headers: {
        Cookie: `jwt=${cookie.value}`,
      },
    });
    return await req.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};
