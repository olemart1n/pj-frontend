export const locallySaveIngredient = (key: string, value: any) => {
  const filteredData = Object.entries(value).reduce<{
    [key: string]: string | {};
  }>((acc, [key, value]) => {
    if (value != null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const submitData = {
    ...filteredData,
    purchased: false,
    id: Math.floor(Math.random() * 3000),
  };

  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([submitData]));

    return;
  }

  const localData = localStorage.getItem(key);
  const initialArr = localData && JSON.parse(localData);
  initialArr.push(submitData);
  localStorage.setItem(key, JSON.stringify(initialArr));
};
