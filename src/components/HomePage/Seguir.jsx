import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../LoginPage/UserProvider";
import axios from "axios";
import "./css/seguir.css";
import getToken from "../../utils/getToken";
import { useNavigate } from "react-router-dom";

const Seguir = ({ users }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="container_one_sugerencia">
      <img
        src={users?.photoProfile}
        alt="Foto de perfil"
        className="photo_sugerencia"
        onClick={handleNavigateProfile}
      />
      <h5 className="userName_sugerencia" onClick={handleNavigateProfile}>
        {users?.userName.toLowerCase()}
      </h5>
      <button onClick={handleSeguir}>
        {isFollowing ? "Siguiendo" : "Seguir"}
      </button>
    </div>
  );
};

export default Seguir;
