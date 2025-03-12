import React, { useContext, useState, useEffect } from "react";
import "./css/comentarios.css";
import { useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import axios from "axios";
import { UserContext } from "../LoginPage/UserProvider";
import RespuestasComentarios from "./RespuestasComentarios";
import { IoCameraOutline } from "react-icons/io5";
import { LiaFacebookMessenger } from "react-icons/lia";
import { FiUserPlus } from "react-icons/fi";

const Comentarios = ({ coment, setCommentPubli, setCommentReplyId }) => {
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [likeOneComment, setLikeOneComment] = useState(false);
  const [countLikers, setCountLikers] = useState([]);
  const [showResOfComments, setShowResOfComments] = useState(false);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(coment);
  }, []);

  const handleNavigateProfileOneUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

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

  const getDateComment = (date) => {
    const commentDate = new Date(date);
    const now = new Date();
    const diffMilliseconds = now - commentDate;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24 * 7));

    if (diffMinutes < 60) return `${diffMinutes} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return `${diffDays} día`;
    if (diffDays < 7) return `${diffDays} días`;
    return `${diffWeeks} sem`;
  };

  useEffect(() => {
    const verifyLikeComments = async () => {
      try {
        const url = `http://localhost:8080/api/v1/meGustaComentarios/${coment?.id}`;
        const res = await axios.get(url, getToken());
        setLikeOneComment(res.data.like);
      } catch (error) {
        console.error(
          "Error en la solicitud:",
          error.response?.data || error.message
        );
      }
    };

    verifyLikeComments();
  }, [coment?.id, likeOneComment]);

  useEffect(() => {
    setCountLikers(coment?.likers);
  }, [coment?.id]);

  const handleLikeComment = async () => {
    try {
      const url = `http://localhost:8080/api/v1/meGustaComentarios/${coment?.id}`;
      await axios.post(url, {}, getToken());

      setLikeOneComment((prev) => !prev);
      setCountLikers((prevLikers = []) => {
        if (!Array.isArray(prevLikers)) {
          return [];
        }

        return likeOneComment
          ? prevLikers.filter((liker) => liker.id !== user.id)
          : [...prevLikers, { id: user.id }];
      });
    } catch (error) {
      console.error("Error al dar/quitar like:", error);
    }
  };

  const contarTodasLasRespuestas = (comentario) => {
    if (!comentario.respuestas || comentario.respuestas.length === 0) {
      return 0;
    }
    return (
      comentario.respuestas.length +
      comentario.respuestas.reduce((acc, respuesta) => {
        return acc + contarTodasLasRespuestas(respuesta);
      }, 0)
    );
  };

  const handleSeguir = async (userId) => {
    try {
      const url = `http://localhost:8080/api/v1/seguidores/${userId}`;
      const response = await axios.post(url, {}, getToken());
    } catch (e) {
      console.error("Hubo un error", e);
    }
  };

  return (
    <div className="content_one_comment_all">
      <div className="content_one_comment_userAndComment">
        <img
          src={coment?.user.photoProfile}
          alt=""
          className="img_one_comment"
          onClick={() => handleNavigateProfileOneUser(coment.user.id)}
          onMouseEnter={() => setModalShowProfileOneUser(coment?.id)}
          onMouseLeave={() => setModalShowProfileOneUser(null)}
        />

        <p className="content_textComment">
          <span
            className="span_userName_textComment_Comentarios"
            onMouseEnter={() => setModalShowProfileOneUser(coment?.id)}
            onMouseLeave={() => setModalShowProfileOneUser(null)}
            onClick={() => handleNavigateProfileOneUser(coment.user.id)}
          >
            {coment?.user.userName}
          </span>
          {coment?.texto}
        </p>
        <div className="container_time_res_comment">
          <h5 className="time_res_comment">
            {getDateComment(coment?.createdAt)}
          </h5>
          {Array.isArray(countLikers) && countLikers.length > 0 && (
            <div className="container_countLikers_comment">
              <h6>{countLikers.length} Me gusta</h6>
            </div>
          )}

          <button
            className="button_res_comment"
            onClick={() => {
              setCommentPubli(`@${coment.user.userName} `);
              setCommentReplyId(coment.id);
            }}
          >
            Responder
          </button>
        </div>
        {likeOneComment ? (
          <IoMdHeart
            className="heart_comment likeCommentActi"
            onClick={handleLikeComment}
          />
        ) : (
          <IoMdHeartEmpty
            className="heart_comment"
            onClick={handleLikeComment}
          />
        )}
      </div>

      {modalShowProfileOneUser === coment.id && (
        <div
          className="container_modal_modalShowProfileOneUser_ComponentComentarios"
          onMouseEnter={() => setModalShowProfileOneUser(coment.id)}
          onMouseLeave={() => setModalShowProfileOneUser(null)}
        >
          <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
            <img
              src={coment.user.photoProfile}
              className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
              onClick={() => handleNavigateProfileOneUser(coment.user.id)}
            />
            <div className="container_names_userName_modalShowProfileOneUser">
              <h4
                onClick={() => handleNavigateProfileOneUser(coment.user.id)}
                className="name_modalShowProfileOneUser"
              >
                {coment.user.userName}
              </h4>
              <h4 className="userName_modalShowProfileOneUser">
                {coment.user.firstName} {coment.user.lastName}
              </h4>
            </div>
          </div>

          <div className="container_dates_modalShowProfileOneUser">
            <div className="container_numberPublicacions_modalShowProfileOneUser">
              <h5>{coment.user.publicacions?.length || 0}</h5>
              <h4>Publicaciones</h4>
            </div>

            <div className="container_numberFollowers_modalShowProfileOneUser">
              <h5>{coment.user.seguidores?.length || 0}</h5>
              <h4>Seguidores</h4>
            </div>
            <div className="container_numberFollowed_modalShowProfileOneUser">
              <h5>{coment.user.seguidos?.length || 0}</h5>
              <h4>Seguidos</h4>
            </div>
          </div>
          <div>
            {coment.user.publicacions?.length > 0 ? (
              <div className="container_AllPublicacions_modalShowProfileOneUser">
                {coment.user.publicacions.slice(0, 3).map((publicsOneUser) => (
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
                  Cuando {coment.user.userName} comparta fotos y reels, los
                  verás aquí
                </p>
              </div>
            )}
          </div>
          <div>
            {user.id === coment.user.id ? (
              <div className="container_editProfile_modalShowProfileOneUser">
                <button
                  onClick={() => handleNavigateProfileOneUser(user.id)}
                  className="editProfile_modalShowProfileOneUser"
                >
                  Editar perfil
                </button>
              </div>
            ) : showAllUsersFollowed.some(
                (userSeguid) => userSeguid.id === coment.user.id
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
                  onClick={() => handleSeguir(coment.user.id)}
                >
                  Siguiendo
                </button>
              </div>
            ) : (
              <div className="container_buttonFollow_modalShowProfileOneUser">
                <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                <button onClick={() => handleSeguir(coment.user.id)}>
                  Seguir
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {coment?.respuestas.length > 0 && (
        <div className="container_seeResComments">
          <div className="borderLeft_seeResComments"></div>
          <h4
            onClick={() => setShowResOfComments((prev) => !prev)}
            className="seeResComments"
          >
            Ver respuestas {`(${contarTodasLasRespuestas(coment)})`}
          </h4>
        </div>
      )}

      {showResOfComments && (
        <div className="container_all_resComments">
          {coment?.respuestas.map((commentRes) => (
            <RespuestasComentarios
              key={commentRes?.id}
              commentRes={commentRes}
              setCommentPubli={setCommentPubli}
              setCommentReplyId={setCommentReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comentarios;
