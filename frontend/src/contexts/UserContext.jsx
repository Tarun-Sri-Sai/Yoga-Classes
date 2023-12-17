import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ token: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const localStorageKey = "yogaLogin";

  const updateInfo = () => {
    const dataString =
      localStorage.getItem("yogaLogin") ??
      JSON.stringify({ token: null, isLoggedIn: false });

    const data = JSON.parse(dataString);

    setUser({token: data.token})
    setIsLoggedIn(data.isLoggedIn)
  };

  const loginUser = (token) => {
    const value = {
      token: token,
      isLoggedIn: true,
    };

    localStorage.setItem(localStorageKey, JSON.stringify(value));
    updateInfo();
  };

  const logoutUser = () => {
    const value = {
      token: null,
      isLoggedIn: false,
    };

    localStorage.setItem(localStorageKey, JSON.stringify(value));
    updateInfo();
  };

  const contextValue = {
    user,
    loginUser,
    logoutUser,
    isLoggedIn,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
