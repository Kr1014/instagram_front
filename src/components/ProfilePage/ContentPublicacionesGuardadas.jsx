import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { UserContext } from "../LoginPage/UserProvider";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import getToken from "../../utils/getToken";
import Comentarios from "../HomePage/Comentarios";
import { BsSearch } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { BsSave2 } from "react-icons/bs";
import { BsSave2Fill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa6";
import { PiFacebookLogoBold } from "react-icons/pi";
import { LiaFacebookMessenger } from "react-icons/lia";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { FaThreads } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import useSend from "../../hooks/useSend";
import { NofiticationContext } from "../HomePage/ShowNotificationSend";

const ContentPublicacionesGuardadas = ({ savePubli }) => {
  const { user } = useContext(UserContext);
  const { timeDurationNotification } = useContext(NofiticationContext);
  const [commentPubli, setCommentPubli] = useState("");
  const [actMeGusta, setActMeGusta] = useState(false);
  const [modalComment, setModalComment] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [modalShare, setModalShare] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [messageSharePubli, setMessageSharePubli] = useState("");
  const [searchUserByShare, setsearchUserByShare] = useState("");
  const [savedPubli, setSavedPubli] = useState();
  const refSearhUserByShare = useRef();
  const refMessageSharePubli = useRef();

  useEffect(() => {
    if (savePubli.publicacion.comentarios) {
      setComentarios(savePubli.publicacion.comentarios);
    }
  }, [savePubli]);

  useEffect(() => {
    const checkLike = async () => {
      if (!user || !savePubli) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/megustas/${user.id}/${savePubli.publicacionId}`,
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
  }, [user, savePubli]);

  useEffect(() => {
    const checkSavedPubli = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${savePubli.publicacionId}`;
      const response = await axios.get(url, getToken());
      setSavedPubli(response.data);
    };

    checkSavedPubli();
  }, [user, savePubli]);

  const handleMeGusta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/megustas/${savePubli.publicacionId}`,
        {},
        getToken()
      );
      setActMeGusta((prev) => !prev);
    } catch (e) {
      console.error(`Error al gestionar el "Me gusta": ${e.message}`);
    }
  };

  const handleCloseComment = () => {
    setModalComment(false);
  };

  const handleTextComment = (e) => {
    setCommentPubli(e.target.value);
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/comentarios/${savePubli.publicacionId}`,
        getToken()
      );
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error.message);
    }
  };

  const handlePublicComment = async () => {
    const urlBase = "http://localhost:8080/api/v1/comentarios";
    const url = `${urlBase}/${savePubli.publicacionId}`;

    try {
      await axios.post(url, { texto: commentPubli }, getToken());

      await fetchComentarios();

      setCommentPubli("");
    } catch (error) {
      console.error("Error al publicar el comentario:", error.message);
    }
  };

  const handleSharePublic = () => {
    setModalShare(true);
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
          contentMultimedia: savePubli.publicacion.contentUrl,
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
    const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${savePubli.publicacionId}`;
    const response = await axios.post(url, {}, getToken());
    setSavedPubli((prev) => !prev);
  };

  console.log(comentarios);

  return (
    <>
      <div>
        <div
          className="container_one_publicacionSave"
          onClick={() => setModalComment(true)}
        >
          {savePubli.publicacion.contentUrl.endsWith(".mp4") ||
          savePubli.publicacion.contentUrl.endsWith(".webm") ? (
            <video className="video_publicac_profile">
              <source src={savePubli.publicacion.contentUrl} />
            </video>
          ) : (
            <img
              src={savePubli.publicacion.contentUrl}
              alt=""
              className="image_publicac_profile"
            />
          )}
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
                    onClick={() =>
                      window.open("https://www.gmail.com", "_blank")
                    }
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
                {savePubli.publicacion.contentUrl ? (
                  savePubli.publicacion.contentUrl.endsWith(".mp4") ||
                  savePubli.publicacion.contentUrl.endsWith(".webm") ? (
                    <video controls className="contentVideo_modal_comment">
                      <source
                        src={savePubli.publicacion.contentUrl}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={savePubli.publicacion.contentUrl}
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
                      src={savePubli.publicacion.user.photoProfile}
                      alt=""
                      className="photoProfile_modal_comment"
                    />
                    <h4>{savePubli.publicacion.user.userName}</h4>
                  </div>
                </div>
                <div className="border_modal_comment_1"></div>
                <div className="user_ownPublic_part2">
                  <div className="content_img_userName2">
                    <img
                      src={savePubli.publicacion.user.photoProfile}
                      alt=""
                      className="photoProfile_modal_comment"
                    />
                    <h4>{savePubli.publicacion.user.userName}</h4>
                    <p>{savePubli.description}</p>
                  </div>
                  <div className="container_all_conmments">
                    {comentarios?.length > 0 ? (
                      comentarios.map((coment) => (
                        <Comentarios key={coment?.id} coment={coment} />
                      ))
                    ) : (
                      <p className="notcomments">No hay comentarios aún</p>
                    )}
                  </div>
                </div>
                <div className="border_modal_comment_2"></div>
                <div className="content_info_public">
                  <div className="buttons_comment_content">
                    <div className="buttons_tri_content">
                      <div>
                        <IoMdHeartEmpty
                          className={`custom_button button_comment ${actMeGusta ? "button_like_act" : "button_like"}`}
                          onClick={handleMeGusta}
                        />
                        <FaRegComment className="button_comment" />
                        <FiSend
                          className="button_comment"
                          onClick={handleSharePublic}
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
                      <h4>Le gusta a y personas más</h4>
                      <h5 className="how_along_time_publica">Hace horas</h5>
                    </div>
                  </div>
                </div>
                <div className="border_modal_comment_3"></div>
                <div className="content_create_comment_all">
                  <div className="content_create_comment">
                    <BsEmojiSmile className="emoji" />
                    <textarea
                      rows="1"
                      placeholder="Añade un comentario..."
                      className="add_comment"
                      value={commentPubli}
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
          </div>
        )}
      </div>
    </>
  );
};

export default ContentPublicacionesGuardadas;
