import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaInstagram } from "react-icons/fa6";
import "./css/loginPage.css";

const LoginPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const submit = async (data) => {
    const url = "http://localhost:8080/api/v1/users/login";
    try {
      await useAuth(url, data);
      navigate("/home");
    } catch (err) {
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
        <div className="containerModal_loginPage">
          <div className="contentModal_loginPage">
            <p>{modalMessage}</p>
            <button onClick={() => setModalVisible(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
