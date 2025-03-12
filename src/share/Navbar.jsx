import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BsSearch } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { RiVideoLine } from "react-icons/ri";
import { PiMessengerLogoBold } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import { BiMessageEdit } from "react-icons/bi";
import { VscError } from "react-icons/vsc";
import "./css/style.css";
import { UserContext } from "../components/LoginPage/UserProvider";
import CrearPublicacion from "../components/HomePage/CrearPublicacion";
import { FaInstagram } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import SearchResults from "./components/SearchResults";
import { useDispatch } from "react-redux";
import { setChat } from "../store/chatSlice";
import { useSocket } from "../context/SocketContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [searchActive, setSearchActive] = useState(false);
  const [messages, setMessages] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [inputSearchUser, setInputSearchUser] = useState("");
  const [allUsersByInput, getAllUsersByInput] = useFetch();
  const searchContainerRef = useRef(null);
  const textInput = useRef(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();
  const [allChatOneUser, getAllChatOneUser] = useFetch();
  const [searchUserForNewMessage, setsearchUserForNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState();
  const [allMessagesUser, setAllMessagesUser] = useState([]);
  const [newMessages, setNewMessages] = useState(false);

  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    const url = `http://localhost:8080/api/v1/mensajes/allmessages/${user?.id}`;
    getAllChatOneUser(url, getToken());
  }, [user?.id]);

  useEffect(() => {
    if (allChatOneUser) {
      setAllMessagesUser(allChatOneUser);
      console.log(allChatOneUser);
    }
  }, [allChatOneUser]);

  useEffect(() => {
    if (!socket) return;

    console.log("⚡ Navbar montado con socket:", socket.id);

    socket.onAny((event, ...args) => {
      console.log(`🕵️ Evento recibido en Navbar: ${event}`, args);

      if (event === "nuevo-mensaje") {
        const nuevoMensaje = args[0];
        console.log("📩 Mensaje recibido en Navbar desde onAny:", nuevoMensaje);

        setAllMessagesUser((prevMessages) => {
          console.log("📌 Prev Messages antes de buscar:", prevMessages);
          console.log("Nuevo Mensaje recibido:", nuevoMensaje);

          const chatExistente = prevMessages.find((chat) => {
            console.log(
              `🔍 Comparando chat existente: Chat Usuario ${chat.usuario.id} vs Mensaje Remitente ${nuevoMensaje.remitenteId}, Chat Usuario ${chat.usuario.id} vs Mensaje Destinatario ${nuevoMensaje.destinatarioId}`
            );

            return (
              chat.usuario.id === nuevoMensaje.remitenteId ||
              chat.usuario.id === nuevoMensaje.destinatarioId
            );
          });

          if (chatExistente) {
            console.log("✅ Chat existente encontrado:", chatExistente);
            return prevMessages.map((chat) =>
              chat.id === chatExistente.id
                ? {
                    ...chat,
                    ultimoMensaje: nuevoMensaje.texto,
                    remitente: nuevoMensaje.remitenteId,
                    updatedAt: nuevoMensaje.createdAt,
                  }
                : chat
            );
          } else {
            console.log(
              "🚨 No se encontró chat existente. Creando nuevo chat."
            );

            const nuevoChat = {
              id: nuevoMensaje.id,
              remitenteId: nuevoMensaje.remitenteId,
              destinatarioId: nuevoMensaje.destinatarioId,
              ultimoMensaje: nuevoMensaje.texto,
              updatedAt: nuevoMensaje.createdAt,
              usuario:
                nuevoMensaje.remitenteId === user.id
                  ? nuevoMensaje.destinatario
                  : nuevoMensaje.remitente,
            };

            console.log("✅ Nuevo chat creado:", nuevoChat);
            return [nuevoChat, ...prevMessages];
          }
        });
      }
    });

    return () => {
      console.log("🔌 Desmontando socket en Navbar");
      socket.offAny();
    };
  }, [socket, socket?.connected]);

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/users";
    getAllUsersByInput(url, getToken());
  }, []);

  const handleNavbarClick = () => {
    setSearchActive(false);
  };

  const handleSearchToggle = () => {
    setSearchActive((prevState) => !prevState);
  };

  const handleMoreToggle = () => {
    setShowMoreMenu((prevState) => !prevState); // Alternar la visibilidad del menú "Más"
  };

  const handleChange = () => {
    setInputSearchUser(textInput.current.value.toLowerCase().trim());
  };

  const cbFilterUser = (users) => {
    const byName = users.firstName.toLowerCase().includes(inputSearchUser);
    return byName;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchActive(false);
      }
    };

    if (searchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchActive]);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleOneChatMessage = (userRemitente) => {
    dispatch(setChat(userRemitente));
    if (selectedUserId !== "") {
      setSelectedUserId("");
      setNewMessages(false);
    }
  };

  const handleSearchUser = (e) => {
    const textInput = e.target.value;
    setsearchUserForNewMessage(textInput);
  };

  const cbFilterForNewMessage = (dates) => {
    const byName =
      dates.firstName.toLowerCase().includes(searchUserForNewMessage) ||
      dates.lastName.toLowerCase().includes(searchUserForNewMessage);
    return byName;
  };

  const handleSelectedUser = (userId) => {
    setSelectedUserId((prevSelect) => {
      if (prevSelect == userId) {
        return "";
      } else {
        return userId;
      }
    });
  };

  return (
    <>
      {searchActive && (
        <div ref={searchContainerRef} className="container_search_mode">
          {/* Navbar reducido */}
          <div className="container_buttons_search_mode">
            <div onClick={handleNavbarClick}>
              <FaInstagram className="logo_insta" />
            </div>
            <Link to={"/home"} className="link_button">
              <button
                className="button_nav_reducer"
                onClick={handleNavbarClick}
              >
                <GoHome className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav_reducer button_busqueda"
              onClick={handleSearchToggle}
            >
              <BsSearch className="icon_nav" />
            </button>
            <Link to={"/explore"} className="link_button">
              <button
                className="button_nav_reducer"
                onClick={handleNavbarClick}
              >
                <MdOutlineExplore className="icon_nav" />
              </button>
            </Link>
            <Link to={"/reels"} className="link_button">
              <button
                className="button_nav_reducer"
                onClick={handleNavbarClick}
              >
                <RiVideoLine className="icon_nav" />
              </button>
            </Link>
            <Link
              to={"/messages"}
              className="link_button"
              onClick={() => setMessages(true)}
            >
              <button
                className="button_nav_reducer"
                onClick={handleNavbarClick}
              >
                <PiMessengerLogoBold className="icon_nav" />
              </button>
            </Link>
            <Link to={"/notifications"} className="link_button">
              <button
                className="button_nav_reducer"
                onClick={handleNavbarClick}
              >
                <GoHeart className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav_reducer button_crear"
              onClick={() => setShowCreate(true)}
            >
              <FaRegSquarePlus className="icon_nav icon_create" />
            </button>
            <Link to={`/profile/${user?.id}`} className="link_button">
              <div className="button_nav_reducer" onClick={handleNavbarClick}>
                <img
                  src={user?.photoProfile}
                  alt=""
                  className="photo_nav_profile"
                />
                <button className="button_perfil"></button>
              </div>
            </Link>
            <button className="button_nav" onClick={handleMoreToggle}>
              <MdMoreVert className="icon_nav" />
            </button>
          </div>
          {showCreate && (
            <CrearPublicacion
              setShowCreate={setShowCreate}
              showCreate={showCreate}
            />
          )}
          <div className="search-block">
            <h1>Busqueda</h1>
            <form onChange={handleChange}>
              <input
                ref={textInput}
                type="text"
                className="search-input"
                placeholder="Buscar usuarios..."
              />
            </form>

            <div className="search-results">
              {allUsersByInput?.filter(cbFilterUser).map((users) => (
                <SearchResults key={users?.id} users={users} />
              ))}
            </div>
          </div>
        </div>
      )}

      {messages && (
        <div className="container_messages_mode">
          <div className="container_buttons_messages_mode">
            <Link
              to={"/home"}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <div>
                <FaInstagram className="logo_insta" />
              </div>
            </Link>
            <Link
              to={"/home"}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <button className="button_nav_reducer">
                <GoHome className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav_reducer button_busqueda"
              onClick={handleSearchToggle}
            >
              <BsSearch className="icon_nav" />
            </button>
            <Link
              to={"/explore"}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <button className="button_nav_reducer">
                <MdOutlineExplore className="icon_nav" />
              </button>
            </Link>
            <Link
              to={"/reels"}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <button className="button_nav_reducer">
                <RiVideoLine className="icon_nav" />
              </button>
            </Link>
            <Link to={"/messages"} className="link_button">
              <button className="button_nav_reducer">
                <PiMessengerLogoBold className="icon_nav" />
              </button>
            </Link>
            <Link
              to={"/notifications"}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <button className="button_nav_reducer">
                <GoHeart className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav_reducer button_crear"
              onClick={() => setShowCreate(true)}
            >
              <FaRegSquarePlus className="icon_nav icon_create" />
            </button>
            <Link
              to={`/profile/${user?.id}`}
              className="link_button"
              onClick={() => setMessages(false)}
            >
              <div className="button_nav_reducer">
                <img
                  src={user?.photoProfile}
                  alt=""
                  className="photo_nav_profile"
                />
                <button className="button_perfil"></button>
              </div>
            </Link>
            <button className="button_nav_reducer" onClick={handleMoreToggle}>
              <MdMoreVert className="icon_nav" />
            </button>
          </div>
          {showCreate && (
            <CrearPublicacion
              setShowCreate={setShowCreate}
              showCreate={showCreate}
            />
          )}
          <div className="container_all_messages">
            <div className="container_userId_messages">
              <h2>
                {user?.firstName.toLowerCase()}
                {user?.lastName.toLowerCase()}
              </h2>
              <BiMessageEdit
                className="icon_newMessage"
                onClick={() => setNewMessages((prev) => !prev)}
              />
            </div>
            {newMessages && (
              <div className="container_newMessage_Navbar">
                <div className="content_newMessage_Navbar">
                  <div className="container_textNewMessage_and_buttonExit">
                    <h4>Nuevo mensaje</h4>
                    <VscError
                      className="buttonExit_modalNewMessage_Navbar"
                      onClick={() => setNewMessages((prev) => !prev)}
                    />
                  </div>
                  <div className="container_inputNewMessage_Navbar">
                    <h4>Para:</h4>{" "}
                    <input
                      type="text"
                      placeholder="Busca..."
                      className="inputNewMessage_Navbar"
                      onInput={handleSearchUser}
                    />
                  </div>
                  <div className="container_sugerencias_newMessages_forNewMessage">
                    <h4 className="suggestions_newMessages_forNewMessage">
                      Sugerencias
                    </h4>
                    {allMessagesUser?.length > 0 &&
                    searchUserForNewMessage.length < 1 ? (
                      <div className="content_sugerencias_newMessages_forNewMessage">
                        {allMessagesUser?.map((chats) => (
                          <div
                            key={chats.id}
                            className="container_selectUser_forNewMessage"
                          >
                            <img src={chats.usuario.photoProfile} alt="" />
                            <h4>
                              {chats.usuario.firstName}
                              <span className="span_namesUser_forNewMessage"></span>
                              {chats.usuario.lastName}
                            </h4>
                            <div
                              className={`circle_selectUser_forNewMessage ${selectedUserId == chats.usuario.id && "circle_selectUser_forNewMessage_ACT"}`}
                              onClick={() =>
                                handleSelectedUser(chats.usuario.id)
                              }
                            >
                              {selectedUserId == chats.usuario.id && (
                                <span className="checkList_newMessage">✔</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {user.seguidos.length > 0 ? (
                          <div>
                            {user.seguidos
                              .filter(cbFilterForNewMessage)
                              .map((chats) => (
                                <div
                                  key={chats.id}
                                  className="container_selectUser_forNewMessage"
                                >
                                  <img src={chats.photoProfile} alt="" />
                                  <h4>
                                    {chats.firstName}
                                    <span className="span_namesUser_forNewMessage"></span>
                                    {chats.lastName}
                                  </h4>
                                  <div
                                    className={`circle_selectUser_forNewMessage ${selectedUserId !== "" && "circle_selectUser_forNewMessage_ACT"}`}
                                    onClick={() =>
                                      handleSelectedUser(chats.usuario.id)
                                    }
                                  >
                                    {selectedUserId == chats.usuario.id && (
                                      <span className="checkList_newMessage">
                                        ✔
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="no_users_followed">
                            <h3>
                              Debes seguir a usuarios para enviar un mensaje
                            </h3>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedUserId !== "" ? (
                      <button
                        className="buttonChat_selectUser_forNewMessage_ACT"
                        onClick={() => handleOneChatMessage(selectedUserId)}
                      >
                        Chat
                      </button>
                    ) : (
                      <button className="buttonChat_selectUser_forNewMessage">
                        Chat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="container_profiles_notes"></div>
            <div>
              <div className="container_messages_requests">
                <h4>Mensajes</h4>
                <h4>Solicitudes</h4>
              </div>
              <div className="container_allUsers_allMessages">
                {allMessagesUser?.map((mess) => (
                  <div
                    key={mess?.id}
                    className="container_oneUser_allMessage"
                    onClick={() => handleOneChatMessage(mess?.usuario.id)}
                  >
                    <img
                      src={mess?.usuario.photoProfile}
                      alt=""
                      className="photoUser_messages"
                    />
                    <div className="container_firstName_texto">
                      <h4>
                        {mess?.usuario.firstName} <span></span>{" "}
                        {mess?.usuario.lastName}{" "}
                      </h4>
                      {mess?.remitente == user.id ? (
                        <h5 className="ultMen_remitente_userLogue">
                          Tú: {mess?.ultimoMensaje}
                        </h5>
                      ) : (
                        <h5 className="ultMen_remitente_userOtherScreen">
                          {mess?.ultimoMensaje}
                        </h5>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container_all_navbar">
        {!showMoreMenu ? (
          <div className="container_buttons_nav">
            <div className="name_insta">
              <h3>Instagram</h3>
            </div>
            {/* Botones principales */}
            <Link to={"/home"} className="link_button">
              <button className="button_nav">
                <GoHome className="icon_nav icon_home" />
                <h3>Inicio</h3>
              </button>
            </Link>
            <button
              className="button_nav button_busqueda"
              onClick={handleSearchToggle}
            >
              <BsSearch className="icon_nav" />
              <h3>Busqueda</h3>
            </button>
            <Link to={"/explore"} className="link_button">
              <button className="button_nav">
                <MdOutlineExplore className="icon_nav" />
                <h3>Explorar</h3>
              </button>
            </Link>
            <Link to={"/reels"} className="link_button">
              <button className="button_nav">
                <RiVideoLine className="icon_nav" />
                <h3>Reels</h3>
              </button>
            </Link>
            <Link
              to={"/messages"}
              className="link_button"
              onClick={() => setMessages(true)}
            >
              <button className="button_nav">
                <PiMessengerLogoBold className="icon_nav" />
                <h3>Mensajes</h3>
              </button>
            </Link>
            <Link to={"/notifications"} className="link_button">
              <button className="button_nav">
                <GoHeart className="icon_nav" />
                <h3>Notificaciones</h3>
              </button>
            </Link>
            <button
              className="button_nav button_crear"
              onClick={() => setShowCreate(true)}
            >
              <FaRegSquarePlus className="icon_nav" />
              <h3>Crear</h3>
            </button>
            <Link to={`/profile/${user?.id}`} className="link_button">
              <div className="button_nav">
                <img
                  src={user?.photoProfile}
                  alt=""
                  className="photo_nav_profile"
                />
                <button className="button_perfil">
                  <h3>Perfil</h3>
                </button>
              </div>
            </Link>
            <button className="button_nav" onClick={handleMoreToggle}>
              <MdMoreVert className="icon_nav" />
              <h3>Mas</h3>
            </button>
          </div>
        ) : (
          <div className="container_buttons_more_menu">
            {/* Menú expandido */}
            <button className="button_nav" onClick={handleMoreToggle}>
              <MdMoreVert className="icon_nav" />
              <h3>Volver</h3>
            </button>
            <button className="button_nav">
              <h3>Configuración</h3>
            </button>
            <button className="button_nav" onClick={handleCerrarSesion}>
              <h3>Cerrar Sesión</h3>
            </button>
          </div>
        )}
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
