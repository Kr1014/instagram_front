import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./css/publicaciones.css";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { UserContext } from "../LoginPage/UserProvider";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import getToken from "../../utils/getToken";
import Comentarios from "./Comentarios";
import { BsSearch } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { FiUserPlus } from "react-icons/fi";
import { BsSave2 } from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";
import { BsSave2Fill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa6";
import { PiFacebookLogoBold } from "react-icons/pi";
import { LiaFacebookMessenger } from "react-icons/lia";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { FaThreads } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import useSend from "../../hooks/useSend";
import { NofiticationContext } from "./ShowNotificationSend";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { IoCameraOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";

const Publicaciones = ({ publicac }) => {
  const { user } = useContext(UserContext);
  const { timeDurationNotification } = useContext(NofiticationContext);
  const [commentPubli, setCommentPubli] = useState("");
  const [commentReplyId, setCommentReplyId] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [mainCommentPubli, setMainCommentPubli] = useState("");
  const [modalShareCommentMessage, setModalShareCommentMessage] = useState("");
  const [modalShowLikersOfPubliMain, setModalShowLikersOfPubliMain] =
    useState("");
  const [actMeGusta, setActMeGusta] = useState(false);
  const [modalComment, setModalComment] = useState(false);
  const [modalShare, setModalShare] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [selectUser, setSelectUser] = useState([]);
  const [userToLikePublic, setUserToLikePublic] = useState("");
  const [messageSharePubli, setMessageSharePubli] = useState("");
  const [searchUserByShare, setsearchUserByShare] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojisModalComment, setEmojisModalComment] = useState(false);
  const [momentaryComment, setMomentaryComment] = useState([]);
  const [searchUserModalShareFromComment, setSearchUserModalShareFromComment] =
    useState("");
  const [selectUserShareFromComment, setSelectUserShareFromComment] = useState(
    []
  );
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [savedPubli, setSavedPubli] = useState();
  const [showUsersLikers, setShowUsersLikers] = useState(false);
  const [modalShareFromComment, setModalShareComment] = useState(false);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const textAreaContainerRef = useRef(null);
  const refSearhUserByShare = useRef();
  const refMessageSharePubli = useRef();
  const refCommentPubli = useRef();
  const refInputForEmoji = useRef(null);
  const refEmojiModalComment = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setComentarios((prev) => {
      const idsPrevios = new Set(prev.map((c) => c.id));
      const nuevosComentarios =
        publicac?.comentarios?.filter((c) => !idsPrevios.has(c.id)) || [];

      return [...prev, ...nuevosComentarios];
    });
  }, [publicac]);

  useEffect(() => {
    const checkLike = async () => {
      if (!user || !publicac) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/megustas/${user.id}/${publicac?.id}`,
          getToken()
        );
        setActMeGusta(response.data.like);
      } catch (e) {
        console.error(
          `Error al verificar el estado de "Me gusta": ${e.message}`
        );
      }
    };

    checkLike();
  }, [user, publicac]);

  useEffect(() => {
    const followedUsers = async () => {
      try {
        const url = `http://localhost:8080/api/v1/seguidores/${user.id}/obtenerSeguidos`;
        const response = await axios.get(url, getToken());
        setShowAlllUsersFollowed(response.data);
      } catch (error) {
        console.error("Error obteniendo los usuarios seguidos:", error);
      }
    };
    followedUsers();
  }, [showAllUsersFollowed]);

  useEffect(() => {
    const checkSavedPubli = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${publicac?.id}`;
      const response = await axios.get(url, getToken());
      setSavedPubli(response.data);
    };

    checkSavedPubli();
  }, [user, publicac]);

  const handleMeGusta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/megustas/${publicac?.id}`,
        {},
        getToken()
      );
      setActMeGusta((prev) => !prev);
    } catch (e) {
      console.error(`Error al gestionar el "Me gusta": ${e.message}`);
    }
  };

  const handleComment = () => {
    setModalComment(true);
    setShowEmojiPicker(false);
  };

  const handleCloseComment = () => {
    setModalComment(false);
    setEmojisModalComment(false);
  };

  const handleTextComment = (e) => {
    setCommentPubli(e.target.value);
  };

  const agregarRespuesta = (comentarios, respuesta) => {
    return comentarios.map((comentario) => {
      if (comentario.id === respuesta.comentarioPadreId) {
        // Aseguramos que `respuestas` siempre sea un array antes de agregar una nueva respuesta
        return {
          ...comentario,
          respuestas: [...(comentario.respuestas || []), respuesta],
        };
      } else if (comentario.respuestas && comentario.respuestas.length > 0) {
        // Verificamos que `respuestas` no sea undefined antes de acceder a `.length`
        return {
          ...comentario,
          respuestas: agregarRespuesta(comentario.respuestas, respuesta),
        };
      }
      return comentario;
    });
  };

  const handlePublicComment = async () => {
    if (!commentPubli.trim()) return;

    try {
      const url = commentReplyId
        ? `http://localhost:8080/api/v1/comentarios/${commentReplyId}/responder`
        : `http://localhost:8080/api/v1/comentarios/${publicac?.id}`;

      const res = await axios.post(url, { texto: commentPubli }, getToken());
      console.log("Respuesta del backend: ", res.data);
      const nuevoComentario = res.data;

      setComentarios((prevComments) => {
        console.log("Prev Comments antes de actualizar:", prevComments);

        const updatedComments = prevComments.map((coment) => {
          if (coment.id === commentReplyId) {
            return {
              ...coment,
              respuestas: [...(coment.respuestas || []), nuevoComentario],
            };
          }
          return coment;
        });

        console.log("Updated Comments después de actualizar:", updatedComments);
        return commentReplyId
          ? updatedComments
          : [nuevoComentario, ...prevComments];
      });

      // Resetear estados
      setCommentPubli("");
      setCommentReplyId(null);
    } catch (error) {
      console.error("Error al publicar comentario/respuesta:", error);
    }
  };

  const handleCloseSharePublic = () => {
    setModalShare(false);
  };

  const handleSelectUserShare = (userId) => {
    setSelectUser((prevSelect) => {
      if (prevSelect.includes(userId)) {
        return prevSelect.filter((id) => id !== userId);
      } else {
        return [...prevSelect, userId];
      }
    });
  };

  const handleMessageSharePubli = () => {
    setMessageSharePubli(refMessageSharePubli.current.value.trim());
  };

  const handleSendMessageSharePubli = () => {
    const url = "http://localhost:8080/api/v1/mensajes";
    selectUser.map((userId) =>
      useSend(
        url,
        {
          texto: messageSharePubli,
          contentMultimedia: publicac?.contentUrl,
          destinatarioId: userId,
        },
        getToken()
      )
    );
    setModalShare(false);
    timeDurationNotification(3000);
  };

  const handleRefSearchUserByShare = () => {
    setsearchUserByShare(refSearhUserByShare.current.value);
  };

  const filterUserByShare = (users) => {
    const userByShare =
      users.firstName.toLowerCase().includes(searchUserByShare) ||
      users.lastName.toLowerCase().includes(searchUserByShare);
    return userByShare;
  };

  const handleSendSavePubli = async () => {
    const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${publicac?.id}`;
    const response = await axios.post(url, {}, getToken());
    setSavedPubli((prev) => !prev);
  };

  const handleInput = (e) => {
    const textarea = e.target;

    // Ajustar el tamaño del textarea
    textarea.style.height = "40px"; // Reseteamos a la altura mínima
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustamos la altura

    // Verificar si el textarea ha alcanzado su altura máxima
    const maxHeight = 70; // Altura máxima
    if (textarea.scrollHeight >= maxHeight) {
      textarea.style.overflowY = "auto"; // Mostrar la barra de desplazamiento
      textarea.style.height = `${maxHeight}px`; // Limitar la altura al máximo
    } else {
      textarea.style.overflowY = "hidden"; // Si no ha alcanzado el máximo, ocultamos la barra de desplazamiento
    }

    // Mover el contenedor anterior hacia arriba solo si el textarea no ha alcanzado su altura máxima
    const previousContainer = textAreaContainerRef.current;
    if (previousContainer && textarea.scrollHeight < maxHeight) {
      previousContainer.style.transform = `translateY(-${textarea.scrollHeight - 40}px)`;
    }
  };

  const handleCommentPubliMain = (e) => {
    const textarea = e.target;

    textarea.style.height = "30px";
    textarea.style.height = `${textarea.scrollHeight}px`;

    const maxHeight = 60; // Altura máxima
    if (textarea.scrollHeight >= maxHeight) {
      textarea.style.overflowY = "auto";
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.overflowY = "hidden";
    }

    const previousContainer = refCommentPubli.current;
    if (previousContainer && textarea.scrollHeight < maxHeight) {
      previousContainer.style.transform = `translateY(-${textarea.scrollHeight - 60}px)`;
    }
  };

  const handleMainTextCommentPubli = (e) => {
    setMainCommentPubli(e.target.value);
  };

  const handleMainPubliComment = async () => {
    const urlBase = "http://localhost:8080/api/v1/comentarios";
    const url = `${urlBase}/${publicac?.id}`;

    try {
      const res = await axios.post(
        url,
        { texto: mainCommentPubli },
        getToken()
      );
      console.log(res.data);
      setMainCommentPubli("");
      setMomentaryComment((prevComments) => [...prevComments, res.data]);
      console.log(momentaryComment);
    } catch (error) {
      console.error("Error al publicar el comentario:", error.message);
    }
  };

  const handleInputModalShareFromComment = (e) => {
    const valueInput = e.target.value;
    setSearchUserModalShareFromComment(valueInput);
  };

  const cbFilterUserModalShareFromComment = (users) => {
    const userForShow =
      users.firstName.toLowerCase().includes(searchUserModalShareFromComment) ||
      users.lastName.toLowerCase().includes(searchUserModalShareFromComment) ||
      users.userName.toLowerCase().includes(searchUserModalShareFromComment);
    return userForShow;
  };

  const handleSelectUserShareFromComment = (userId) => {
    setSelectUserShareFromComment((prevSelect) => {
      if (prevSelect.includes(userId)) {
        return prevSelect.filter((id) => id !== userId);
      } else {
        return [...prevSelect, userId];
      }
    });
  };

  const handleMessageModalShareComment = (e) => {
    const textMessage = e.target.value;
    setModalShareCommentMessage(textMessage);
  };

  const handleSendMessageModalShareComment = () => {
    const url = "http://localhost:8080/api/v1/mensajes";
    selectUserShareFromComment.map((userId) =>
      useSend(
        url,
        {
          texto: modalShareCommentMessage,
          contentMultimedia: publicac?.contentUrl,
          destinatarioId: userId,
        },
        getToken()
      )
    );
    setModalShareComment(false);
    timeDurationNotification(3000);
  };

  useEffect(() => {
    const likeToUserAndOthers = () => {
      const allUsersLikeToPublic = publicac?.likers;
      const getOneUserLikeToPublic = allUsersLikeToPublic.at(
        Math.floor(Math.random() * allUsersLikeToPublic.length)
      );
      setUserToLikePublic(getOneUserLikeToPublic);
    };
    likeToUserAndOthers();
  }, []);

  const handleNavigateProfileOneUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleSeguir = async (userId) => {
    try {
      const url = `http://localhost:8080/api/v1/seguidores/${userId}`;
      const response = await axios.post(url, {}, getToken());
    } catch (e) {
      console.error("Hubo un error", e);
    }
  };

  const handleSeguirMoreOptions = async () => {
    try {
      const url = `http://localhost:8080/api/v1/seguidores/${publicac?.userId}`;
      const response = await axios.post(url, {}, getToken());
      setIsFollowing((prev) => !prev);
    } catch (e) {
      console.error("Hubo un error", e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    if (!refInputForEmoji.current) return;

    const cursorPos = refInputForEmoji.current.selectionStart;

    setMainCommentPubli((prevText) => {
      const textBeforeCursor = prevText.slice(0, cursorPos);
      const textAfterCursor = prevText.slice(cursorPos);
      const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;

      // Esperar a que el estado se actualice antes de modificar el cursor
      setTimeout(() => {
        if (refInputForEmoji.current) {
          refInputForEmoji.current.selectionStart =
            cursorPos + emojiData.emoji.length;
          refInputForEmoji.current.selectionEnd =
            cursorPos + emojiData.emoji.length;
          refInputForEmoji.current.focus();
        }
      }, 0);

      return newText; // Retornar el nuevo valor correctamente actualizado
    });
  };

  const handleEmojisModalComment = (emojiData) => {
    if (!refEmojiModalComment.current) return;

    const cursorPos = refEmojiModalComment.current.selectionStart;

    setCommentPubli((prevText) => {
      const textBeforeCursor = prevText.slice(0, cursorPos);
      const textAfterCursor = prevText.slice(cursorPos);
      const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;

      // Esperar a que el estado se actualice antes de modificar el cursor
      setTimeout(() => {
        if (refEmojiModalComment.current) {
          refEmojiModalComment.current.selectionStart =
            cursorPos + emojiData.emoji.length;
          refEmojiModalComment.current.selectionEnd =
            cursorPos + emojiData.emoji.length;
          refEmojiModalComment.current.focus();
        }
      }, 0);

      return newText; // Retornar el nuevo valor correctamente actualizado
    });
  };

  const getFormattedDate = (date) => {
    const publicationDate = new Date(date);
    const now = new Date();
    const diffMilliseconds = now - publicationDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      // Si la publicación tiene menos de 24 horas, mostrar "hace X horas"
      return formatDistanceToNow(publicationDate, {
        addSuffix: true,
        locale: es,
        includeSeconds: true,
      });
    }

    if (diffDays > 5) {
      // Si la publicación es del mismo año, mostrar "7 de enero"
      if (publicationDate.getFullYear() === now.getFullYear()) {
        return format(publicationDate, "d 'de' MMMM", { locale: es });
      }
      // Si es de un año diferente, mostrar "7 de enero de 2023"
      return format(publicationDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    }

    // Si tiene entre 1 y 5 días, mostrar "hace X días"
    return formatDistanceToNow(publicationDate, {
      addSuffix: true,
      locale: es,
    });
  };

  const estructurarComentarios = (comentarios) => {
    const mapaComentarios = new Map();

    // Inicializar cada comentario en el mapa con respuestas vacías
    comentarios.forEach((comentario) => {
      mapaComentarios.set(comentario.id, { ...comentario, respuestas: [] });
    });

    // Construimos la estructura anidada
    const comentariosAnidados = [];

    comentarios.forEach((comentario) => {
      if (comentario.comentarioPadreId === null) {
        // Si es un comentario padre, lo agregamos al array final
        comentariosAnidados.push(mapaComentarios.get(comentario.id));
      } else {
        // Si es una respuesta, la agregamos dentro del comentario padre correspondiente
        const padre = mapaComentarios.get(comentario.comentarioPadreId);
        if (padre) {
          padre.respuestas.push(mapaComentarios.get(comentario.id));
        }
      }
    });

    return comentariosAnidados;
  };

  const comentariosEstructurados = useMemo(() => {
    const copiaComentarios = [...comentarios]; // 🔥 Asegurar nueva referencia
    return estructurarComentarios(copiaComentarios);
  }, [comentarios]);

  const handleNavigateOnePublicacion = (publicacionId) => {
    navigate(`/publicacion/${publicacionId}`);
  };

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !publicac) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/seguidores/${user?.id}/seguido/${publicac?.userId}`,
          getToken()
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error al verificar el seguimiento:", error.message);
      }
    };
    checkIfFollowing();
  }, [publicac?.id]);

  return (
    <>
      <div className="container_one_publicacion">
        <div className="onePubli_userName_photoProfile">
          <img
            src={publicac?.user.photoProfile}
            alt=""
            className="userPhoto_publicac"
            onMouseEnter={() => setModalShowProfileOneUser(publicac?.user.id)}
            onMouseLeave={() => setModalShowProfileOneUser(null)}
          />
          <h4
            onMouseEnter={() =>
              setModalShowProfileOneUser(publicac?.user.userName)
            }
            onMouseLeave={() => setModalShowProfileOneUser(null)}
          >
            {publicac?.user.userName}
          </h4>
          <SlOptions
            className="options_onePublicacion_homePage"
            onClick={() => setMoreOptions((prev) => !prev)}
          />
          {moreOptions && (
            <div className="container_modalMoreOptions_Publicaciones">
              <div className="content_modalMoreOptions_Publicaciones">
                <button className="button_giveUp_Publicaciones">
                  Denunciar
                </button>
                <div>
                  {" "}
                  {user.id == publicac?.userId ? (
                    <button
                      onClick={() => handleNavigateProfileOneUser(user?.id)}
                    >
                      Editar perfil
                    </button>
                  ) : (
                    <span>
                      {isFollowing ? (
                        <button
                          className="button_unfollow_modalOption_Publicaciones"
                          onClick={handleSeguirMoreOptions}
                        >
                          Dejar de seguir
                        </button>
                      ) : (
                        <button
                          className="button_follow_modalOptions_Publicaciones"
                          onClick={handleSeguirMoreOptions}
                        >
                          Seguir
                        </button>
                      )}
                    </span>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleNavigateOnePublicacion(publicac?.id)}
                  >
                    Ir a la publicacion
                  </button>
                </div>
                <div>
                  {" "}
                  <button>Compartir en</button>
                </div>
                <div>
                  <button>Copiar enlace</button>
                </div>
                <div>
                  <button>Codigo de insercion</button>
                </div>
                <div>
                  <button>Informacion de esta cuenta</button>
                </div>
                <div>
                  <button onClick={() => setMoreOptions((prev) => !prev)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {publicac?.contentUrl ? (
          publicac.contentUrl.endsWith(".mp4") ||
          publicac.contentUrl.endsWith(".webm") ? (
            <div className="container_video">
              <video controls className="contentVideo_publicac">
                <source src={publicac.contentUrl} type="video/mp4" />
                Tu navegador no soporta videos.
              </video>
            </div>
          ) : (
            <img
              src={publicac.contentUrl}
              alt="Publicación"
              className="image_public"
            />
          )
        ) : (
          <p>Contenido no disponible</p>
        )}

        {modalShowProfileOneUser === publicac?.user.id && (
          <div
            className="container_modal_modalShowProfileOneUser_publiMainPhoto"
            onMouseEnter={() => setModalShowProfileOneUser(publicac?.user.id)}
            onMouseLeave={() => setModalShowProfileOneUser(null)}
          >
            <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
              <img
                src={publicac?.user.photoProfile}
                alt="imgUser_modal_show_ProfileOneUser"
                className="imgUser_modal_show_ProfileOneUser"
                onClick={() => handleNavigateProfileOneUser(publicac?.user.id)}
              />
              <div className="container_names_userName_modalShowProfileOneUser">
                <h4
                  onClick={() =>
                    handleNavigateProfileOneUser(publicac?.user.id)
                  }
                  className="name_modalShowProfileOneUser"
                >
                  {publicac?.user.userName}
                </h4>
                <h4 className="userName_modalShowProfileOneUser">
                  {publicac?.user.firstName} {publicac?.user.lastName}
                </h4>
              </div>
            </div>

            <div className="container_dates_modalShowProfileOneUser">
              <div className="container_numberPublicacions_modalShowProfileOneUser">
                <h5>{publicac.user?.publicacions.length}</h5>
                <h4>Publicaciones</h4>
              </div>
              <div className="container_numberFollowers_modalShowProfileOneUser">
                <h5>{publicac.user?.seguidores.length}</h5>
                <h4>Seguidores</h4>
              </div>
              <div className="container_numberFollowed_modalShowProfileOneUser">
                <h5>{publicac.user?.seguidos.length}</h5>
                <h4>Seguidos</h4>
              </div>
            </div>
            <div>
              {publicac?.user.publicacions.length > 0 ? (
                <div className="container_AllPublicacions_modalShowProfileOneUser">
                  {publicac.user.publicacions
                    .slice(0, 3)
                    .map((publicsOneUser) => (
                      <div className="container_publicacions_modalShowProfileOneUser">
                        {publicsOneUser.contentUrl.endsWith(".mp4") ||
                        publicsOneUser.contentUrl.endsWith(".webm") ? (
                          <div
                            className="container_video_modalShowProfileOneUser"
                            onClick={() =>
                              handleNavigateOnePublicacion(publicsOneUser.id)
                            }
                          >
                            <video className="contentVideo_publicac_modalShowProfileOneUser">
                              <source
                                src={publicsOneUser.contentUrl}
                                type="video/mp4"
                              />
                              Tu navegador no soporta videos.
                            </video>
                          </div>
                        ) : (
                          <div className="container_img_modalShowProfileOneUser">
                            <img
                              src={publicsOneUser.contentUrl}
                              alt=""
                              className="img_publicac_modalShowProfileOneUser"
                              onClick={() =>
                                handleNavigateOnePublicacion(publicsOneUser.id)
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                  <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                  <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                  <h3>Aun no hay publicaciones</h3>
                  <p>
                    Cuando {publicac?.user.userName} comparta fotos y reels, los
                    verás aquí
                  </p>
                </div>
              )}
            </div>
            <div>
              {showAllUsersFollowed.some(
                (userSeguid) => userSeguid.id === publicac?.user.id
              ) ? (
                <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                  <div className="container_button_sendMessage_modalShowProfileOneUser">
                    <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                    <button className="button_sendMessage_modalShowProfileOneUser">
                      Enviar un mensaje
                    </button>
                  </div>
                  <button className="button_following_modalShowProfileOneUser">
                    Siguiendo
                  </button>
                </div>
              ) : (
                <div className="container_buttonFollow_modalShowProfileOneUser">
                  <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                  <button>Seguir</button>
                </div>
              )}
            </div>
          </div>
        )}
        {modalShowProfileOneUser === publicac?.user.userName && (
          <div
            className="container_modal_modalShowProfileOneUser_publiMainUserName"
            onMouseEnter={() =>
              setModalShowProfileOneUser(publicac?.user.userName)
            }
            onMouseLeave={() => setModalShowProfileOneUser(null)}
          >
            <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
              <img
                src={publicac?.user.photoProfile}
                alt="imgUser_modal_show_ProfileOneUser"
                className="imgUser_modal_show_ProfileOneUser"
                onClick={() => handleNavigateProfileOneUser(publicac?.user.id)}
              />
              <div className="container_names_userName_modalShowProfileOneUser">
                <h4
                  onClick={() =>
                    handleNavigateProfileOneUser(publicac?.user.id)
                  }
                  className="name_modalShowProfileOneUser"
                >
                  {publicac?.user.userName}
                </h4>
                <h4 className="userName_modalShowProfileOneUser">
                  {publicac?.user.firstName} {publicac?.user.lastName}
                </h4>
              </div>
            </div>

            <div className="container_dates_modalShowProfileOneUser">
              <div className="container_numberPublicacions_modalShowProfileOneUser">
                <h5>{publicac.user?.publicacions.length}</h5>
                <h4>Publicaciones</h4>
              </div>
              <div className="container_numberFollowers_modalShowProfileOneUser">
                <h5>{publicac.user?.seguidores.length}</h5>
                <h4>Seguidores</h4>
              </div>
              <div className="container_numberFollowed_modalShowProfileOneUser">
                <h5>{publicac.user?.seguidos.length}</h5>
                <h4>Seguidos</h4>
              </div>
            </div>
            <div>
              {publicac?.user.publicacions.length > 0 ? (
                <div className="container_AllPublicacions_modalShowProfileOneUser">
                  {publicac.user.publicacions
                    .slice(0, 3)
                    .map((publicsOneUser) => (
                      <div className="container_publicacions_modalShowProfileOneUser">
                        {publicsOneUser.contentUrl.endsWith(".mp4") ||
                        publicsOneUser.contentUrl.endsWith(".webm") ? (
                          <div
                            className="container_video_modalShowProfileOneUser"
                            onClick={() =>
                              handleNavigateOnePublicacion(publicsOneUser.id)
                            }
                          >
                            <video className="contentVideo_publicac_modalShowProfileOneUser">
                              <source
                                src={publicsOneUser.contentUrl}
                                type="video/mp4"
                              />
                              Tu navegador no soporta videos.
                            </video>
                          </div>
                        ) : (
                          <div className="container_img_modalShowProfileOneUser">
                            <img
                              src={publicsOneUser.contentUrl}
                              alt=""
                              className="img_publicac_modalShowProfileOneUser"
                              onClick={() =>
                                handleNavigateOnePublicacion(publicsOneUser.id)
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                  <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                  <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                  <h3>Aun no hay publicaciones</h3>
                  <p>
                    Cuando {publicac?.user.userName} comparta fotos y reels, los
                    verás aquí
                  </p>
                </div>
              )}
            </div>
            <div>
              {showAllUsersFollowed.some(
                (userSeguid) => userSeguid.id === publicac?.user.id
              ) ? (
                <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                  <div className="container_button_sendMessage_modalShowProfileOneUser">
                    <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                    <button className="button_sendMessage_modalShowProfileOneUser">
                      Enviar un mensaje
                    </button>
                  </div>
                  <button className="button_following_modalShowProfileOneUser">
                    Siguiendo
                  </button>
                </div>
              ) : (
                <div className="container_buttonFollow_modalShowProfileOneUser">
                  <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                  <button>Seguir</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="container_triButton_onePubli">
          {actMeGusta ? (
            <button
              className="custom_button button_like_act"
              onClick={handleMeGusta}
            >
              <IoMdHeart />
            </button>
          ) : (
            <div>
              <IoMdHeartEmpty
                className="custom_button button_like"
                onClick={handleMeGusta}
              />
            </div>
          )}
          <button className="custom_button" onClick={handleComment}>
            <FaRegComment />
          </button>
          <button className="custom_button" onClick={() => setModalShare(true)}>
            <FiSend />
          </button>
          <button className="custom_button">
            {savedPubli ? (
              <BsSave2Fill
                className="button_save_onePubli"
                onClick={handleSendSavePubli}
              />
            ) : (
              <BsSave2
                className="button_save_onePubli"
                onClick={handleSendSavePubli}
              />
            )}
          </button>
        </div>
        <div className="container_content_usersLiker_modalComment">
          {publicac?.likers.length > 0 && (
            <div>
              <h4>
                Le gusta a <span></span>
                <button
                  onClick={() =>
                    handleNavigateProfileOneUser(userToLikePublic.id)
                  }
                >
                  {userToLikePublic.userName}
                </button>
              </h4>
            </div>
          )}
          {publicac?.likers.length > 1 && (
            <div className="container_like_otherUsers">
              <p>y</p>
              <button onClick={() => setModalShowLikersOfPubliMain(true)}>
                personas mas
              </button>
            </div>
          )}
        </div>
        <p className="textTitle_onePubli">
          <button
            onClick={() => handleNavigateProfileOneUser(publicac?.user.id)}
          >
            {publicac?.user.userName}
          </button>
          {publicac?.description}
        </p>
        {publicac?.comentarios.length > 1 && (
          <button
            className="buttonComments_textTitle_onePubli"
            onClick={() => setModalComment(true)}
          >
            Ver los {publicac?.comentarios.length} comentarios
          </button>
        )}
        {publicac?.comentarios.length == 1 && (
          <p className="buttonComments_textTitle_onePubli">Ver 1 comentario</p>
        )}
        {momentaryComment.length > 0 &&
          momentaryComment.map((commentMomentary) => (
            <div
              key={commentMomentary.id}
              className="container_publiComment_mainMomentary"
            >
              <button
                onClick={() =>
                  handleNavigateProfileOneUser(commentMomentary.userId)
                }
              >
                {commentMomentary.user.userName}
              </button>
              <p>{commentMomentary.texto}</p>
            </div>
          ))}
        <div className="container_textArea_triButton_onePubli">
          <textarea
            className="textArea_triButton_onePubli"
            ref={refInputForEmoji}
            placeholder="Añade un comentario..."
            onInput={handleCommentPubliMain}
            onChange={handleMainTextCommentPubli}
            value={mainCommentPubli}
          />
          <button
            className={` ${mainCommentPubli.length > 0 ? "public_commentMainAct" : "public_mainComment"}`}
            onClick={handleMainPubliComment}
          >
            Publicar
          </button>
          <BsEmojiSmile
            className="emoji_commentPubli_main"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>
        {showEmojiPicker && (
          <div className="container_emoji_commentMain">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              className="content_emojis_commentMain"
            />
          </div>
        )}
        {modalShowLikersOfPubliMain && (
          <div className="container_content_allsUsers_likers_onePublic">
            <div className="content_allsUsers_likers_onePublic">
              <div className="titleLikeAndButtonExit_allsUsers_likers_onePublic">
                <h3>Me gusta</h3>
                <VscError
                  onClick={() => setModalShowLikersOfPubliMain(false)}
                  className="buttonExit_allsUsers_likers_onePublic"
                />
              </div>
              <div className="text_viewAllLikers_allsUsers_likers_onePublic">
                <p>
                  {publicac?.user.userName} puede ver el número total de
                  personas que han indicado que les gusta esta publicación
                </p>
              </div>
              <div className="container_allUsers_toLike_onePublic">
                {publicac?.likers
                  .filter((userToLik) => userToLik.id !== user.id)
                  .map((userToLik) => (
                    <div
                      key={userToLik.id}
                      className="container_content_oneUser_toLike"
                    >
                      <div
                        className="container_img_userName_and_names_allsUsers_likers_onePublic"
                        onMouseEnter={() =>
                          setModalShowProfileOneUser(userToLik.id)
                        }
                        onMouseLeave={() => setModalShowProfileOneUser(null)}
                      >
                        <img src={userToLik.photoProfile} alt="" />
                        <div className="container_namesAndUserName_allsUsers_likers_onePublic">
                          <h4>{userToLik.userName}</h4>
                          <h4 className="nameAndFirstName_allsUsers_likers_onePublic">
                            {userToLik.firstName} {userToLik.lastName}
                          </h4>
                        </div>
                      </div>

                      {modalShowProfileOneUser === userToLik.id && (
                        <div
                          className="container_modal_modalShowProfileOneUser"
                          onMouseEnter={() =>
                            setModalShowProfileOneUser(userToLik.id)
                          }
                          onMouseLeave={() => setModalShowProfileOneUser(null)}
                        >
                          <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                            <img
                              src={userToLik.photoProfile}
                              alt="imgUser_modal_show_ProfileOneUser"
                              onClick={() =>
                                handleNavigateProfileOneUser(userToLik.id)
                              }
                            />
                            <div className="container_names_userName_modalShowProfileOneUser">
                              <h4
                                onClick={() =>
                                  handleNavigateProfileOneUser(userToLik.id)
                                }
                                className="name_modalShowProfileOneUser"
                              >
                                {userToLik.userName}
                              </h4>
                              <h4 className="userName_modalShowProfileOneUser">
                                {userToLik.firstName} {userToLik.lastName}
                              </h4>
                            </div>
                          </div>

                          <div className="container_dates_modalShowProfileOneUser">
                            <div className="container_numberPublicacions_modalShowProfileOneUser">
                              <h5>{userToLik?.publicacions.length}</h5>
                              <h4>Publicaciones</h4>
                            </div>
                            <div className="container_numberFollowers_modalShowProfileOneUser">
                              <h5>{userToLik?.seguidores.length}</h5>
                              <h4>Seguidores</h4>
                            </div>
                            <div className="container_numberFollowed_modalShowProfileOneUser">
                              <h5>{userToLik?.seguidos.length}</h5>
                              <h4>Seguidos</h4>
                            </div>
                          </div>
                          <div>
                            {userToLik?.publicacions.length > 0 ? (
                              <div className="container_AllPublicacions_modalShowProfileOneUser">
                                {userToLik.publicacions
                                  .slice(0, 3)
                                  .map((publicsOneUser) => (
                                    <div className="container_publicacions_modalShowProfileOneUser">
                                      {publicsOneUser.contentUrl.endsWith(
                                        ".mp4"
                                      ) ||
                                      publicsOneUser.contentUrl.endsWith(
                                        ".webm"
                                      ) ? (
                                        <div
                                          className="container_video_modalShowProfileOneUser"
                                          onClick={() =>
                                            handleNavigateOnePublicacion(
                                              publicsOneUser.id
                                            )
                                          }
                                        >
                                          <video className="contentVideo_publicac_modalShowProfileOneUser">
                                            <source
                                              src={publicsOneUser.contentUrl}
                                              type="video/mp4"
                                            />
                                            Tu navegador no soporta videos.
                                          </video>
                                        </div>
                                      ) : (
                                        <div className="container_img_modalShowProfileOneUser">
                                          <img
                                            src={publicsOneUser.contentUrl}
                                            alt=""
                                            className="img_publicac_modalShowProfileOneUser"
                                            onClick={() =>
                                              handleNavigateOnePublicacion(
                                                publicsOneUser.id
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                                <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                                <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                                <h3>Aun no hay publicaciones</h3>
                                <p>
                                  Cuando {userToLik.userName} comparta fotos y
                                  reels, los verás aquí
                                </p>
                              </div>
                            )}
                          </div>
                          <div>
                            {showAllUsersFollowed.some(
                              (userSeguid) => userSeguid.id === userToLik.id
                            ) ? (
                              <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                                <div className="container_button_sendMessage_modalShowProfileOneUser">
                                  <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                                  <button className="button_sendMessage_modalShowProfileOneUser">
                                    Enviar un mensaje
                                  </button>
                                </div>
                                <button className="button_following_modalShowProfileOneUser">
                                  Siguiendo
                                </button>
                              </div>
                            ) : (
                              <div className="container_buttonFollow_modalShowProfileOneUser">
                                <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                                <button>Seguir</button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="container_button_allUsers_toLike_onePublic">
                        {showAllUsersFollowed
                          .map((userId) => userId.id)
                          .includes(userToLik.id) ? (
                          <button
                            className="buttonSiguiendo_allUsers_toLike_onePublic"
                            onClick={() => handleSeguir(userToLik.id)}
                          >
                            Siguiendo
                          </button>
                        ) : (
                          <button
                            className="buttonSeguir_allsUsers_likers_onePublic"
                            onClick={() => handleSeguir(userToLik.id)}
                          >
                            Seguir
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="border_one_publi" ref={refCommentPubli}></div>
      </div>
      {modalShare && (
        <div className="container_modal_share">
          <div className="content_modal_share">
            <VscError
              onClick={handleCloseSharePublic}
              className="exit_modal_share"
            />
            <h4 className="content_modal_share_textCompartir">Compartir</h4>
            <div className="modal_share_container_input">
              <BsSearch className="iconSearch_modal_share" />
              <input
                placeholder="Busca"
                ref={refSearhUserByShare}
                onChange={handleRefSearchUserByShare}
              />
            </div>
            <div className="modal_share_container_suggestions">
              {user.seguidos.filter(filterUserByShare).map((seguido) => (
                <div
                  key={seguido.id}
                  className="modal_share_container_one_suggestion"
                  onClick={() => handleSelectUserShare(seguido.id)}
                >
                  <img
                    src={seguido.photoProfile}
                    alt=""
                    className="modal_share_imgUser_suggestions"
                  />
                  <h5>
                    {seguido.firstName} {seguido.lastName}
                  </h5>
                  {selectUser.includes(seguido.id) && (
                    <span className="icon_check">✔</span>
                  )}
                </div>
              ))}
            </div>
            {selectUser.length > 0 ? (
              <div className="modal_share_container_inputAndButtom_send">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  ref={refMessageSharePubli}
                  onChange={handleMessageSharePubli}
                />
                <button onClick={handleSendMessageSharePubli}>Enviar</button>
              </div>
            ) : (
              <div className="modal_share_container_content_socialMedia">
                <div className="content_socialMedia">
                  <FaRegCopy className="icon_content_socialMedia" />
                  <h5 className="copy_enlace">Copiar enlace</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() =>
                    window.open("https://www.facebook.com", "_blank")
                  }
                >
                  <PiFacebookLogoBold className="icon_content_socialMedia" />
                  <h5>Facebook</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() =>
                    window.open("https://www.messenger.com", "_blank")
                  }
                >
                  <LiaFacebookMessenger className="icon_content_socialMedia" />
                  <h5>Messenger</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() =>
                    window.open("https://www.whatsapp.com", "_blank")
                  }
                >
                  <FaWhatsapp className="icon_content_socialMedia" />
                  <h5>WhatsApp</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() => window.open("https://www.gmail.com", "_blank")}
                >
                  <AiOutlineMail className="icon_content_socialMedia" />
                  <h5>Email</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() =>
                    window.open("https://www.threads.com", "_blank")
                  }
                >
                  <FaThreads className="icon_content_socialMedia" />
                  <h5>Threads</h5>
                </div>
                <div
                  className="content_socialMedia"
                  onClick={() =>
                    window.open("https://www.twitter.com", "_blank")
                  }
                >
                  <FaXTwitter className="icon_content_socialMedia" />
                  <h5>X</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalComment && (
        <div className="container_modal_comment_content">
          <VscError className="exit_content" onClick={handleCloseComment} />
          <div className="container_content_comment">
            <div className="content_image_publica_modal">
              {publicac?.contentUrl ? (
                publicac.contentUrl.endsWith(".mp4") ||
                publicac.contentUrl.endsWith(".webm") ? (
                  <video controls className="contentVideo_modal_comment">
                    <source src={publicac.contentUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={publicac.contentUrl}
                    alt="Publicación"
                    className="image_publica_modal_comment"
                  />
                )
              ) : (
                <p>Contenido no disponible</p>
              )}
            </div>
            <div className="content_comments">
              <div className="user_ownPublic_part1">
                <div className="content_img_userName">
                  <img
                    src={publicac?.user.photoProfile}
                    alt=""
                    className="photoProfile_modal_comment"
                    onClick={() =>
                      handleNavigateProfileOneUser(publicac?.userId)
                    }
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(publicac.user?.id)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  />
                  <h4
                    onClick={() =>
                      handleNavigateProfileOneUser(publicac?.userId)
                    }
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(publicac.user?.id)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  >
                    {publicac?.user.userName}
                  </h4>
                </div>
                <SlOptions
                  className="moreOptions_dates_user_pagePublicacion"
                  onClick={() => setMoreOptions((prev) => !prev)}
                />
              </div>
              {moreOptions && (
                <div className="container_modalMoreOptions_publicacionPage">
                  <div className="content_modalMoreOptions_publicacionPage">
                    <div className="container_button_giveUp">
                      <button className="button_giveUp">Denunciar</button>
                    </div>
                    <div>
                      {" "}
                      <button>Compartir en ....</button>
                    </div>
                    <div>
                      <button>Copiar enlace</button>
                    </div>
                    <div>
                      {" "}
                      <button>Codigo de insercion</button>
                    </div>
                    <div>
                      <button>Informacion sobre esta cuenta</button>
                    </div>
                    <div>
                      <button onClick={() => setMoreOptions((prev) => !prev)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="border_modal_comment_1"></div>
              <div className="user_ownPublic_part2">
                {publicac?.description !== null && (
                  <div className="container_content_imgAndUsername_description_pagePublicacion">
                    <img
                      src={publicac?.user.photoProfile}
                      className="photoProfile_modal_comment"
                      onClick={() =>
                        handleNavigateProfileOneUser(publicac?.userId)
                      }
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(publicac?.user.userName)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    />
                    <div className="container_userName_and_description_pagePublicacion">
                      <h3
                        className="userName_and_description_pagePublicacion"
                        onClick={() =>
                          handleNavigateProfileOneUser(publicac?.userId)
                        }
                        onMouseEnter={() =>
                          setModalShowProfileOneUser(publicac.user.userName)
                        }
                        onMouseLeave={() => setModalShowProfileOneUser(null)}
                      >
                        {publicac.user.userName}
                      </h3>
                      <h3 className="description_and_description_pagePublicacion">
                        {publicac.description}
                      </h3>
                    </div>
                  </div>
                )}
                {modalShowProfileOneUser === publicac.userId && (
                  <div
                    className="container_modal_modalShowProfileOneUser_ComponentPublicacionPage"
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(publicac.user.id)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  >
                    <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                      <img
                        src={publicac.user.photoProfile}
                        className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                        onClick={() =>
                          handleNavigateProfileOneUser(publicac.user.id)
                        }
                      />
                      <div className="container_names_userName_modalShowProfileOneUser">
                        <h4
                          onClick={() =>
                            handleNavigateProfileOneUser(publicac.user.id)
                          }
                          className="name_modalShowProfileOneUser"
                        >
                          {publicac.user.userName}
                        </h4>
                        <h4 className="userName_modalShowProfileOneUser">
                          {publicac.user.firstName} {publicac.user.lastName}
                        </h4>
                      </div>
                    </div>

                    <div className="container_dates_modalShowProfileOneUser">
                      <div className="container_numberPublicacions_modalShowProfileOneUser">
                        <h5>{publicac.user.publicacions?.length || 0}</h5>
                        <h4>Publicaciones</h4>
                      </div>
                      <div className="container_numberFollowers_modalShowProfileOneUser">
                        <h5>{publicac.user.seguidores?.length || 0}</h5>
                        <h4>Seguidores</h4>
                      </div>
                      <div className="container_numberFollowed_modalShowProfileOneUser">
                        <h5>{publicac.user.seguidos?.length || 0}</h5>
                        <h4>Seguidos</h4>
                      </div>
                    </div>
                    <div>
                      {publicac.user.publicacions?.length > 0 ? (
                        <div className="container_AllPublicacions_modalShowProfileOneUser">
                          {publicac.user.publicacions
                            .slice(0, 3)
                            .map((publicsOneUser) => (
                              <div className="container_publicacions_modalShowProfileOneUser">
                                {publicsOneUser.contentUrl.endsWith(".mp4") ||
                                publicsOneUser.contentUrl.endsWith(".webm") ? (
                                  <div
                                    className="container_video_modalShowProfileOneUser"
                                    onClick={() =>
                                      handleNavigateOnePublicacion(
                                        publicsOneUser.id
                                      )
                                    }
                                  >
                                    <video className="contentVideo_publicac_modalShowProfileOneUser">
                                      <source
                                        src={publicsOneUser.contentUrl}
                                        type="video/mp4"
                                      />
                                      Tu navegador no soporta videos.
                                    </video>
                                  </div>
                                ) : (
                                  <div className="container_img_modalShowProfileOneUser">
                                    <img
                                      src={publicsOneUser.contentUrl}
                                      alt=""
                                      className="img_publicac_modalShowProfileOneUser"
                                      onClick={() =>
                                        handleNavigateOnePublicacion(
                                          publicsOneUser.id
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                          <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                          <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                          <h3>Aun no hay publicaciones</h3>
                          <p>
                            Cuando {publicac.user.userName} comparta fotos y
                            reels, los verás aquí
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      {showAllUsersFollowed.some(
                        (userSeguid) => userSeguid.id === publicac.user.id
                      ) ? (
                        <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                          <div className="container_button_sendMessage_modalShowProfileOneUser">
                            <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                            <button className="button_sendMessage_modalShowProfileOneUser">
                              Enviar un mensaje
                            </button>
                          </div>
                          <button
                            className="button_following_modalShowProfileOneUser"
                            onClick={() => handleSeguir(publicac.user.id)}
                          >
                            Siguiendo
                          </button>
                        </div>
                      ) : (
                        <div className="container_buttonFollow_modalShowProfileOneUser">
                          <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                          <button
                            onClick={() => handleSeguir(publicac.user.id)}
                          >
                            Seguir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {modalShowProfileOneUser == publicac.user.userName && (
                  <div
                    className="container_modal_modalShowProfileOneUser_ComponentPublicacionPagePubliDescription"
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(publicac.user.userName)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  >
                    <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                      <img
                        src={publicac.user.photoProfile}
                        className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                        onClick={() =>
                          handleNavigateProfileOneUser(publicac.user.id)
                        }
                      />
                      <div className="container_names_userName_modalShowProfileOneUser">
                        <h4
                          onClick={() =>
                            handleNavigateProfileOneUser(publicac.user.id)
                          }
                          className="name_modalShowProfileOneUser"
                        >
                          {publicac.user.userName}
                        </h4>
                        <h4 className="userName_modalShowProfileOneUser">
                          {publicac.user.firstName} {publicac.user.lastName}
                        </h4>
                      </div>
                    </div>

                    <div className="container_dates_modalShowProfileOneUser">
                      <div className="container_numberPublicacions_modalShowProfileOneUser">
                        <h5>{publicac.user.publicacions?.length || 0}</h5>
                        <h4>Publicaciones</h4>
                      </div>
                      <div className="container_numberFollowers_modalShowProfileOneUser">
                        <h5>{publicac.user.seguidores?.length || 0}</h5>
                        <h4>Seguidores</h4>
                      </div>
                      <div className="container_numberFollowed_modalShowProfileOneUser">
                        <h5>{publicac.user.seguidos?.length || 0}</h5>
                        <h4>Seguidos</h4>
                      </div>
                    </div>
                    <div>
                      {publicac.user.publicacions?.length > 0 ? (
                        <div className="container_AllPublicacions_modalShowProfileOneUser">
                          {publicac.user.publicacions
                            .slice(0, 3)
                            .map((publicsOneUser) => (
                              <div className="container_publicacions_modalShowProfileOneUser">
                                {publicsOneUser.contentUrl.endsWith(".mp4") ||
                                publicsOneUser.contentUrl.endsWith(".webm") ? (
                                  <div
                                    className="container_video_modalShowProfileOneUser"
                                    onClick={() =>
                                      handleNavigateOnePublicacion(
                                        publicsOneUser.id
                                      )
                                    }
                                  >
                                    <video className="contentVideo_publicac_modalShowProfileOneUser">
                                      <source
                                        src={publicsOneUser.contentUrl}
                                        type="video/mp4"
                                      />
                                      Tu navegador no soporta videos.
                                    </video>
                                  </div>
                                ) : (
                                  <div className="container_img_modalShowProfileOneUser">
                                    <img
                                      src={publicsOneUser.contentUrl}
                                      alt=""
                                      className="img_publicac_modalShowProfileOneUser"
                                      onClick={() =>
                                        handleNavigateOnePublicacion(
                                          publicsOneUser.id
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                          <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                          <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                          <h3>Aun no hay publicaciones</h3>
                          <p>
                            Cuando {publicac.user.userName} comparta fotos y
                            reels, los verás aquí
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      {showAllUsersFollowed.some(
                        (userSeguid) => userSeguid.id === publicac.user.id
                      ) ? (
                        <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                          <div className="container_button_sendMessage_modalShowProfileOneUser">
                            <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                            <button className="button_sendMessage_modalShowProfileOneUser">
                              Enviar un mensaje
                            </button>
                          </div>
                          <button
                            className="button_following_modalShowProfileOneUser"
                            onClick={() => handleSeguir(publicac.user.id)}
                          >
                            Siguiendo
                          </button>
                        </div>
                      ) : (
                        <div className="container_buttonFollow_modalShowProfileOneUser">
                          <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                          <button
                            onClick={() => handleSeguir(publicac.user.id)}
                          >
                            Seguir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="container_all_conmments">
                  {comentariosEstructurados.length > 0 ? (
                    comentariosEstructurados.map((coment) => (
                      <Comentarios
                        key={coment?.id}
                        coment={coment}
                        setCommentPubli={setCommentPubli}
                        setCommentReplyId={setCommentReplyId}
                      />
                    ))
                  ) : (
                    <p className="notcomments">No hay comentarios aún</p>
                  )}
                </div>
              </div>
              <div className="content_info_public" ref={textAreaContainerRef}>
                <div className="border_modal_comment_2"></div>
                <div className="buttons_comment_content">
                  <div className="buttons_tri_content">
                    <div className="container_buttons_comment">
                      {actMeGusta ? (
                        <button
                          className="custom_button button_comment button_like_act"
                          onClick={handleMeGusta}
                        >
                          <IoMdHeart />
                        </button>
                      ) : (
                        <div>
                          <IoMdHeartEmpty
                            className="custom_button button_comment button_like"
                            onClick={handleMeGusta}
                          />
                        </div>
                      )}
                      <FaRegComment className="custom_button button_comment" />
                      <FiSend
                        className="button_comment"
                        onClick={() => setModalShareComment(true)}
                      />
                    </div>
                    <button className="custom_button">
                      {savedPubli ? (
                        <BsSave2Fill
                          className="button_save_onePubli button_save_onePubli_modalComment"
                          onClick={handleSendSavePubli}
                        />
                      ) : (
                        <BsSave2
                          className="button_save_onePubli button_save_onePubli_modalComment"
                          onClick={handleSendSavePubli}
                        />
                      )}
                    </button>
                  </div>
                  <div className="time_like">
                    <div className="container_content_usersLiker_modalComment">
                      {publicac?.likers.length > 0 && (
                        <div>
                          <h4>
                            Le gusta a <span></span>
                            <button
                              onClick={() =>
                                handleNavigateProfileOneUser(
                                  userToLikePublic.id
                                )
                              }
                            >
                              {userToLikePublic.userName}
                            </button>
                          </h4>
                        </div>
                      )}
                      {publicac?.likers.length > 1 && (
                        <div className="container_like_otherUsers">
                          <p>y</p>
                          <button onClick={() => setShowUsersLikers(true)}>
                            personas mas
                          </button>
                        </div>
                      )}
                    </div>
                    {showUsersLikers && (
                      <div className="container_content_allsUsers_likers_onePublic">
                        <div className="content_allsUsers_likers_onePublic">
                          <div className="titleLikeAndButtonExit_allsUsers_likers_onePublic">
                            <h3>Me gusta</h3>
                            <VscError
                              onClick={() => setShowUsersLikers(false)}
                              className="buttonExit_allsUsers_likers_onePublic"
                            />
                          </div>
                          <div className="text_viewAllLikers_allsUsers_likers_onePublic">
                            <p>
                              {publicac?.user.userName} puede ver el número
                              total de personas que han indicado que les gusta
                              esta publicación
                            </p>
                          </div>
                          <div className="container_allUsers_toLike_onePublic">
                            {publicac?.likers
                              .filter((userToLik) => userToLik.id !== user.id)
                              .map((userToLik) => (
                                <div
                                  key={userToLik.id}
                                  className="container_content_oneUser_toLike"
                                >
                                  <div
                                    className="container_img_userName_and_names"
                                    onMouseEnter={() =>
                                      setModalShowProfileOneUser(userToLik.id)
                                    }
                                    onMouseLeave={() =>
                                      setModalShowProfileOneUser(null)
                                    }
                                  >
                                    <img
                                      src={userToLik.photoProfile}
                                      alt=""
                                      onClick={() =>
                                        handleNavigateProfileOneUser(
                                          userToLik.id
                                        )
                                      }
                                    />
                                    <div className="container_namesAndUserName_allsUsers_likers_onePublic">
                                      <h4
                                        className="userName_oneUser_toLike"
                                        onClick={() =>
                                          handleNavigateProfileOneUser(
                                            userToLik.id
                                          )
                                        }
                                      >
                                        {userToLik.userName}
                                      </h4>
                                      <h4 className="nameAndFirstName_allsUsers_likers_onePublic">
                                        {userToLik.firstName}{" "}
                                        {userToLik.lastName}
                                      </h4>
                                    </div>
                                  </div>

                                  {modalShowProfileOneUser === userToLik.id && (
                                    <div
                                      className="container_modal_modalShowProfileOneUser"
                                      onMouseEnter={() =>
                                        setModalShowProfileOneUser(userToLik.id)
                                      }
                                      onMouseLeave={() =>
                                        setModalShowProfileOneUser(null)
                                      }
                                    >
                                      <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                                        <img
                                          src={userToLik.photoProfile}
                                          alt="imgUser_modal_show_ProfileOneUser"
                                          onClick={() =>
                                            handleNavigateProfileOneUser(
                                              userToLik.id
                                            )
                                          }
                                        />
                                        <div className="container_names_userName_modalShowProfileOneUser">
                                          <h4
                                            onClick={() =>
                                              handleNavigateProfileOneUser(
                                                userToLik.id
                                              )
                                            }
                                            className="name_modalShowProfileOneUser"
                                          >
                                            {userToLik.userName}
                                          </h4>
                                          <h4 className="userName_modalShowProfileOneUser">
                                            {userToLik.firstName}{" "}
                                            {userToLik.lastName}
                                          </h4>
                                        </div>
                                      </div>

                                      <div className="container_dates_modalShowProfileOneUser">
                                        <div className="container_numberPublicacions_modalShowProfileOneUser">
                                          <h5>
                                            {userToLik?.publicacions.length}
                                          </h5>
                                          <h4>Publicaciones</h4>
                                        </div>
                                        <div className="container_numberFollowers_modalShowProfileOneUser">
                                          <h5>
                                            {userToLik?.seguidores.length}
                                          </h5>
                                          <h4>Seguidores</h4>
                                        </div>
                                        <div className="container_numberFollowed_modalShowProfileOneUser">
                                          <h5>{userToLik?.seguidos.length}</h5>
                                          <h4>Seguidos</h4>
                                        </div>
                                      </div>
                                      <div>
                                        {userToLik?.publicacions.length > 0 ? (
                                          <div className="container_AllPublicacions_modalShowProfileOneUser">
                                            {userToLik.publicacions
                                              .slice(0, 3)
                                              .map((publicsOneUser) => (
                                                <div className="container_publicacions_modalShowProfileOneUser">
                                                  {publicsOneUser.contentUrl.endsWith(
                                                    ".mp4"
                                                  ) ||
                                                  publicsOneUser.contentUrl.endsWith(
                                                    ".webm"
                                                  ) ? (
                                                    <div
                                                      className="container_video_modalShowProfileOneUser"
                                                      onClick={() =>
                                                        handleNavigateOnePublicacion(
                                                          publicsOneUser.id
                                                        )
                                                      }
                                                    >
                                                      <video className="contentVideo_publicac_modalShowProfileOneUser">
                                                        <source
                                                          src={
                                                            publicsOneUser.contentUrl
                                                          }
                                                          type="video/mp4"
                                                        />
                                                        Tu navegador no soporta
                                                        videos.
                                                      </video>
                                                    </div>
                                                  ) : (
                                                    <div className="container_img_modalShowProfileOneUser">
                                                      <img
                                                        src={
                                                          publicsOneUser.contentUrl
                                                        }
                                                        alt=""
                                                        className="img_publicac_modalShowProfileOneUser"
                                                        onClick={() =>
                                                          handleNavigateOnePublicacion(
                                                            publicsOneUser.id
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                          </div>
                                        ) : (
                                          <div className="container_thereIsNot_publicacions_modalShowProfileOneUser">
                                            <div className="circle_camera_thereIsNot_publicacions_modalShowProfileOneUser"></div>
                                            <IoCameraOutline className="cameraLogo_thereIsNot_publicacions_modalShowProfileOneUser" />
                                            <h3>Aun no hay publicaciones</h3>
                                            <p>
                                              Cuando {userToLik.userName}{" "}
                                              comparta fotos y reels, los verás
                                              aquí
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        {showAllUsersFollowed.some(
                                          (userSeguid) =>
                                            userSeguid.id === userToLik.id
                                        ) ? (
                                          <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                                            <div className="container_button_sendMessage_modalShowProfileOneUser">
                                              <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                                              <button className="button_sendMessage_modalShowProfileOneUser">
                                                Enviar un mensaje
                                              </button>
                                            </div>
                                            <button className="button_following_modalShowProfileOneUser">
                                              Siguiendo
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="container_buttonFollow_modalShowProfileOneUser">
                                            <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                                            <button>Seguir</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="container_button_allUsers_toLike_onePublic">
                                    {showAllUsersFollowed
                                      .map((userId) => userId.id)
                                      .includes(userToLik.id) ? (
                                      <button
                                        className="buttonSiguiendo_allUsers_toLike_onePublic"
                                        onClick={() =>
                                          handleSeguir(userToLik.id)
                                        }
                                      >
                                        Siguiendo
                                      </button>
                                    ) : (
                                      <button
                                        className="buttonSeguir_allsUsers_likers_onePublic"
                                        onClick={() =>
                                          handleSeguir(userToLik.id)
                                        }
                                      >
                                        Seguir
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <h5 className="how_along_time_publica">
                      {getFormattedDate(publicac?.createdAt)}
                    </h5>
                  </div>
                </div>
                <div className="border_modal_comment_3"></div>
              </div>
              <div className="content_create_comment_all">
                <div className="content_create_comment">
                  <BsEmojiSmile
                    className="emoji"
                    onClick={() => setEmojisModalComment(!emojisModalComment)}
                  />
                  {emojisModalComment && (
                    <div className="container_emoji_modalComment">
                      <EmojiPicker
                        onEmojiClick={handleEmojisModalComment}
                        className="content_emoji_modalComment"
                      />
                    </div>
                  )}
                  <textarea
                    rows="1"
                    placeholder="Añade un comentario..."
                    className="add_comment"
                    ref={refEmojiModalComment}
                    value={commentPubli}
                    onInput={handleInput}
                    onChange={handleTextComment}
                  />
                  <button
                    className={` ${commentPubli.length > 0 ? "public_commentAct" : "public_comment"}`}
                    onClick={handlePublicComment}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
          {modalShareFromComment && (
            <div className="container_modalShareComment">
              <div className="container_content_modalShareComment">
                <div className="content_modalShareComment_titleAndExit">
                  <h4>Compartir</h4>
                  <VscError
                    onClick={() => setModalShareComment(false)}
                    className="content_modalShareComment_exitButton"
                  />
                </div>
                <div className="content_modalShareComment_bordersAndInputForSearchUsers">
                  <div className="ContainerInputForSearchUsers_border"></div>
                  <div className="content_modalShareComment_ContainerInputForSearchUsers">
                    <h4>Para:</h4>{" "}
                    <input
                      type="text"
                      placeholder="Busca..."
                      onInput={handleInputModalShareFromComment}
                    />
                  </div>
                </div>
                <div>
                  <div
                    className={`${selectUserShareFromComment.length > 0 ? "container_AllSeguidMoodShort_modalShareComment" : "container_AllSeguid_modalShareComment"} `}
                  >
                    <h5 className="container_AllSeguid_modalShareComment_suggestions">
                      Sugerencias
                    </h5>
                    {user.seguidos
                      .filter(cbFilterUserModalShareFromComment)
                      .map((seguidUser) => (
                        <div
                          className="container_oneSeguid_modalShareComment"
                          key={seguidUser.id}
                        >
                          <img src={seguidUser.photoProfile} alt="" />
                          <div className="container_oneSeguid_modalShareComment_namesAndUsername">
                            <h5 className="names_modalShareComment">
                              {seguidUser.firstName}
                              {seguidUser.lastName}
                            </h5>
                            <h5 className="userName_modalShareComment">
                              {seguidUser.userName}
                            </h5>
                          </div>
                          <div
                            className={`circleForSend ${selectUserShareFromComment.includes(seguidUser.id) && "circleForSendActiv"}`}
                            onClick={() =>
                              handleSelectUserShareFromComment(seguidUser.id)
                            }
                          >
                            {selectUserShareFromComment.includes(
                              seguidUser.id
                            ) && (
                              <span className="checkList_modalShareComment">
                                ✔
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {selectUserShareFromComment.length > 0 ? (
                  <div className="container_inputAndButtonSendAct_modalShareComment">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      onInput={handleMessageModalShareComment}
                    />
                    <button
                      className="buttonSend_modalShareCommentActiv"
                      onClick={handleSendMessageModalShareComment}
                    >
                      Enviar
                    </button>
                  </div>
                ) : (
                  <div className="container_buttonSend_modalShareComment">
                    <button className="buttonSend_modalShareComment">
                      Enviar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Publicaciones;
