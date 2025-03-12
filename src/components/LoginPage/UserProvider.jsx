import React, { createContext, useState, useEffect } from "react";
import fetchLoggedUser from "../../hooks/fetchLoggedUser";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const loadUser = async () => {
        const loggedUser = await fetchLoggedUser();
        setUser(loggedUser);
        setLoading(false);
      };
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
