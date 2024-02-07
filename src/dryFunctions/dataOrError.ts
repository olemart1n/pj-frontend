interface User {
  user_id: string;
  email: string;
  username: string;
  avatar: string;
}

interface DataOrError {
  data: User | null;
  error: User | null;
}
export const dataOrError = (res: DataOrError) => {
  const { data, error } = res;
  if (data) {
    return data;
  } else return error;
};
