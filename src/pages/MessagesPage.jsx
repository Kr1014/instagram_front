import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/messagesPage.css";
import { useSelector } from "react-redux";
import { PiMessengerLogo } from "react-icons/pi";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import { LuPhone } from "react-icons/lu";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { CiCircleInfo } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { UserContext } from "../components/LoginPage/UserProvider";
import { useNavigate } from "react-router-dom";
import { HiOutlineMicrophone } from "react-icons/hi";
import { GrGallery } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "../context/SocketContext";
import EmojiPicker from "emoji-picker-react";

const MessagesPage = () => {
  const chat = useSelector((store) => store.oneChat);
  const [allChatOneUser, getAllChatOneUser] = useFetch();
  const [allMessagesUser, setAllMessagesUser] = useState([]);
  const [containerHeight, setContainerHeight] = useState(40);
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const { user } = useContext(UserContext);
  const textArea = useRef();
  const containerTextAreaMessageRef = useRef();
  const socket = useSocket();
  const messagesContainerRef = useRef();
  const lastMessageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  const [textAreaMessage, setTextAreaMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (chat) {
      const url = `http://localhost:8080/api/v1/mensajes/${chat}`;
      getAllChatOneUser(url, getToken());
    }
  }, [chat]);

  useEffect(() => {
    if (allChatOneUser) {
      setAllMessagesUser(allChatOneUser);
    }
  }, [allChatOneUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("nuevo-mensaje", (nuevoMensaje) => {
      console.log("Mensaje recibido en frontend:", nuevoMensaje);
      setAllMessagesUser((prevMessages) => {
        const exists = prevMessages.some(
          (message) => message.uuid === nuevoMensaje.uuid
        );
        return exists ? prevMessages : [...prevMessages, nuevoMensaje];
      });
    });

    return () => {
      socket.off("nuevo-mensaje");
    };
  }, [socket]);

  console.log("🟢 Socket en MessagesPage:", socket?.id);

  useEffect(() => {
    if (!socket) return;

    socket.on("nuevo-mensaje", (nuevoMensaje) => {
      console.log("📩 Mensaje recibido en MessagesPage:", nuevoMensaje);
    });

    return () => {
      socket.off("nuevo-mensaje");
    };
  }, [socket]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessagesUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const windowHeight = window.innerHeight;
      const newMessagesHeight = windowHeight - (containerHeight + 100);
      messagesContainerRef.current.style.height = `${newMessagesHeight}px`;

      console.log(newMessagesHeight);
      console.log(containerHeight);

      // ⚡ Asegurar que el scroll esté en el último mensaje
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 520);
    }
  }, [containerHeight]);

  useEffect(() => {
    if (containerTextAreaMessageRef.current) {
      const imagesHeigth = selectedImage ? 130 : 40;
      const maxHeigthConta = selectedImage ? 240 : 160;
      const heightContentTextAreaText = textArea.current.clientHeight;
      const totalHeight = imagesHeigth + heightContentTextAreaText - 40;
      containerTextAreaMessageRef.current.style.height = `${totalHeight}px`;
      containerTextAreaMessageRef.current.style["max-height"] =
        `${maxHeigthConta}px`;
      setContainerHeight(totalHeight);
    }
  }, [selectedImage]);

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "40px";
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (textarea.scrollHeight > 150) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }

    // Ajustar el scroll del contenedor de mensajes
    if (messagesContainerRef.current) {
      const imagesHeigth = selectedImage ? 90 : 0;
      const windowHeight = window.innerHeight;
      const newMessagesHeight =
        windowHeight - (textarea.scrollHeight + imagesHeigth + 100);
      // messagesContainerRef.current.style.height = `${newMessagesHeight}px`;
      const totalHeightMessages =
        newMessagesHeight < 356 && selectedImage == null
          ? 358
          : newMessagesHeight < 270 && selectedImage !== null
            ? 270
            : newMessagesHeight;
      messagesContainerRef.current.style.height = `${totalHeightMessages}px`;
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }

    if (containerTextAreaMessageRef.current) {
      const imagesHeigth = selectedImage ? 90 : 0;
      containerTextAreaMessageRef.current.style.height = `${textarea.scrollHeight + imagesHeigth}px`;
    }
  };

  const handleInputChange = () => {
    setTextAreaMessage(textArea.current.value);
  };

  const handleNavigateProfile = () => {
    navigate(`/profile/${chat}`);
  };

  const handleSendMessage = () => {
    if (textAreaMessage.trim() === "") return;

    if (!socket) {
      console.error("Socket no está inicializado.");
      return;
    }

    const uuid = uuidv4();
    const newMessage = {
      texto: textAreaMessage,
      destinatarioId: chat,
      remitenteId: user?.id,
      uuid,
      contentMultimedia: selectedImage,
    };

    console.log("Enviando mensaje desde frontend:", newMessage);

    socket.emit("enviar-mensaje", newMessage, (response) => {
      if (response.status === "success") {
        console.log("Mensaje enviado con éxito:", response.mensaje);
        setTextAreaMessage("");
        setSelectedImage(null);
      } else {
        console.error("Error al enviar el mensaje:", response.message);
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen.");
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleEmojiClick = (emojiData) => {
    if (!textArea.current) return;

    const cursorPos = textArea.current.selectionStart;

    setTextAreaMessage((prevText) => {
      const textBeforeCursor = prevText.slice(0, cursorPos);
      const textAfterCursor = prevText.slice(cursorPos);
      const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;

      // Esperar a que el estado se actualice antes de modificar el cursor
      setTimeout(() => {
        if (textArea.current) {
          textArea.current.selectionStart = cursorPos + emojiData.emoji.length;
          textArea.current.selectionEnd = cursorPos + emojiData.emoji.length;
          textArea.current.focus();
        }
      }, 0);

      return newText; // Retornar el nuevo valor correctamente actualizado
    });
  };

  return (
    <div className="container_one_allChat">
      {chat === null ? (
        <div className="container_new_message">
          <div className="container_logo_messenger">
            <PiMessengerLogo className="logo_messenger_oneChat" />
          </div>
          <h3>Tus mensajes</h3>
          <p>Envía fotos y mensajes privados a un amigo o grupo</p>
          <button>Enviar mensaje</button>
        </div>
      ) : (
        <div className="container_one_chat_user">
          {allMessagesUser && allMessagesUser.length > 0 ? (
            <>
              <div className="container_nameAndIcons_one_chat">
                {allMessagesUser[0]?.remitente?.id == user.id ? (
                  <div className="container_remitenteUser_nameAndIcons_one_chat">
                    <img
                      src={allMessagesUser[0]?.destinatario?.photoProfile || ""}
                      alt="Foto de perfil"
                      className="img_one_chat_user"
                    />
                    <h3>{allMessagesUser[0]?.destinatario?.firstName}</h3>
                    <div className="container_Icons_one_chat">
                      <LuPhone className="icon_one_chat" />
                      <AiOutlineVideoCamera className="icon_one_chat" />
                      <CiCircleInfo className="icon_one_chat" />
                    </div>
                  </div>
                ) : (
                  <div className="container_remitenteUser_nameAndIcons_one_chat">
                    <img
                      src={allMessagesUser[0]?.remitente?.photoProfile || ""}
                      alt="Foto de perfil"
                      className="img_one_chat_user"
                    />
                    <h3>{allMessagesUser[0]?.remitente?.firstName}</h3>
                    <div className="container_Icons_one_chat">
                      <LuPhone className="icon_one_chat" />
                      <AiOutlineVideoCamera className="icon_one_chat" />
                      <CiCircleInfo className="icon_one_chat" />
                    </div>
                  </div>
                )}
              </div>
              <div
                className="container_messages_one_chat"
                ref={messagesContainerRef}
              >
                <div className="container_info_user_chat">
                  {allMessagesUser[0]?.remitente?.id == user?.id ? (
                    <div className="container_remitenteUser_info_user_chat">
                      <img
                        src={
                          allMessagesUser[0]?.destinatario?.photoProfile || ""
                        }
                        alt="Foto de perfil"
                        className="img_one_info_chat"
                      />
                      <h3>
                        {allMessagesUser[0]?.destinatario?.firstName}{" "}
                        <span></span>{" "}
                        {allMessagesUser[0]?.destinatario?.lastName}
                      </h3>
                      <h4>
                        {allMessagesUser[0]?.destinatario?.userName}{" "}
                        <span></span> - Instagram
                      </h4>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={allMessagesUser[0]?.remitente?.photoProfile || ""}
                        alt="Foto de perfil"
                        className="img_one_chat_user"
                      />
                      <h3>
                        {allMessagesUser[0]?.remitente?.firstName}
                        <span> {""}</span>
                        {allMessagesUser[0]?.remitente?.lastName}
                      </h3>
                    </div>
                  )}
                  <button onClick={handleNavigateProfile}>Ver perfil</button>
                </div>
                {allMessagesUser.map((messageUser, index) => (
                  <div
                    key={messageUser.id}
                    ref={
                      index === allMessagesUser.length - 1
                        ? lastMessageRef
                        : null
                    }
                    className={
                      messageUser?.remitenteId !== user.id
                        ? "content_messages_otherUser"
                        : "content_messages_userLog"
                    }
                  >
                    {messageUser?.remitenteId !== user.id && (
                      <img
                        src={messageUser?.remitente?.photoProfile || ""}
                        alt=""
                        className="img_one_chat_message"
                      />
                    )}
                    <p>{messageUser?.texto}</p>
                  </div>
                ))}
              </div>
              <div>
                <div
                  className={`container_textarea_message`}
                  ref={containerTextAreaMessageRef}
                >
                  {selectedImage && (
                    <div className="preview-container">
                      <img
                        src={selectedImage}
                        alt="Previsualización"
                        className="preview-image"
                      />
                      <button
                        className="delete-image-btn_MessagesPage"
                        onClick={() => setSelectedImage(null)}
                      >
                        ✖
                      </button>
                    </div>
                  )}

                  <div className="content_areaMessageAndIcons">
                    <BsEmojiSmile
                      className="emojis_textarea"
                      onClick={() => setshowEmojiPicker((prev) => !prev)}
                    />

                    <textarea
                      ref={textArea}
                      placeholder="Envia un mensaje"
                      onInput={handleInput}
                      onChange={handleInputChange}
                      value={textAreaMessage}
                    />

                    {textAreaMessage.length > 0 || selectedImage !== null ? (
                      <button
                        className="button_sendMessage_textarea"
                        onClick={handleSendMessage}
                      >
                        Enviar
                      </button>
                    ) : (
                      <div className="container_icons_textarea">
                        <HiOutlineMicrophone className="iconMicrophone_textarea" />
                        <div>
                          <label htmlFor="imgForMessage">
                            <GrGallery className="iconGallery_textarea" />
                          </label>
                          <input
                            id="imgForMessage"
                            type="file"
                            className="input_selectImage_message"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {showEmojiPicker && (
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    className="containerEmojisComponentMessage"
                  />
                )}
              </div>
            </>
          ) : (
            <p>Cargando chat...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
