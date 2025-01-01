// import React, { createContext, useState, useEffect } from 'react';
// import fetchLoggedUser from '../../hooks/fetchLoggedUser';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       const loggedUser = await fetchLoggedUser();
//       setUser(loggedUser);
//       setLoading(false);
//     };
//     loadUser();
//   }, [[localStorage.getItem('token')]]);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import fetchLoggedUser from "../../hooks/fetchLoggedUser";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtén el token una sola vez
    if (token) {
      const loadUser = async () => {
        const loggedUser = await fetchLoggedUser();
        setUser(loggedUser);
        setLoading(false);
      };
      loadUser();
    } else {
      setLoading(false); // Si no hay token, no hay necesidad de cargar usuario
    }
  }, []); // Array vacío asegura que se ejecute solo al montar

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
