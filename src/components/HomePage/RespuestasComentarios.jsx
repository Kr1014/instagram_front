import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../LoginPage/UserProvider";
import { useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken";
import axios from "axios";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import "./css/respuestaComentarios.css";
import { FiUserPlus } from "react-icons/fi";
import { LiaFacebookMessenger } from "react-icons/lia";
import { IoCameraOutline } from "react-icons/io5";

const RespuestasComentarios = ({
  commentRes,
  setCommentPubli,
  setCommentReplyId,
}) => {
  const { user } = useContext(UserContext);
  const [resCommentCountLikers, setResCommentCountLikers] = useState([]);
  const [likeCommentOneRes, setLikeCommentOneRes] = useState(false);
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const navigate = useNavigate();

  const handleNavigateProfileOneUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    const verifyLikeResComments = async () => {
      try {
        const url = `http://localhost:8080/api/v1/meGustaComentarios/${commentRes?.id}`;
        const res = await axios.get(url, getToken());
        setLikeCommentOneRes(res.data.like);
      } catch (error) {
        console.error(
          "Error en la solicitud:",
          error.response?.data || error.message
        );
      }
    };

    verifyLikeResComments();
  }, [commentRes?.id, likeCommentOneRes]);

  useEffect(() => {
    setResCommentCountLikers(commentRes?.likers || []);
  }, [commentRes?.id]);

  const handleLikeComment = async () => {
    try {
      const url = `http://localhost:8080/api/v1/meGustaComentarios/${commentRes?.id}`;
      await axios.post(url, {}, getToken());

      setLikeCommentOneRes((prev) => !prev);

      setResCommentCountLikers((prevLikers) => {
        if (likeCommentOneRes) {
          return prevLikers.filter((liker) => liker.id !== user.id);
        } else {
          return [...prevLikers, { id: user.id }];
        }
      });
    } catch (error) {
      console.error("Error al dar/quitar like:", error);
    }
  };

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

  return (
    <div className="container_all_oneResComment">
      <div className="content_one_comment_userAndComment">
        <img
          src={commentRes?.user.photoProfile}
          alt=""
          className="img_one_comment"
          onClick={() => handleNavigateProfileOneUser(commentRes.user.id)}
          onMouseEnter={() => setModalShowProfileOneUser(commentRes?.id)}
          onMouseLeave={() => setModalShowProfileOneUser(null)}
        />
        <p className="content_textComment textComment_ResComments">
          <span
            className="span_userName_textComment_RespuestaComentarios"
            onMouseEnter={() => setModalShowProfileOneUser(commentRes?.id)}
            onMouseLeave={() => setModalShowProfileOneUser(null)}
            onClick={() => handleNavigateProfileOneUser(commentRes.user.id)}
          >
            {commentRes.user.userName}
          </span>
          {commentRes?.texto}
        </p>
        {modalShowProfileOneUser == commentRes.id && (
          <div
            className="container_modal_modalShowProfileOneUser_ComponentRespuestasComentarios"
            onMouseEnter={() => setModalShowProfileOneUser(commentRes.id)}
            onMouseLeave={() => setModalShowProfileOneUser(null)}
          >
            <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
              <img
                src={commentRes.user.photoProfile}
                className="imgUser_modal_show_ProfileOneUser_ComponentComentarios"
                onClick={() => handleNavigateProfileOneUser(commentRes.user.id)}
              />
              <div className="container_names_userName_modalShowProfileOneUser">
                <h4
                  onClick={() =>
                    handleNavigateProfileOneUser(commentRes.user.id)
                  }
                  className="name_modalShowProfileOneUser"
                >
                  {commentRes.user.userName}
                </h4>
                <h4 className="userName_modalShowProfileOneUser">
                  {commentRes.user.firstName} {commentRes.user.lastName}
                </h4>
              </div>
            </div>

            <div className="container_dates_modalShowProfileOneUser">
              <div className="container_numberPublicacions_modalShowProfileOneUser">
                <h5>{commentRes?.user.publicacions.length}</h5>
                <h4>Publicaciones</h4>
              </div>
              <div className="container_numberFollowers_modalShowProfileOneUser">
                <h5>{commentRes.user.seguidores.length}</h5>
                <h4>Seguidores</h4>
              </div>
              <div className="container_numberFollowed_modalShowProfileOneUser">
                <h5>{commentRes.user.seguidos.length}</h5>
                <h4>Seguidos</h4>
              </div>
            </div>
            <div>
              {commentRes.user.publicacions.length > 0 ? (
                <div className="container_AllPublicacions_modalShowProfileOneUser">
                  {commentRes.user.publicacions
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
                    Cuando {commentRes.user.userName} comparta fotos y reels,
                    los verás aquí
                  </p>
                </div>
              )}
            </div>
            <div>
              {showAllUsersFollowed.some(
                (userSeguid) => userSeguid.id === commentRes.user.id
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
                    onClick={() => handleSeguir(commentRes.user.id)}
                  >
                    Siguiendo
                  </button>
                </div>
              ) : (
                <div className="container_buttonFollow_modalShowProfileOneUser">
                  <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                  <button onClick={() => handleSeguir(commentRes.user.id)}>
                    Seguir
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="container_resComment_time_res_comment">
          <h6 className="resComment_time_res_comment">
            {getDateComment(commentRes?.createdAt)}
          </h6>
          {resCommentCountLikers.length > 0 && (
            <div className="container_countLikers_comment">
              <h6>{resCommentCountLikers.length} Me gusta</h6>
            </div>
          )}
          <button
            className="button_res_comment_resComment"
            onClick={() => {
              setCommentPubli(`@${commentRes?.user.userName}`);
              setCommentReplyId(commentRes?.id);
            }}
          >
            Responder
          </button>
        </div>
        {likeCommentOneRes ? (
          <IoMdHeart
            className="heartComment_resComment likeCommentActi"
            onClick={handleLikeComment}
          />
        ) : (
          <IoMdHeartEmpty
            className="heartComment_resComment"
            onClick={handleLikeComment}
          />
        )}
      </div>

      {/* Mostrar respuestas anidadas si existen */}
      {commentRes.respuestas && commentRes.respuestas.length > 0 && (
        <div className="container_sub_resComments">
          {commentRes.respuestas.map((subRes) => (
            <RespuestasComentarios
              key={subRes.id}
              commentRes={subRes}
              setCommentPubli={setCommentPubli}
              setCommentReplyId={setCommentReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RespuestasComentarios;
