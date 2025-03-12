import React, { useContext, useState } from "react";
import Seguir from "../components/HomePage/Seguir";
import "./css/homePage.css";
import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/LoginPage/UserProvider";
import Publicaciones from "../components/HomePage/Publicaciones";
import { useDispatch, useSelector } from "react-redux";
import { getPubliThunk } from "../store/publicacionSlice";
import { NofiticationContext } from "../components/HomePage/ShowNotificationSend";

const HomePage = () => {
  const [allUsers, getAllUsers] = useFetch();

  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const { notificationSend } = useContext(NofiticationContext);
  const publicaciones = useSelector((store) => store.publi);
  const dispatch = useDispatch();

  const handleProfile = () => {
    navigate(`/profile/${user?.id}`);
  };

  useEffect(() => {
    dispatch(getPubliThunk());
  }, []);

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/users";
    getAllUsers(url, getToken());
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
    setModalCerrarSesion(false);
  };

  const cbFilter = (userLog) => {
    const byId = user.id !== userLog.id;
    return byId;
  };

  const filterPublica = (publi) => {
    if (!user || !user.seguidos) return false;
    return user.seguidos.some((seg) => seg.id === publi.userId);
  };

  return (
    <>
      <div className="container_all_homePage">
        {user ? (
          <div className="container_half_homePage">
            <div className="sugerencia_profile" onClick={handleProfile}>
              <img
                src={user?.photoProfile}
                alt=""
                className="sugerencia_image_profile"
              />
              <div className="userName_firstName_profile">
                <h4>{user?.userName.toLowerCase()}</h4>
                <h4 className="firstNameAndLastName_profile">{`${user?.firstName} ${user?.lastName}`}</h4>
              </div>
              <button className="button_cambiar">
                <h4 className="buttonChange_profile">Cambiar</h4>
              </button>
            </div>

            <section className="container_all_sugerencias">
              <div className="titles_suggestions_profile">
                <h4>Sugerencias para ti</h4>
                <h4 className="seeAll_sugerencias_profile">Ver todo</h4>
              </div>
              <section className="container_sugerencias">
                {allUsers
                  ?.filter(cbFilter)
                  .slice(0, 5)
                  .map((users) => (
                    <Seguir key={users?.id} users={users} />
                  ))}
              </section>
              <div className="containerButtons_infoInsta_homePage">
                <div className="content_infoInsta_homePage">
                  <div
                    onClick={() =>
                      window.open("https://about.instagram.com/", "_blank")
                    }
                  >
                    <button>Información .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open("https://help.instagram.com/", "_blank")
                    }
                  >
                    <button> Ayuda .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open("https://about.instagram.com/blog/", "_blank")
                    }
                  >
                    <button>Prensa .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://developers.facebook.com/docs/instagram-platform",
                        "_blank"
                      )
                    }
                  >
                    <button>API .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://developers.facebook.com/docs/instagram-platform",
                        "_blank"
                      )
                    }
                  >
                    <button></button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://about.instagram.com/about-us/careers",
                        "_blank"
                      )
                    }
                  >
                    <button>Empleos .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect",
                        "_blank"
                      )
                    }
                  >
                    <button>Privacidad .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://help.instagram.com/581066165581870/",
                        "_blank"
                      )
                    }
                  >
                    <button>Condiciones .</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/explore/locations/",
                        "_blank"
                      )
                    }
                  >
                    <button>Ubicaciones .</button>
                  </div>
                  <div>
                    <button>Idioma</button>
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://accountscenter.instagram.com/meta_verified/17841404272208709/?entrypoint=web_footer#",
                        "_blank"
                      )
                    }
                  >
                    <button>Meta Verified</button>
                  </div>
                </div>
                <div className="container_titleInstaFromMeta">
                  <h4>© 2025 Instagram from Meta</h4>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <h1>Loading....</h1>
        )}
        <div className="container_homePage_publicaciones">
          {publicaciones?.filter(filterPublica).map((publicac) => (
            <Publicaciones key={publicac?.id} publicac={publicac} />
          ))}
        </div>
        {notificationSend && (
          <div className="container_homePage_enviado">
            <h3>Enviado exitosamente</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
