import React from "react";
import "./css/contentPublicaciones.css";

const ContentPublicaciones = ({ publicProfile }) => {
  return (
    <>
      <div>
        {publicProfile?.contentUrl.endsWith(".mp4") ||
        publicProfile?.contentUrl.endsWith(".webm") ? (
          <video className="video_publicac_profile">
            <source src={publicProfile.contentUrl} />
          </video>
        ) : (
          <img
            src={publicProfile.contentUrl}
            alt=""
            className="image_publicac_profile"
          />
        )}
      </div>
    </>
  );
};

export default ContentPublicaciones;
