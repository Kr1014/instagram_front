import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import "./css/profile.css";
import { UserContext } from "../components/LoginPage/UserProvider";
import axios from "axios";
import { CgLayoutGridSmall } from "react-icons/cg";
import { FaClipboardUser } from "react-icons/fa6";
import { BsSave2 } from "react-icons/bs";
import ContentPublicaciones from "../components/ProfilePage/ContentPublicaciones";
import ContentPublicacionesGuardadas from "../components/ProfilePage/ContentPublicacionesGuardadas";

const ProfilePage = () => {
  const params = useParams();
  const [oneUser, getOneUser] = useFetch();
  const [isFollowing, setIsFollowing] = useState(false);
  const [publiSaved, setPubliSaved] = useState([]);
  const [showTypeContent, setShowTypeContent] = useState("publicaciones");
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
    const getPubliSaved = async () => {
      const url = `http://localhost:8080/api/v1/publicacionesGuardadas`;
      const response = await axios.get(url, getToken());
      setPubliSaved(response.data);
    };
    getPubliSaved();
  }, []);

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

  const handleCloseComment = () => {
    setModalComment(false);
  };

  return (
    <div className="container_one_user">
      <div className="container_one_user_data_all">
        <img src={oneUser?.photoProfile} alt="" className="image_one_user" />
        <div className="container_one_user_data">
          <div className="container_one_user_names">
            <h3 className="text_userName">{oneUser?.userName.toLowerCase()}</h3>
            {oneUser?.id == user.id ? (
              <div>
                <button>Editar perfil</button>
                <button>Ver archivo</button>
              </div>
            ) : (
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
                <button className="send_message">Enviar mensaje</button>
              </div>
            )}
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
          <div
            className="title"
            onClick={() => setShowTypeContent("publicaciones")}
          >
            <CgLayoutGridSmall />
            <h5>PUBLICACIONES</h5>
          </div>
          {oneUser?.id == user.id && (
            <div
              className="title"
              onClick={() => setShowTypeContent("guardadas")}
            >
              <BsSave2 />
              <h5>GUARDADAS</h5>
            </div>
          )}
          <div className="title">
            <FaClipboardUser />
            <h5>ETIQUETADAS</h5>
          </div>
        </div>
        {showTypeContent == "publicaciones" && (
          <div className="container_publicaciones">
            {oneUser?.publicacions.map((publicProfile) => (
              <ContentPublicaciones
                key={publicProfile?.id}
                publicProfile={publicProfile}
              />
            ))}
          </div>
        )}
        {showTypeContent == "guardadas" && (
          <div className="container_publicaciones_guardadas">
            {publiSaved.map((savePubli) => (
              <ContentPublicacionesGuardadas
                key={savePubli.publicacionId}
                savePubli={savePubli}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
