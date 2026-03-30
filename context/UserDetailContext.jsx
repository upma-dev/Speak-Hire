import { createContext } from "react";

export const UserDetailContext = createContext({
  user: null,
  loading: false,
  setUser: () => {},
});
