import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../components/LoginPage/UserProvider"; // Asegúrate de importar el contexto

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext); // 🔥 Accede al usuario desde el contexto
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const newSocket = io("http://localhost:8080", {
        withCredentials: true,
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket conectado con ID:", newSocket.id);
        newSocket.emit("joinRoom", user.id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Error de conexión del socket:", error);
      });

      setSocket(newSocket);

      return () => {
        console.log("🔌 Desconectando socket");
        newSocket.disconnect();
      };
    }
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
