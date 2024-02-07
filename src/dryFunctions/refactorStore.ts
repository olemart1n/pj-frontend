export const refactorStore = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && "value" in obj[key]) {
      obj[key] = obj[key].value;
    }
  });
};
