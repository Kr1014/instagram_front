import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaInstagram } from "react-icons/fa6";
import "./css/loginPage.css";

const LoginPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const navigate = useNavigate();

  // Estado para manejar el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const submit = async (data) => {
    const url = "http://localhost:8080/api/v1/users/login";
    try {
      await useAuth(url, data);
      navigate("/home");
    } catch (err) {
      // Mostrar mensaje de error en el modal
      setModalMessage(
        "Credenciales incorrectas. Por favor, inténtalo de nuevo."
      );
      setModalVisible(true);
    }
  };

  return (
    <>
      <div className="container_log">
        <div className="circle circle_1"></div>
        <div className="circle circle_2"></div>
        <div className="title_login">
          <FaInstagram className="logo_instagram" />
          <h2>Instagram</h2>
        </div>

        <form onSubmit={handleSubmit(submit)} className="container_form_log">
          <input
            type="email"
            {...register("email")}
            required
            placeholder="Email"
            className="input_email"
          />
          <br />
          <input
            type="password"
            {...register("password")}
            required
            placeholder="Password"
            className="inp_pass"
          />
          <br />
          <button type="submit" className="button_login">
            Login
          </button>
        </form>

        <div className="container_link_register">
          <h3 className="text_link_register">
            Don't have an account? Register <Link to={"/register"}>Here</Link>
          </h3>
        </div>
      </div>

      {modalVisible && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <p>{modalMessage}</p>
            <button onClick={() => setModalVisible(false)}>OK</button>
          </div>
        </div>
      )}
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

export default LoginPage;
