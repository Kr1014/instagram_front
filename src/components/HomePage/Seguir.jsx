import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../LoginPage/UserProvider";
import axios from "axios";
import "./css/seguir.css";
import getToken from "../../utils/getToken";
import { useNavigate } from "react-router-dom";
import { IoCameraOutline } from "react-icons/io5";
import { LiaFacebookMessenger } from "react-icons/lia";
import { FiUserPlus } from "react-icons/fi";

const Seguir = ({ users }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllUsersFollowed, setShowAlllUsersFollowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShowProfileOneUser, setModalShowProfileOneUser] = useState(null);
  const hasFetched = useRef(false);

  const handleNavigateProfile = () => {
    navigate(`/profile/${users?.id}`);
  };

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !users || hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/v1/seguidores/${user.id}/seguido/${users.id}`,
          getToken()
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error al verificar el seguimiento:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkIfFollowing();
  }, [user, users]);

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

  const handleSeguir = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/seguidores/${users?.id}`,
        {},
        getToken()
      );
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error.message);
    }
  };

  if (loading) {
    return <button disabled>Cargando...</button>;
  }

  const handleNavigateProfileOneUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container_one_sugerencia">
      <img
        src={users?.photoProfile}
        alt="Foto de perfil"
        className="photo_sugerencia"
        onClick={handleNavigateProfile}
        onMouseEnter={() => setModalShowProfileOneUser(users?.id)}
        onMouseLeave={() => setModalShowProfileOneUser(null)}
      />
      <h5
        className="userName_sugerencia"
        onClick={handleNavigateProfile}
        onMouseEnter={() => setModalShowProfileOneUser(users?.id)}
        onMouseLeave={() => setModalShowProfileOneUser(null)}
      >
        {users?.userName.toLowerCase()}
      </h5>
      {modalShowProfileOneUser === users?.id && (
        <div
          className="container_modal_modalShowProfileOneUser_publiMainPhoto"
          onMouseEnter={() => setModalShowProfileOneUser(users?.id)}
          onMouseLeave={() => setModalShowProfileOneUser(null)}
        >
          <div className="container_photoProfile_names_userName_modalShowProfileOneUser">
            <img
              src={users?.photoProfile}
              alt="imgUser_modal_show_ProfileOneUser"
              className="imgUser_modal_show_ProfileOneUser"
              onClick={() => handleNavigateProfileOneUser(users?.id)}
            />
            <div className="container_names_userName_modalShowProfileOneUser">
              <h4
                onClick={() => handleNavigateProfileOneUser(users?.id)}
                className="name_modalShowProfileOneUser"
              >
                {users?.userName}
              </h4>
              <h4 className="userName_modalShowProfileOneUser">
                {users?.firstName} {users?.lastName}
              </h4>
            </div>
          </div>

          <div className="container_dates_modalShowProfileOneUser">
            <div className="container_numberions_modalShowProfileOneUser">
              <h5>{users?.publicacions.length}</h5>
              <h4>iones</h4>
            </div>
            <div className="container_numberFollowers_modalShowProfileOneUser">
              <h5>{users?.seguidores.length}</h5>
              <h4>Seguidores</h4>
            </div>
            <div className="container_numberFollowed_modalShowProfileOneUser">
              <h5>{users?.seguidos.length}</h5>
              <h4>Seguidos</h4>
            </div>
          </div>
          <div>
            {users.publicacions.length > 0 ? (
              <div className="container_Allions_modalShowProfileOneUser">
                {users?.publicacions.slice(0, 3).map((publicsOneUser) => (
                  <div className="container_ions_modalShowProfileOneUser">
                    {publicsOneUser.contentUrl.endsWith(".mp4") ||
                    publicsOneUser.contentUrl.endsWith(".webm") ? (
                      <div
                        className="container_video_modalShowProfileOneUser"
                        onClick={() => handleNavigateOneion(publicsOneUser.id)}
                      >
                        <video className="contentVideo__modalShowProfileOneUser">
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
                          className="img__modalShowProfileOneUser"
                          onClick={() =>
                            handleNavigateOneion(publicsOneUser.id)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="container_thereIsNot_ions_modalShowProfileOneUser">
                <div className="circle_camera_thereIsNot_ions_modalShowProfileOneUser"></div>
                <IoCameraOutline className="cameraLogo_thereIsNot_ions_modalShowProfileOneUser" />
                <h3>Aun no hay publicaciones</h3>
                <p>
                  Cuando {users?.userName} comparta fotos y reels, los verás
                  aquí
                </p>
              </div>
            )}
          </div>
          <div>
            {showAllUsersFollowed.some(
              (userSeguid) => userSeguid.id === users?.id
            ) ? (
              <div className="container_sendMessageAndButtonSeguir_modalShowProfileOneUser">
                <div className="container_button_sendMessage_modalShowProfileOneUser">
                  <LiaFacebookMessenger className="icon_messenger_button_sendMessage_modalShowProfileOneUser" />
                  <button className="button_sendMessage_modalShowProfileOneUser">
                    Enviar un mensaje
                  </button>
                </div>
                <button className="button_following_modalShowProfileOneUser">
                  Siguiendo
                </button>
              </div>
            ) : (
              <div className="container_buttonFollow_modalShowProfileOneUser">
                <FiUserPlus className="icon_userPlus_modalShowProfileOneUser" />
                <button>Seguir</button>
              </div>
            )}
          </div>
        </div>
      )}
      <button onClick={handleSeguir}>
        {isFollowing ? "Siguiendo" : "Seguir"}
      </button>
    </div>
  );
};

export default Seguir;
