import React, { useState } from "react";
import { createContext } from "react";

export const NofiticationContext = createContext();

export const ShowNotificationSend = ({ children }) => {
  const [notificationSend, setNotificationSend] = useState(false);

  const timeDurationNotification = (duration = 90000) => {
    setNotificationSend(true);

    setTimeout(() => {
      setNotificationSend(false);
    }, duration);
  };

  return (
    <NofiticationContext.Provider
      value={{
        notificationSend,
        timeDurationNotification,
      }}
    >
      {children}
    </NofiticationContext.Provider>
  );
};

export default ShowNotificationSend;
