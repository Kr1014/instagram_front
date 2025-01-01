import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import "./css/profile.css";
import { UserContext } from "../components/LoginPage/UserProvider";
import axios from "axios";
import { CgLayoutGridSmall } from "react-icons/cg";
import { FaClipboardUser } from "react-icons/fa6";
import ContentPublicaciones from "../components/ProfilePage/ContentPublicaciones";

const ProfilePage = () => {
  const params = useParams();
  const [oneUser, getOneUser] = useFetch();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showContent, setShowContent] = useState("publicaciones");
  const { user } = useContext(UserContext);
  const hasFetched = useRef(false);

  useEffect(() => {
    const url = `http://localhost:8080/api/v1/users/${params.id}`;
    getOneUser(url, getToken());
  }, [params]);

  useEffect(() => {
    setIsFollowing(false);
    hasFetched.current = false;
  }, [params.id]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !oneUser || hasFetched.current) return;
      hasFetched.current = true;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/seguidores/${user.id}/seguido/${oneUser.id}`,
          getToken()
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error al verificar el seguimiento:", error.message);
      }
    };
    checkIfFollowing();
  }, [user, oneUser]);

  const handleSeguir = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/seguidores/${oneUser?.id}`,
        {},
        getToken()
      );
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error.message);
    }
  };

  return (
    <div className="container_one_user">
      <div className="container_one_user_data_all">
        <img src={oneUser?.photoProfile} alt="" className="image_one_user" />
        <div className="container_one_user_data">
          <div className="container_one_user_names">
            <h3 className="text_userName">{oneUser?.userName.toLowerCase()}</h3>
            <div className="container_buttons_one_user">
              {isFollowing ? (
                <button className="button_follow button_siguiendo">
                  Siguiendo
                </button>
              ) : (
                <button
                  onClick={handleSeguir}
                  className="button_follow button_seguir"
                >
                  Seguir
                </button>
              )}
            </div>

            <button className="send_message">Enviar mensaje</button>
          </div>
          <div className="container_one_user_numbers">
            <h4>{oneUser?.publicacions?.length || 0} publicaciones</h4>
            <h4>{oneUser?.seguidores?.length || 0} seguidores</h4>
            <h4>{oneUser?.seguidos?.length || 0} seguidos</h4>
          </div>
          <h5 className="container_one_user_firstName">
            {oneUser?.firstName} {oneUser?.lastName}
            <br />
          </h5>
        </div>
      </div>
      <div className="container_content_one_user">
        <div className="border_one_user"></div>
        <div className="titles_content_one_user">
          <div className="title">
            <CgLayoutGridSmall />
            <h5>PUBLICACIONES</h5>
          </div>
          <div className="title">
            <FaClipboardUser />
            <h5>ETIQUETADAS</h5>
          </div>
        </div>
        <div className="container_publicaciones">
          {oneUser?.publicacions.map((imgUse) => (
            <ContentPublicaciones key={imgUse.id} imgUse={imgUse} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
