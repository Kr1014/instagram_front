import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/oneReel.css";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsSave2 } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComments } from "react-icons/fa";
import { TbLocationShare } from "react-icons/tb";
import { SlOptions } from "react-icons/sl";
import getToken from "../../utils/getToken";
import axios from "axios";
import { UserContext } from "../LoginPage/UserProvider";
import { useNavigate } from "react-router-dom";

const OneReel = ({ reels }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useContext(UserContext);
  const hasFetched = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();

  const handleNavigateProfile = () => {
    navigate(`/profile/${reels?.user.id}`);
  };

  useEffect(() => {
    setIsFollowing(false);
    hasFetched.current = false;
  }, [reels]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !reels || hasFetched.current) return;
      hasFetched.current = true;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/seguidores/${user.id}/seguido/${reels?.user.id}`,
          getToken()
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error al verificar el seguimiento:", error.message);
      }
    };
    checkIfFollowing();
  }, [reels, user]);

  console.log(isFollowing);

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

  return (
    <div className="container_one_reel">
      <video
        ref={videoRef}
        src={reels?.videoUrl}
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
      </div>
      <div className="container_buttons_reels">
        <div className="container_title_and_icon">
          <IoMdHeartEmpty className="button_reels" />
          <h5>Me gusta</h5>
        </div>
        <div className="container_title_and_icon">
          <FaRegComments className="button_reels" />
          <h5>4998</h5>
        </div>
        <div className="container_title_and_icon">
          <TbLocationShare className="button_reels" />
        </div>
        <div className="container_title_and_icon">
          <BsSave2 className="button_reels_save" />
        </div>
        <div className="container_title_and_icon">
          <SlOptions className="button_reels_options" />
        </div>
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
