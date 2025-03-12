import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/oneReel.css";
import {
  BsFillPlayFill,
  BsFillPauseFill,
  BsSave2Fill,
  BsSearch,
} from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsSave2 } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment, FaRegCopy, FaWhatsapp } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import getToken from "../../utils/getToken";
import axios from "axios";
import { UserContext } from "../LoginPage/UserProvider";
import { useNavigate } from "react-router-dom";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { LiaFacebookMessenger } from "react-icons/lia";
import { PiFacebookLogoBold } from "react-icons/pi";
import { VscError } from "react-icons/vsc";

const OneReel = ({ reels }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchUserByShare, setsearchUserByShare] = useState("");
  const [actMeGusta, setActMeGusta] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageSharePubli, setMessageSharePubli] = useState("");
  const [moreOptions, setMoreOptions] = useState(false);
  const [savedPubli, setSavedPubli] = useState();
  const [modalShare, setModalShare] = useState(false);
  const refMessageSharePubli = useRef();
  const [selectUser, setSelectUser] = useState([]);
  const { user } = useContext(UserContext);
  const hasFetched = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const refSearhUserByShare = useRef();
  const moreOptionsRef = useRef();
  const navigate = useNavigate();

  const handleNavigateProfile = () => {
    navigate(`/profile/${reels?.user.id}`);
  };

  useEffect(() => {
    setIsFollowing(false);
    hasFetched.current = false;
    console.log(reels);
  }, [reels]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target)
      ) {
        setMoreOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreOptionsRef]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !reels || hasFetched.current) return;
      hasFetched.current = true;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/seguidores/${user.id}/seguido/${reels?.userId}`,
          getToken()
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error al verificar el seguimiento:", error.message);
      }
    };
    checkIfFollowing();
  }, [reels]);

  useEffect(() => {
    const checkSavedPubli = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${reels?.id}`;
      const response = await axios.get(url, getToken());
      setSavedPubli(response.data);
    };

    checkSavedPubli();
  }, [reels]);

  const handleSendSavePubli = async () => {
    const url = `http://localhost:8080/api/v1/publicacionesGuardadas/${publicac?.id}`;
    const response = await axios.post(url, {}, getToken());
    setSavedPubli((prev) => !prev);
  };

  const handleSeguir = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/seguidores/${reels?.user.id}`,
        {},
        getToken()
      );
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error.message);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (video) observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const checkLike = async () => {
      if (!user || !reels) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/megustas/${user.id}/${reels?.id}`,
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
  }, [user, reels]);

  const handleMeGusta = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/megustas/${reels?.id}`,
        {},
        getToken()
      );
      setActMeGusta((prev) => !prev);
    } catch (e) {
      console.error(`Error al gestionar el "Me gusta": ${e.message}`);
    }
  };

  const handleNavigateOnePublicacion = (publicacionId) => {
    navigate(`/publicacion/${publicacionId}`);
  };

  const handleSendMessageSharePubli = () => {
    const url = "http://localhost:8080/api/v1/mensajes";
    selectUser.map((userId) =>
      useSend(
        url,
        {
          texto: messageSharePubli,
          contentMultimedia: publicac?.contentUrl,
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

  return (
    <div className="container_one_reel">
      <video
        ref={videoRef}
        src={reels?.contentUrl}
        className="videoReel"
        muted={isMuted}
        loop
      ></video>
      <button className="play_pause_btn" onClick={togglePlay}>
        {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
      </button>
      <button className="mute_btn" onClick={toggleMute}>
        {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
      </button>
      <div className="container_user_reel_profile">
        <img
          src={reels?.user.photoProfile}
          alt=""
          className="img_user_reel_profile"
          onClick={handleNavigateProfile}
        />
        <h4 onClick={handleNavigateProfile}>
          {reels?.user.userName.toLowerCase()}
        </h4>
        <div className="container_button_one_user_reels">
          {isFollowing ? (
            <button className="button_reel_siguiendo" onClick={handleSeguir}>
              Siguiendo
            </button>
          ) : (
            <button onClick={handleSeguir} className="button_reel_seguir">
              Seguir
            </button>
          )}
        </div>
        {reels?.description !== null && (
          <div className="container_descriptionPubli_reels">
            <h4>{reels.description}</h4>
          </div>
        )}
      </div>

      <div className="container_buttons_reels">
        <div className="container_title_and_icon">
          {actMeGusta ? (
            <IoMdHeart
              className="button_like_reel button_likeAct_reels"
              onClick={handleMeGusta}
            />
          ) : (
            <IoMdHeartEmpty
              className="button_like_reel"
              onClick={handleMeGusta}
            />
          )}
          <h5>Me gusta</h5>
        </div>
        <div className="container_title_and_icon">
          <FaRegComment className="button_reels" />
          <h5>{reels?.comentarios.length}</h5>
        </div>
        <div className="container_title_and_icon">
          <FiSend
            className="button_reels"
            onClick={() => setModalShare(true)}
          />
        </div>
        {modalShare && (
          <div className="container_modal_share">
            <div className="content_modal_share">
              <VscError
                onClick={() => setModalShare(false)}
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
        <div className="container_title_and_icon">
          {savedPubli ? (
            <BsSave2Fill
              className="button_save_onePubli_reels"
              onClick={handleSendSavePubli}
            />
          ) : (
            <BsSave2
              className="button_save_onePubli_reels"
              onClick={handleSendSavePubli}
            />
          )}
        </div>
        <div className="container_title_and_icon">
          <SlOptions
            className="button_reels_options"
            onClick={() => setMoreOptions((prev) => !prev)}
          />
        </div>
        {moreOptions && (
          <div className="container_modalMoreOptions_reels">
            <div
              className="content_modalMoreOptions_reels"
              ref={moreOptionsRef}
            >
              <div className="container_button_giveUp">
                <button className="button_giveUp">Denunciar</button>
              </div>
              <div>
                {" "}
                {isFollowing ? (
                  <button
                    className="button_unfollow_oneReel"
                    onClick={handleSeguir}
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    className="button_follow_oneReel"
                    onClick={handleSeguir}
                  >
                    Seguir
                  </button>
                )}
              </div>
              <div>
                <button onClick={() => handleNavigateOnePublicacion(reels.id)}>
                  Ir a la publicacion
                </button>
              </div>
              <div>
                {" "}
                <button>Compartir en</button>
              </div>
              <div>
                <button>Copiar enlace</button>
              </div>
              <div>
                <button>Codigo de insercion</button>
              </div>
              <div>
                <button>Informacion de esta cuenta</button>
              </div>
              {/* <div>
                <button onClick={() => setMoreOptions((prev) => !prev)}>
                  Cancelar
                </button>
              </div> */}
            </div>
          </div>
        )}
        <div className="container_title_and_icon">
          <img
            src={reels?.user.photoProfile}
            alt=""
            className="img_user_reel"
          />
        </div>
      </div>
    </div>
  );
};

export default OneReel;
