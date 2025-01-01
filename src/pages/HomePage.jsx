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

const HomePage = () => {
  const [allUsers, getAllUsers] = useFetch();
  const [modalCerrarSesion, setModalCerrarSesion] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);

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
    // Verificar si user.seguidos está definido antes de intentar filtrar
    if (!user || !user.seguidos) return false;
    return user.seguidos.some((seg) => seg.id === publi.userId);
  };

  return (
    <>
      <div className="container_all_homePage">
        {user ? (
          <div className="container_half_homePage">
            {/* <button onClick={() => setModalCerrarSesion(true)}>
              Cerrar sesion
            </button> */}
            <div className="sugerencia_profile" onClick={handleProfile}>
              <img
                src={user?.photoProfile}
                alt=""
                className="sugerencia_image_profile"
              />
              <div className="userName_firstName_profile">
                <h5>{user?.userName.toLowerCase()}</h5>
                <h5>{`${user?.firstName} ${user?.lastName}`}</h5>
              </div>
              <button className="button_cambiar">
                <h5>Cambiar</h5>
              </button>
            </div>

            <section className="container_all_sugerencias">
              <h4>Sugerencias para ti</h4>
              <section className="container_sugerencias">
                {allUsers?.filter(cbFilter).map((users) => (
                  <Seguir key={users?.id} users={users} />
                ))}
              </section>
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

        {modalCerrarSesion && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h3>Desea cerrar sesion?</h3>
              <button onClick={() => setModalCerrarSesion(false)}>
                Cancelar
              </button>
              <button onClick={handleCerrarSesion}>Cerrar sesion</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    color: "blue",
  },
};

export default HomePage;
