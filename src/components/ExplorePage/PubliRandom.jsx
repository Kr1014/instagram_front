import React, { useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { BsSave2 } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComments } from "react-icons/fa";
import { TbLocationShare } from "react-icons/tb";
import "./css/publiRandom.css";
import Comentarios from "../HomePage/Comentarios";
import getToken from "../../utils/getToken";
import axios from "axios";

const PubliRandom = ({ publiRan }) => {
  const [commentPubli, setCommentPubli] = useState();
  const [modalComment, setModalComment] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchInitialComments = async () => {
      if (!publiRan?.id) return;
      await fetchComentarios();
    };

    fetchInitialComments();
  }, [publiRan]);

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
        `http://localhost:8080/api/v1/comentarios/${publiRan?.id}`,
        getToken()
      );
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error.message);
    }
  };

  console.log(comentarios);

  const handlePublicComment = async () => {
    const urlBase = "http://localhost:8080/api/v1/comentarios";
    const url = `${urlBase}/${publiRan?.id}`;

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
      <div className="content_one_publi_random">
        <img
          src={publiRan.image}
          alt=""
          className="img_publi_random"
          onClick={handleComment}
        />
      </div>
      {modalComment && (
        <div className="container_modal_comment_content">
          <VscError className="exit_content" onClick={handleCloseComment} />
          <div className="container_content_comment">
            <div className="content_image_publica_modal">
              <img
                src={publiRan?.image}
                alt=""
                className="image_publica_modal_comment"
              />
            </div>
            <div className="content_comments">
              <div className="user_ownPublic_part1">
                <div className="content_img_userName">
                  <img
                    src={publiRan?.user.photoProfile}
                    alt=""
                    className="photoProfile_modal_comment"
                  />
                  <h4>{publiRan?.user.userName}</h4>
                </div>
              </div>
              <div className="border_modal_comment_1"></div>
              <div className="user_ownPublic_part2">
                <div className="content_img_userName2">
                  <img
                    src={publiRan?.user.photoProfile}
                    alt=""
                    className="photoProfile_modal_comment"
                  />
                  <h4>{publiRan?.user.userName}</h4>
                  <p>{publiRan?.description}</p>
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

export default PubliRandom;
