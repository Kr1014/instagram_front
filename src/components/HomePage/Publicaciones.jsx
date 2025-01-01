import React, { useContext, useEffect, useState } from "react";
import "./css/publicaciones.css";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComments } from "react-icons/fa";
import { UserContext } from "../LoginPage/UserProvider";
import { TbLocationShare } from "react-icons/tb";
import axios from "axios";
import getToken from "../../utils/getToken";
import Comentarios from "./Comentarios";
import { BsEmojiSmile } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { BsSave2 } from "react-icons/bs";

const Publicaciones = ({ publicac }) => {
  const { user } = useContext(UserContext);
  const [commentPubli, setCommentPubli] = useState();
  const [actMeGusta, setActMeGusta] = useState(false);
  const [modalComment, setModalComment] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (publicac?.comentarios) {
      setComentarios(publicac.comentarios);
    }
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
        `http://localhost:8080/api/v1/comentarios/${publicac?.id}`,
        getToken()
      );
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error.message);
    }
  };

  const handlePublicComment = async () => {
    const urlBase = "http://localhost:8080/api/v1/comentarios";
    const url = `${urlBase}/${publicac?.id}`;

    try {
      const res = await axios.post(url, { texto: commentPubli }, getToken());

      await fetchComentarios();

      setCommentPubli("");
    } catch (error) {
      console.error("Error al publicar el comentario:", error.message);
    }
  };

  return (
    <>
      <div className="container_one_publicacion">
        <div className="onePubli_userName_photoProfile">
          <img
            src={publicac?.user.photoProfile}
            alt=""
            className="userPhoto_publicac"
          />
          <h4>{publicac?.user.userName}</h4>
        </div>

        <img src={publicac?.image} alt="image" className="image_public" />
        <br />

        <button
          className={`custom_button ${actMeGusta ? "button_like_act" : "button_like"}`}
          onClick={handleMeGusta}
        >
          <IoMdHeartEmpty />
        </button>

        <button className="custom_button" onClick={handleComment}>
          <FaRegComments className="button_comment" />
        </button>

        <button className="custom_button">
          <TbLocationShare />
        </button>

        <p>
          {publicac?.user.userName} {publicac?.description}
        </p>
        <div className="border_one_publi"></div>
      </div>
      {modalComment && (
        <div className="container_modal_comment_content">
          <VscError className="exit_content" onClick={handleCloseComment} />
          <div className="container_content_comment">
            <div className="content_image_publica_modal">
              <img
                src={publicac?.image}
                alt=""
                className="image_publica_modal_comment"
              />
            </div>
            <div className="content_comments">
              <div className="user_ownPublic_part1">
                <div className="content_img_userName">
                  <img
                    src={publicac?.user.photoProfile}
                    alt=""
                    className="photoProfile_modal_comment"
                  />
                  <h4>{publicac?.user.userName}</h4>
                </div>
              </div>
              <div className="border_modal_comment_1"></div>
              <div className="user_ownPublic_part2">
                <div className="content_img_userName2">
                  <img
                    src={publicac?.user.photoProfile}
                    alt=""
                    className="photoProfile_modal_comment"
                  />
                  <h4>{publicac?.user.userName}</h4>
                  <p>{publicac?.description}</p>
                </div>
                <div className="container_all_conmments">
                  {comentarios?.length > 0 ? (
                    comentarios.map((coment) => (
                      <Comentarios key={coment?.id} coment={coment} />
                    ))
                  ) : (
                    <p>No hay comentarios aún</p>
                  )}
                </div>
              </div>
              <div className="border_modal_comment_2"></div>
              <div className="content_info_public">
                <div className="buttons_comment_content">
                  <div className="buttons_tri_content">
                    <div>
                      <IoMdHeartEmpty className="button_comment" />
                      <FaRegComments className="button_comment" />
                      <TbLocationShare className="button_comment" />
                    </div>
                    <div className="content_button_share">
                      <BsSave2 className="button_share" />
                    </div>
                  </div>
                  <div className="time_like">
                    <h4>Le gusta a y personas mas</h4>
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
                    placeholder="Añade un comentario"
                    className="add_comment"
                    value={commentPubli}
                    onChange={handleTextComment}
                  />
                  <button
                    className="public_comment"
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
    </>
  );
};

export default Publicaciones;
