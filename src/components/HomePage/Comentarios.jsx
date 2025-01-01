import React from "react";
import "./css/comentarios.css";
import { CiHeart } from "react-icons/ci";

const Comentarios = ({ coment }) => {
  if (!coment || !coment.user) {
    return null;
  }

  return (
    <>
      <div className="content_one_comment_all">
        <div className="content_one_comment_userAndComment">
          <img
            src={coment?.user.photoProfile}
            alt=""
            className="img_one_comment"
          />
          <p>{coment?.texto}</p>
          <CiHeart className="heart_comment" />
        </div>
        <div className="container_time_res_comment">
          <h6>Time</h6>
          <button className="button_res">Responder</button>
        </div>
      </div>
    </>
  );
};

export default Comentarios;
