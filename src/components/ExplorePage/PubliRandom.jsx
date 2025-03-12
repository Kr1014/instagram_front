import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BsEmojiSmile, BsSave2Fill } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { BsSave2 } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiVideoFill } from "react-icons/ri";
import { RiImage2Line } from "react-icons/ri";
import "./css/publiRandom.css";
import Comentarios from "../HomePage/Comentarios";
import getToken from "../../utils/getToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SlOptions } from "react-icons/sl";
import { NofiticationContext } from "../HomePage/ShowNotificationSend";
import { UserContext } from "../LoginPage/UserProvider";
import { IoCameraOutline } from "react-icons/io5";
import { LiaFacebookMessenger } from "react-icons/lia";
import { FiSend, FiUserPlus } from "react-icons/fi";
import { format, formatDistanceToNow } from "date-fns";
import useSend from "../../hooks/useSend";
import { es } from "date-fns/locale";

const PubliRandom = ({ publiRan, isLarge }) => {
  const { user } = useContext(UserContext);
  const [commentPubli, setCommentPubli] = useState("");
  const { timeDurationNotification } = useContext(NofiticationContext);
  const [commentReplyId, setCommentReplyId] = useState(false);
  const [modalShareCommentMessage, setModalShareCommentMessage] = useState("");
  const [modalComment, setModalComment] = useState(false);
  const [userToLikePublic, setUserToLikePublic] = useState("");
  const [actMeGusta, setActMeGusta] = useState(false);
  const [searchUserModalShareFromComment, setSearchUserModalShareFromComment] =
    useState("");
  const [selectUserShareFromComment, setSelectUserShareFromComment] = useState(
    []
  );
  const [emojisModalComment, setEmojisModalComment] = useState(false);
  const [showCommentsQuantity, setShowCommentsQuantity] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [savedPubli, setSavedPubli] = useState();
  const [showUsersLikers, setShowUsersLikers] = useState(false);
  const [modalShareFromComment, setModalShareComment] = useState(false);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const textAreaContainerRef = useRef(null);
  const refEmojiModalComment = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialComments = async () => {
      if (!publiRan?.id) return;
      await fetchComentarios();
    };
    fetchInitialComments();
  }, [publiRan]);

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

  const getFormattedDate = (date) => {
    const publicationDate = new Date(date);
    const now = new Date();
    const diffMilliseconds = now - publicationDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return formatDistanceToNow(publicationDate, {
        addSuffix: true,
        locale: es,
        includeSeconds: true,
      });
    }

    if (diffDays > 5) {
      if (publicationDate.getFullYear() === now.getFullYear()) {
        return format(publicationDate, "d 'de' MMMM", { locale: es });
      }

      return format(publicationDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    }

    return formatDistanceToNow(publicationDate, {
      addSuffix: true,
      locale: es,
    });
  };

  const handleInput = (e) => {
    const textarea = e.target;

    textarea.style.height = "40px";
    textarea.style.height = `${textarea.scrollHeight}px`;

    const maxHeight = 70;
    if (textarea.scrollHeight >= maxHeight) {
      textarea.style.overflowY = "auto";
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.overflowY = "hidden";
    }

    const previousContainer = textAreaContainerRef.current;
    if (previousContainer && textarea.scrollHeight < maxHeight) {
      previousContainer.style.transform = `translateY(-${textarea.scrollHeight - 40}px)`;
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

  const handleSendSavePubli = async () => {
    const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${publiRan?.id}`;
    const response = await axios.post(url, {}, getToken());
    setSavedPubli((prev) => !prev);
  };

  useEffect(() => {
    const checkSavedPubli = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${publiRan?.id}`;
      const response = await axios.get(url, getToken());
      setSavedPubli(response.data);
    };

    checkSavedPubli();
  }, [publiRan]);

  useEffect(() => {
    const checkLike = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/megustas/${user.id}/${publiRan?.id}`,
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
  }, [publiRan]);

  useEffect(() => {
    const likeToUserAndOthers = () => {
      const allUsersLikeToPublic = publiRan?.likers;
      const getOneUserLikeToPublic = allUsersLikeToPublic.at(
        Math.floor(Math.random() * allUsersLikeToPublic.length)
      );
      setUserToLikePublic(getOneUserLikeToPublic);
    };
    likeToUserAndOthers();
  }, []);

  const handleComment = () => {
    setModalComment(true);
  };

  const handleTextComment = (e) => {
    setCommentPubli(e.target.value);
  };

  const handleMeGusta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/megustas/${publiRan?.id}`,
        {},
        getToken()
      );
      setActMeGusta((prev) => !prev);
    } catch (e) {
      console.error(`Error al gestionar el "Me gusta": ${e.message}`);
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/comentarios/${publiRan?.id}`,
        getToken()
      );
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error.message);
    }
  };

  const handlePublicComment = async () => {
    if (!commentPubli.trim()) return;

    try {
      const url = commentReplyId
        ? `http://localhost:8080/api/v1/comentarios/${commentReplyId}/responder`
        : `http://localhost:8080/api/v1/comentarios/${publiRan?.id}`;

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

      setCommentPubli("");
      setCommentReplyId(null);
    } catch (error) {
      console.error("Error al publicar comentario/respuesta:", error);
    }
  };

  const handleSendMessageModalShareComment = () => {
    const url = "http://localhost:8080/api/v1/mensajes";
    selectUserShareFromComment.map((userId) =>
      useSend(
        url,
        {
          texto: modalShareCommentMessage,
          contentMultimedia: publiRan?.contentUrl,
          destinatarioId: userId,
        },
        getToken()
      )
    );
    setModalShareComment(false);
    timeDurationNotification(3000);
  };

  const handleEmojisModalComment = (emojiData) => {
    if (!refEmojiModalComment.current) return;

    const cursorPos = refEmojiModalComment.current.selectionStart;

    setCommentPubli((prevText) => {
      const textBeforeCursor = prevText.slice(0, cursorPos);
      const textAfterCursor = prevText.slice(cursorPos);
      const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;

      setTimeout(() => {
        if (refEmojiModalComment.current) {
          refEmojiModalComment.current.selectionStart =
            cursorPos + emojiData.emoji.length;
          refEmojiModalComment.current.selectionEnd =
            cursorPos + emojiData.emoji.length;
          refEmojiModalComment.current.focus();
        }
      }, 0);

      return newText;
    });
  };

  const handleSeguir = async (userId) => {
    try {
      const url = `http://localhost:8080/api/v1/seguidores/${userId}`;
      const response = await axios.post(url, {}, getToken());
    } catch (e) {
      console.error("Hubo un error", e);
    }
  };

  const handleMessageModalShareComment = (e) => {
    const textMessage = e.target.value;
    setModalShareCommentMessage(textMessage);
  };

  const handleNavigateProfileOneUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCloseComment = () => {
    setModalComment(false);
    setEmojisModalComment(false);
  };

  const agregarRespuesta = (comentarios, respuesta) => {
    return comentarios.map((comentario) => {
      if (comentario.id === respuesta.comentarioPadreId) {
        return {
          ...comentario,
          respuestas: [...(comentario.respuestas || []), respuesta],
        };
      } else if (comentario.respuestas && comentario.respuestas.length > 0) {
        return {
          ...comentario,
          respuestas: agregarRespuesta(comentario.respuestas, respuesta),
        };
      }
      return comentario;
    });
  };

  const estructurarComentarios = (comentarios) => {
    const mapaComentarios = new Map();

    comentarios.forEach((comentario) => {
      mapaComentarios.set(comentario.id, {
        ...comentario,
        respuestas: comentario.respuestas || [],
      });
    });

    const comentariosAnidados = [];

    comentarios.forEach((comentario) => {
      if (comentario.comentarioPadreId === null) {
        comentariosAnidados.push(mapaComentarios.get(comentario.id));
      } else {
        const padre = mapaComentarios.get(comentario.comentarioPadreId);
        if (padre) {
          padre.respuestas.push(mapaComentarios.get(comentario.id));
        }
      }
    });

    return comentariosAnidados;
  };

  const comentariosEstructurados = useMemo(() => {
    const copiaComentarios = [...comentarios];
    return estructurarComentarios(copiaComentarios);
  }, [comentarios]);

  return (
    <>
      <div
        className={`content_one_publi_random ${isLarge ? "large-publication" : ""}`}
      >
        {publiRan?.contentUrl ? (
          publiRan.contentUrl.endsWith(".mp4") ||
          publiRan.contentUrl.endsWith(".webm") ? (
            <div
              className="media-container"
              onMouseEnter={() => setShowCommentsQuantity(true)}
              onMouseLeave={() => setShowCommentsQuantity(false)}
            >
              <video
                className={`contentVideo_publiRan ${isLarge ? "large-video" : ""}`}
                onClick={handleComment}
              >
                <source src={publiRan.contentUrl} type="video/mp4" />
              </video>
              <RiVideoFill className="media-icon" />
            </div>
          ) : (
            <div
              className="media-container"
              onMouseEnter={() => setShowCommentsQuantity(true)}
              onMouseLeave={() => setShowCommentsQuantity(false)}
            >
              <img
                src={publiRan.contentUrl}
                onClick={handleComment}
                className={`img_publi_random`}
              />
              <RiImage2Line className="media-icon" />
            </div>
          )
        ) : (
          <p>Contenido no disponible</p>
        )}
        {showCommentsQuantity && isLarge == false && (
          <div
            className="container_quantityComments_publiRandom"
            onMouseEnter={() => setShowCommentsQuantity(true)}
            onMouseLeave={() => setShowCommentsQuantity(false)}
          >
            <FaComment className="iconComment_commentsQuantity_publiRandom" />
            <h5>{publiRan?.comentarios.length}</h5>
          </div>
        )}
        {showCommentsQuantity && isLarge == true && (
          <div
            className="container_quantityComments_largePublicacion_publiRandom"
            onMouseEnter={() => setShowCommentsQuantity(true)}
            onMouseLeave={() => setShowCommentsQuantity(false)}
          >
            <FaComment className="iconComment_commentsQuantity_publiRandom" />
            <h5>{publiRan?.comentarios.length}</h5>
          </div>
        )}
        {modalComment && (
          <div className="container_modal_comment_content">
            <VscError className="exit_content" onClick={handleCloseComment} />
            <div className="container_content_comment">
              <div className="content_image_publica_modal">
                {publiRan?.contentUrl ? (
                  publiRan.contentUrl.endsWith(".mp4") ||
                  publiRan.contentUrl.endsWith(".webm") ? (
                    <video controls className="contentVideo_modal_comment">
                      <source src={publiRan.contentUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={publiRan.contentUrl}
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
                      src={publiRan?.user.photoProfile}
                      alt=""
                      className="photoProfile_modal_comment"
                      onClick={() =>
                        handleNavigateProfileOneUser(publiRan?.userId)
                      }
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(publiRan.user?.id)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    />
                    <h4
                      onClick={() =>
                        handleNavigateProfileOneUser(publiRan?.userId)
                      }
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(publiRan.user?.id)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    >
                      {publiRan?.user.userName}
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
                  {publiRan?.description !== null && (
                    <div className="container_content_imgAndUsername_description_pagePublicacion">
                      <img
                        src={publiRan?.user.photoProfile}
                        className="photoProfile_modal_comment"
                        onClick={() =>
                          handleNavigateProfileOneUser(publiRan?.userId)
                        }
                        onMouseEnter={() =>
                          setModalShowProfileOneUser(publiRan?.user.userName)
                        }
                        onMouseLeave={() => setModalShowProfileOneUser(null)}
                      />
                      <div className="container_userName_and_description_pagePublicacion">
                        <h3
                          className="userName_and_description_pagePublicacion"
                          onClick={() =>
                            handleNavigateProfileOneUser(publiRan?.userId)
                          }
                          onMouseEnter={() =>
                            setModalShowProfileOneUser(publiRan.user.userName)
                          }
                          onMouseLeave={() => setModalShowProfileOneUser(null)}
                        >
                          {publiRan.user.userName}
                        </h3>
                        <h3 className="description_and_description_pagePublicacion">
                          {publiRan.description}
                        </h3>
                      </div>
                    </div>
                  )}
                  {modalShowProfileOneUser === publiRan.userId && (
                    <div
                      className="container_modal_modalShowProfileOneUser_ComponentpublicacionPage"
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(publiRan.user.id)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    >
                      <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                        <img
                          src={publiRan.user.photoProfile}
                          className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                          onClick={() =>
                            handleNavigateProfileOneUser(publiRan.user.id)
                          }
                        />
                        <div className="container_names_userName_modalShowProfileOneUser">
                          <h4
                            onClick={() =>
                              handleNavigateProfileOneUser(publiRan.user.id)
                            }
                            className="name_modalShowProfileOneUser"
                          >
                            {publiRan.user.userName}
                          </h4>
                          <h4 className="userName_modalShowProfileOneUser">
                            {publiRan.user.firstName} {publiRan.user.lastName}
                          </h4>
                        </div>
                      </div>

                      <div className="container_dates_modalShowProfileOneUser">
                        <div className="container_numberPublicacions_modalShowProfileOneUser">
                          <h5>{publiRan.user.publicacions?.length || 0}</h5>
                          <h4>Publicaciones</h4>
                        </div>
                        <div className="container_numberFollowers_modalShowProfileOneUser">
                          <h5>{publiRan.user.seguidores?.length || 0}</h5>
                          <h4>Seguidores</h4>
                        </div>
                        <div className="container_numberFollowed_modalShowProfileOneUser">
                          <h5>{publiRan.user.seguidos?.length || 0}</h5>
                          <h4>Seguidos</h4>
                        </div>
                      </div>
                      <div>
                        {publiRan.user.publicacions?.length > 0 ? (
                          <div className="container_AllPublicacions_modalShowProfileOneUser">
                            {publiRan.user.publicacions
                              .slice(0, 3)
                              .map((publicsOneUser) => (
                                <div className="container_publicacions_modalShowProfileOneUser">
                                  {publicsOneUser.contentUrl.endsWith(".mp4") ||
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
                              Cuando {publiRan.user.userName} comparta fotos y
                              reels, los verás aquí
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        {showAllUsersFollowed.some(
                          (userSeguid) => userSeguid.id === publiRan.user.id
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
                              onClick={() => handleSeguir(publiRan.user.id)}
                            >
                              Siguiendo
                            </button>
                          </div>
                        ) : (
                          <div className="container_buttonFollow_modalShowProfileOneUser">
                            <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                            <button
                              onClick={() => handleSeguir(publiRan.user.id)}
                            >
                              Seguir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {modalShowProfileOneUser == publiRan.user.userName && (
                    <div
                      className="container_modal_modalShowProfileOneUser_ComponentPublicacionPagePubliDescription"
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(publiRan.user.userName)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    >
                      <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                        <img
                          src={publiRan.user.photoProfile}
                          className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                          onClick={() =>
                            handleNavigateProfileOneUser(publiRan.user.id)
                          }
                        />
                        <div className="container_names_userName_modalShowProfileOneUser">
                          <h4
                            onClick={() =>
                              handleNavigateProfileOneUser(publiRan.user.id)
                            }
                            className="name_modalShowProfileOneUser"
                          >
                            {publiRan.user.userName}
                          </h4>
                          <h4 className="userName_modalShowProfileOneUser">
                            {publiRan.user.firstName} {publiRan.user.lastName}
                          </h4>
                        </div>
                      </div>

                      <div className="container_dates_modalShowProfileOneUser">
                        <div className="container_numberPublicacions_modalShowProfileOneUser">
                          <h5>{publiRan.user.publicacions?.length || 0}</h5>
                          <h4>Publicaciones</h4>
                        </div>
                        <div className="container_numberFollowers_modalShowProfileOneUser">
                          <h5>{publiRan.user.seguidores?.length || 0}</h5>
                          <h4>Seguidores</h4>
                        </div>
                        <div className="container_numberFollowed_modalShowProfileOneUser">
                          <h5>{publiRan.user.seguidos?.length || 0}</h5>
                          <h4>Seguidos</h4>
                        </div>
                      </div>
                      <div>
                        {publiRan.user.publicacions?.length > 0 ? (
                          <div className="container_AllPublicacions_modalShowProfileOneUser">
                            {publiRan.user.publicacions
                              .slice(0, 3)
                              .map((publicsOneUser) => (
                                <div className="container_publicacions_modalShowProfileOneUser">
                                  {publicsOneUser.contentUrl.endsWith(".mp4") ||
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
                              Cuando {publiRan.user.userName} comparta fotos y
                              reels, los verás aquí
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        {showAllUsersFollowed.some(
                          (userSeguid) => userSeguid.id === publiRan.user.id
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
                              onClick={() => handleSeguir(publiRan.user.id)}
                            >
                              Siguiendo
                            </button>
                          </div>
                        ) : (
                          <div className="container_buttonFollow_modalShowProfileOneUser">
                            <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                            <button
                              onClick={() => handleSeguir(publiRan.user.id)}
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
                        {publiRan?.likers.length > 0 && (
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
                        {publiRan?.likers.length > 1 && (
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
                                {publiRan?.user.userName} puede ver el número
                                total de personas que han indicado que les gusta
                                esta publicación
                              </p>
                            </div>
                            <div className="container_allUsers_toLike_onePublic">
                              {publiRan?.likers
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

                                    {modalShowProfileOneUser ===
                                      userToLik.id && (
                                      <div
                                        className="container_modal_modalShowProfileOneUser"
                                        onMouseEnter={() =>
                                          setModalShowProfileOneUser(
                                            userToLik.id
                                          )
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
                                            <h5>
                                              {userToLik?.seguidos.length}
                                            </h5>
                                            <h4>Seguidos</h4>
                                          </div>
                                        </div>
                                        <div>
                                          {userToLik?.publicacions.length >
                                          0 ? (
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
                                                          Tu navegador no
                                                          soporta videos.
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
                                                comparta fotos y reels, los
                                                verás aquí
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
                        {getFormattedDate(publiRan?.createdAt)}
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
                      className={` ${commentPubli?.length > 0 ? "public_commentAct" : "public_comment"}`}
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
      </div>
    </>
  );
};

export default PubliRandom;
