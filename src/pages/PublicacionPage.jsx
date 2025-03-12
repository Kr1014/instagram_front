import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptions } from "react-icons/sl";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { FiSend, FiUserPlus } from "react-icons/fi";
import { BsSave2 } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";
import { BsSave2Fill } from "react-icons/bs";
import getToken from "../utils/getToken";
import "./css/publicacionPage.css";
import { UserContext } from "../components/LoginPage/UserProvider";
import Comentarios from "../components/HomePage/Comentarios";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { IoCameraOutline } from "react-icons/io5";
import { LiaFacebookMessenger } from "react-icons/lia";
import { VscError } from "react-icons/vsc";

const PublicacionPage = () => {
  const [datesOnePublic, getDatesOnePubli] = useFetch();
  const [infoOnePublic, setInfoOnePublic] = useState();
  const [commentPubli, setCommentPubli] = useState("");
  const [commentReplyId, setCommentReplyId] = useState(false);
  const [searchUserModalShareFromComment, setSearchUserModalShareFromComment] =
    useState("");
  const [showUsersLikers, setShowUsersLikers] = useState(false);
  useState("");
  const [modalShareCommentMessage, setModalShareCommentMessage] = useState("");
  const [modalShareFromComment, setModalShareComment] = useState(false);
  const [selectUserShareFromComment, setSelectUserShareFromComment] = useState(
    []
  );
  const [actMeGusta, setActMeGusta] = useState(false);
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [moreOptions, setMoreOptions] = useState(false);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const [modalProfileOneUserToUserLikers, setmodalProfileOneUserToUserLikers] =
    useState(null);
  const [savedPubli, setSavedPubli] = useState();
  const [showModalEmojis, setShowModalEmojis] = useState(false);
  const [userTolikePublic, setUserToLikePublic] = useState("");
  const refEmoji = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    const url = `http://localhost:8080/api/v1/publicaciones/${params.id}`;
    getDatesOnePubli(url, getToken());
  }, [params.id]);

  useEffect(() => {
    if (datesOnePublic) {
      setInfoOnePublic(datesOnePublic);
    }
  }, [datesOnePublic]);

  useEffect(() => {
    const checkSavedPubli = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${params?.id}`;
      const response = await axios.get(url, getToken());
      setSavedPubli(response.data);
    };

    checkSavedPubli();
  }, [params.id]);

  useEffect(() => {
    if (infoOnePublic?.comentarios) {
      console.log("Actualizando comentarios:", infoOnePublic.comentarios);
      setComentarios(infoOnePublic.comentarios); // 🔥 Reemplaza en lugar de agregar
    }
  }, [infoOnePublic]);

  useEffect(() => {
    const checkLike = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/megustas/${user.id}/${params?.id}`,
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
  }, [params.id]);

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

  const handlePublicComment = async () => {
    if (!commentPubli.trim()) return;

    try {
      const url = commentReplyId
        ? `http://localhost:8080/api/v1/comentarios/${commentReplyId}/responder`
        : `http://localhost:8080/api/v1/comentarios/${infoOnePublic.id}`;

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

  const estructurarComentarios = (comentarios) => {
    const mapaComentarios = new Map();

    comentarios.forEach((comentario) => {
      mapaComentarios.set(comentario.id, { ...comentario, respuestas: [] });
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

  const handleMeGusta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/megustas/${infoOnePublic?.id}`,
        {},
        getToken()
      );
      setActMeGusta((prev) => !prev);
    } catch (e) {
      console.error(`Error al gestionar el "Me gusta": ${e.message}`);
    }
  };

  const handleSendSavePubli = async () => {
    const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${params?.id}`;
    const response = await axios.post(url, {}, getToken());
    console.log(response);
    setSavedPubli((prev) => !prev);
  };

  useEffect(() => {
    if (infoOnePublic?.likers.length > 0) {
      const likeToUserAndOthers = () => {
        const allUsersLikeToPublic = infoOnePublic?.likers;
        const getOneUserLikeToPublic = allUsersLikeToPublic.at(
          Math.floor(Math.random() * allUsersLikeToPublic.length)
        );
        setUserToLikePublic(getOneUserLikeToPublic);
      };
      likeToUserAndOthers();
    }
  }, [infoOnePublic]);

  const handleNavigatePublicacionPage = (publicId) => {
    navigate(`/publicacion/${publicId}`);
  };

  const handleNavigate = (userId) => {
    navigate(`/profile/${userId}`);
  };

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

  const handleSetCommentPublic = (e) => {
    const textValue = e.target.value;
    setCommentPubli(textValue);
  };

  const handleEmojiClick = (emojiData) => {
    if (!refEmoji.current) return;

    const cursorPos = refEmoji.current.selectionStart;

    setCommentPubli((prevText) => {
      const textBeforeCursor = prevText.slice(0, cursorPos);
      const textAfterCursor = prevText.slice(cursorPos);
      const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;

      setTimeout(() => {
        if (refEmoji.current) {
          refEmoji.current.selectionStart = cursorPos + emojiData.emoji.length;
          refEmoji.current.selectionEnd = cursorPos + emojiData.emoji.length;
          refEmoji.current.focus();
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

  const handleActCursor = () => {
    if (refEmoji.current) {
      refEmoji.current.focus();
    }
  };

  return (
    <>
      <div className="container_pagePublicacion">
        {infoOnePublic && (
          <div className="conten_pagePublicacion">
            {infoOnePublic.contentUrl.endsWith(".mp4") ||
            infoOnePublic.contentUrl.endsWith(".webm") ? (
              <div className="container_videoPublic_pagePublicacion">
                <video className="videoPublic_pagePublicacion" controls>
                  <source src={infoOnePublic.contentUrl} type="video/mp4" />
                  Tu navegador no soporta videos.
                </video>
              </div>
            ) : (
              <div className="container_imgPublic_pagePublicacion">
                <img
                  src={infoOnePublic.contentUrl}
                  alt=""
                  className="imgPublic_pagePublicacion"
                />
              </div>
            )}
            <div>
              <div className="container_dates_user_pagePublicacion">
                <img
                  src={infoOnePublic.user.photoProfile}
                  alt=""
                  className="photoProfile_pagePublicacion"
                  onClick={() => handleNavigate(infoOnePublic.userId)}
                  onMouseEnter={() =>
                    setModalShowProfileOneUser(infoOnePublic.user?.id)
                  }
                  onMouseLeave={() => setModalShowProfileOneUser(null)}
                />
                <h3
                  onClick={() => handleNavigate(infoOnePublic.userId)}
                  onMouseEnter={() =>
                    setModalShowProfileOneUser(infoOnePublic.user?.id)
                  }
                  onMouseLeave={() => setModalShowProfileOneUser(null)}
                >
                  {infoOnePublic.user.userName}
                </h3>
                {showAllUsersFollowed.some(
                  (userSegui) => userSegui.id === infoOnePublic.userId
                ) ? (
                  <button
                    className="buttonFollowing_pagePublicacion"
                    onClick={() => {
                      handleSeguir(infoOnePublic.userId);
                    }}
                  >
                    Siguiendo
                  </button>
                ) : (
                  <button
                    className="buttonFollow_pagePublicacion"
                    onClick={() => {
                      handleSeguir(infoOnePublic.userId);
                    }}
                  >
                    Seguir
                  </button>
                )}
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
              <div className="container_comments_pagePublicacion">
                {infoOnePublic.description !== null && (
                  <div className="container_content_imgAndUsername_description_pagePublicacion">
                    <img
                      src={infoOnePublic.user.photoProfile}
                      alt=""
                      className="photoProfile_pagePublicacion"
                      onClick={() => handleNavigate(infoOnePublic.userId)}
                      onMouseEnter={() =>
                        setModalShowProfileOneUser(infoOnePublic.user.userName)
                      }
                      onMouseLeave={() => setModalShowProfileOneUser(null)}
                    />
                    <div className="container_userName_and_description_pagePublicacion">
                      <h3
                        className="userName_and_description_pagePublicacion"
                        onClick={() => handleNavigate(infoOnePublic.userId)}
                        onMouseEnter={() =>
                          setModalShowProfileOneUser(
                            infoOnePublic.user.userName
                          )
                        }
                        onMouseLeave={() => setModalShowProfileOneUser(null)}
                      >
                        {infoOnePublic.user.userName}
                      </h3>
                      <h3 className="description_and_description_pagePublicacion">
                        {infoOnePublic.description}
                      </h3>
                    </div>
                  </div>
                )}
                {modalShowProfileOneUser === infoOnePublic.userId && (
                  <div
                    className="container_modal_modalShowProfileOneUser_ComponentPublicacionPage"
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(infoOnePublic.user.id)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  >
                    <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                      <img
                        src={infoOnePublic.user.photoProfile}
                        className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                        onClick={() =>
                          handleNavigateProfileOneUser(infoOnePublic.user.id)
                        }
                      />
                      <div className="container_names_userName_modalShowProfileOneUser">
                        <h4
                          onClick={() =>
                            handleNavigateProfileOneUser(infoOnePublic.user.id)
                          }
                          className="name_modalShowProfileOneUser"
                        >
                          {infoOnePublic.user.userName}
                        </h4>
                        <h4 className="userName_modalShowProfileOneUser">
                          {infoOnePublic.user.firstName}{" "}
                          {infoOnePublic.user.lastName}
                        </h4>
                      </div>
                    </div>

                    <div className="container_dates_modalShowProfileOneUser">
                      <div className="container_numberPublicacions_modalShowProfileOneUser">
                        <h5>{infoOnePublic?.user.publicacions.length}</h5>
                        <h4>Publicaciones</h4>
                      </div>
                      <div className="container_numberFollowers_modalShowProfileOneUser">
                        <h5>{infoOnePublic.user.seguidores.length}</h5>
                        <h4>Seguidores</h4>
                      </div>
                      <div className="container_numberFollowed_modalShowProfileOneUser">
                        <h5>{infoOnePublic.user.seguidos.length}</h5>
                        <h4>Seguidos</h4>
                      </div>
                    </div>
                    <div>
                      {infoOnePublic.user.publicacions.length > 0 ? (
                        <div className="container_AllPublicacions_modalShowProfileOneUser">
                          {infoOnePublic.user.publicacions
                            .slice(0, 3)
                            .map((publicsOneUser) => (
                              <div className="container_publicacions_modalShowProfileOneUser">
                                {publicsOneUser.contentUrl.endsWith(".mp4") ||
                                publicsOneUser.contentUrl.endsWith(".webm") ? (
                                  <div
                                    className="container_video_modalShowProfileOneUser"
                                    onClick={() =>
                                      handleNavigatePublicacionPage(
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
                                        handleNavigatePublicacionPage(
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
                            Cuando {coment.user.userName} comparta fotos y
                            reels, los verás aquí
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      {showAllUsersFollowed.some(
                        (userSeguid) => userSeguid.id === infoOnePublic.user.id
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
                            onClick={() => handleSeguir(infoOnePublic.user.id)}
                          >
                            Siguiendo
                          </button>
                        </div>
                      ) : (
                        <div className="container_buttonFollow_modalShowProfileOneUser">
                          <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                          <button
                            onClick={() => handleSeguir(infoOnePublic.user.id)}
                          >
                            Seguir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {modalShowProfileOneUser == infoOnePublic.user.userName && (
                  <div
                    className="container_modal_modalShowProfileOneUser_ComponentPublicacionPagePubliDescription"
                    onMouseEnter={() =>
                      setModalShowProfileOneUser(infoOnePublic.user.userName)
                    }
                    onMouseLeave={() => setModalShowProfileOneUser(null)}
                  >
                    <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
                      <img
                        src={infoOnePublic.user.photoProfile}
                        className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                        onClick={() =>
                          handleNavigateProfileOneUser(infoOnePublic.user.id)
                        }
                      />
                      <div className="container_names_userName_modalShowProfileOneUser">
                        <h4
                          onClick={() =>
                            handleNavigateProfileOneUser(infoOnePublic.user.id)
                          }
                          className="name_modalShowProfileOneUser"
                        >
                          {infoOnePublic.user.userName}
                        </h4>
                        <h4 className="userName_modalShowProfileOneUser">
                          {infoOnePublic.user.firstName}{" "}
                          {infoOnePublic.user.lastName}
                        </h4>
                      </div>
                    </div>

                    <div className="container_dates_modalShowProfileOneUser">
                      <div className="container_numberPublicacions_modalShowProfileOneUser">
                        <h5>{infoOnePublic?.user.publicacions.length}</h5>
                        <h4>Publicaciones</h4>
                      </div>
                      <div className="container_numberFollowers_modalShowProfileOneUser">
                        <h5>{infoOnePublic.user.seguidores.length}</h5>
                        <h4>Seguidores</h4>
                      </div>
                      <div className="container_numberFollowed_modalShowProfileOneUser">
                        <h5>{infoOnePublic.user.seguidos.length}</h5>
                        <h4>Seguidos</h4>
                      </div>
                    </div>
                    <div>
                      {infoOnePublic.user.publicacions.length > 0 ? (
                        <div className="container_AllPublicacions_modalShowProfileOneUser">
                          {infoOnePublic.user.publicacions
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
                            Cuando {coment.user.userName} comparta fotos y
                            reels, los verás aquí
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      {showAllUsersFollowed.some(
                        (userSeguid) => userSeguid.id === infoOnePublic.user.id
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
                            onClick={() => handleSeguir(infoOnePublic.user.id)}
                          >
                            Siguiendo
                          </button>
                        </div>
                      ) : (
                        <div className="container_buttonFollow_modalShowProfileOneUser">
                          <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                          <button
                            onClick={() => handleSeguir(infoOnePublic.user.id)}
                          >
                            Seguir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {comentariosEstructurados.length > 0 ? (
                  <div>
                    {comentariosEstructurados.map((commentsPubli) => (
                      <div key={commentsPubli.id}>
                        <Comentarios
                          key={commentsPubli.id}
                          coment={commentsPubli}
                          setCommentPubli={setCommentPubli}
                          setCommentReplyId={setCommentReplyId}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>Todavia no hay comentarios</p>
                  </div>
                )}
              </div>
              <div className="container_buttonPubli_and_likersAndTime">
                <div className="container_buttonsPubli_publicacionPage">
                  {actMeGusta ? (
                    <IoMdHeart
                      className="custom_button button_like_act_publicacionPage"
                      onClick={() => setActMeGusta((prev) => !prev)}
                    />
                  ) : (
                    <IoMdHeartEmpty
                      className="custom_button button_heart"
                      onClick={handleMeGusta}
                    />
                  )}
                  <FaRegComment
                    className="custom_button icon_comment"
                    onClick={handleActCursor}
                  />
                  <FiSend
                    className="custom_button icon_share"
                    onClick={() => setModalShareComment(true)}
                  />
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
                                      handleSelectUserShareFromComment(
                                        seguidUser.id
                                      )
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
                  <div className="container_buttonSaved_publicacionPage buttonSaved_publicacionPage">
                    {savedPubli ? (
                      <BsSave2Fill
                        className="custom_button"
                        onClick={handleSendSavePubli}
                      />
                    ) : (
                      <BsSave2
                        className="custom_button buttonSaved_publicacionPage"
                        onClick={handleSendSavePubli}
                      />
                    )}
                  </div>
                </div>
                {infoOnePublic.likers.length > 0 && (
                  <div className="container_usersLikers_publicacionPage">
                    Le gusta a{" "}
                    <span className="space_showLikers_publicacionPage"></span>
                    <button
                      className="button_oneUserLike_publicacionPage"
                      onClick={() => handleNavigate(userTolikePublic.id)}
                    >
                      {userTolikePublic.userName}
                    </button>
                    {infoOnePublic.likers.length > 1 && (
                      <div>
                        <span className="space_showLikers_publicacionPage"></span>{" "}
                        y a{" "}
                        <button
                          className="moreLikers_onePublic_publicacionPage"
                          onClick={() => setShowUsersLikers(true)}
                        >
                          personas mas
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
                          {infoOnePublic.user.userName} puede ver el número
                          total de personas que han indicado que les gusta esta
                          publicación
                        </p>
                      </div>
                      <div className="container_allUsers_toLike_onePublic">
                        {infoOnePublic?.likers
                          .filter((userToLik) => userToLik.id !== user.id)
                          .map((userToLik) => (
                            <div
                              key={userToLik.id}
                              className="container_content_oneUser_toLike"
                            >
                              <div
                                className="container_img_userName_and_names"
                                onMouseEnter={() =>
                                  setmodalProfileOneUserToUserLikers(
                                    userToLik.id
                                  )
                                }
                                onMouseLeave={() =>
                                  setmodalProfileOneUserToUserLikers(null)
                                }
                              >
                                <img
                                  src={userToLik.photoProfile}
                                  alt=""
                                  onClick={() =>
                                    handleNavigateProfileOneUser(userToLik.id)
                                  }
                                />
                                <div className="container_namesAndUserName_allsUsers_likers_onePublic">
                                  <h4
                                    className="userName_oneUser_toLike"
                                    onClick={() =>
                                      handleNavigateProfileOneUser(userToLik.id)
                                    }
                                  >
                                    {userToLik.userName}
                                  </h4>
                                  <h4 className="nameAndFirstName_allsUsers_likers_onePublic">
                                    {userToLik.firstName} {userToLik.lastName}
                                  </h4>
                                </div>
                              </div>

                              {modalProfileOneUserToUserLikers ===
                                userToLik.id && (
                                <div
                                  className="container_modal_modalShowProfileOneUser"
                                  onMouseEnter={() =>
                                    setmodalProfileOneUserToUserLikers(
                                      userToLik.id
                                    )
                                  }
                                  onMouseLeave={() =>
                                    setmodalProfileOneUserToUserLikers(null)
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
                                                    handleNavigatePublicacionPage(
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
                                                      handleNavigatePublicacionPage(
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
                                          Cuando {userToLik.userName} comparta
                                          fotos y reels, los verás aquí
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
                <div className="container_time_publicacionPage">
                  <h5 className="how_along_time_publica">
                    {getFormattedDate(infoOnePublic?.createdAt)}
                  </h5>
                </div>
              </div>
              <div className="container_textArea_publicacionPage">
                <img
                  src={user.photoProfile}
                  alt=""
                  className="photoProfile_textarea_pagePublicacion"
                />
                <BsEmojiSmile
                  className="icon_emoji_publicacionPage"
                  onClick={() => setShowModalEmojis((prev) => !prev)}
                />
                {showModalEmojis && (
                  <div className="container_emojiPicker_pagePublicacion">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      className="content_emojis_commentMain"
                    />
                  </div>
                )}
                <textarea
                  placeholder="Añade un comentario..."
                  ref={refEmoji}
                  className="textArea_publicacionPage"
                  value={commentPubli}
                  onInput={handleSetCommentPublic}
                />
                {commentPubli && commentPubli.length > 0 && (
                  <button
                    className="button_publicar_publicacionPage"
                    onClick={handlePublicComment}
                  >
                    Publicar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="container_text_morePublicacions">
          <h3>
            Mas publicaciones de{" "}
            <button onClick={() => handleNavigate(infoOnePublic?.user.id)}>
              {infoOnePublic?.user.userName}
            </button>
          </h3>
        </div>

        {infoOnePublic?.user.publicacions ? (
          <div className="container_morePublicacions_publicacionPage">
            {infoOnePublic.user.publicacions
              .slice(0, 9)
              .filter(
                (publicUser) => Number(publicUser.id) !== Number(params.id)
              )
              .map((publicUser) => (
                <div key={publicUser.id}>
                  {publicUser.contentUrl.endsWith(".mp4") ||
                  publicUser.contentUrl.endsWith(".webm") ? (
                    <div
                      onClick={() =>
                        handleNavigatePublicacionPage(publicUser.id)
                      }
                    >
                      <video className="container_oneVideo_morePublicacions_publicacionPage">
                        <source src={publicUser.contentUrl} type="video/mp4" />{" "}
                        Tu navegador no soporta videos
                      </video>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={publicUser.contentUrl}
                        alt=""
                        className="container_oneImage_morePublicacions_publicacionPage"
                        onClick={() =>
                          handleNavigatePublicacionPage(publicUser.id)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div> No hay mas publicaciones</div>
        )}
        <div className="container_buttons_infoApplication_publicacionPage">
          <div>
            <a href="https://about.meta.com/" target="_blank">
              Meta
            </a>
          </div>
          <div>
            <a href="https://about.instagram.com/" target="_blank">
              Informacion
            </a>
          </div>
          <div>
            <a href="https://about.instagram.com/blog/" target="_blank">
              Blog
            </a>
          </div>
          <div>
            <a
              href="https://about.instagram.com/about-us/careers"
              target="_blank"
            >
              Empleo
            </a>
          </div>
          <div>
            <a href="https://help.instagram.com/" target="_blank">
              Ayuda
            </a>
          </div>
          <div>
            <a
              href="https://developers.facebook.com/docs/instagram-platform"
              target="_blank"
            >
              Api
            </a>
          </div>
          <div>
            <a
              href="https://help.instagram.com/581066165581870/"
              target="_blank"
            >
              Privacidad
            </a>
          </div>
          <div>
            <a
              href="https://help.instagram.com/581066165581870/"
              target="_blank"
            >
              Condiciones
            </a>
          </div>
          <div>
            <a
              href="https://play.google.com/store/apps/details?id=com.instagram.lite&referrer=ig_mid%3D0C4731CF-AB57-4DBD-A39D-EA3156386C1F%26utm_campaign%3DIGLiteCarbonSideload%26utm_content%3Dli%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps://www.instagram.com/p/DF4Ps5rNUxg/&pli=1"
              target="_blank"
            >
              Instagram Lite
            </a>
          </div>
          <div>
            <a href="https://www.threads.net/" target="_blank">
              Threads
            </a>
          </div>
          <div>
            <a
              href="https://www.facebook.com/help/instagram/261704639352628?hl=es-es"
              target="_blank"
            >
              Subir contactos y personas no usuarias
            </a>
          </div>
          <div>
            <h5>© 2025 Instagram from Meta</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicacionPage;
