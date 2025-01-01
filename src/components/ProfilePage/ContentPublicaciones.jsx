import React from "react";
import "./css/contentPublicaciones.css";

const ContentPublicaciones = ({ imgUse }) => {
  return (
    <div>
      <img src={imgUse?.image} alt="" className="image_publicac" />
    </div>
  );
};

export default ContentPublicaciones;
