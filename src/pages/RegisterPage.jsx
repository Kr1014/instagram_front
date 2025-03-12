import React from "react";
import FormRegister from "../components/RegisterPage/FormRegister";
import { PiFacebookLogoBold } from "react-icons/pi";
import "./css/registerPage.css";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <div className="container_registerPage">
        <div className="content_registerPage">
          <div className="container_titleAndSubtitles_registerPage">
            <h1>Instagram</h1>
            <h3>Regístrate para ver fotos y vídeos de tus amigos</h3>
            <button className="button_loguearWithFacebook">
              <PiFacebookLogoBold className="iconFacebook_register" />{" "}
              <h4>Inicia sesion con Facebook</h4>
            </button>
            <div>
              <div></div>
              <h3>o</h3>
              <div></div>
            </div>
          </div>
          <div>
            <FormRegister />
          </div>
        </div>
        <div className="container_toGo_LoginFromRegister">
          <h4>
            Do you have an account?{" "}
            <Link className="toGo_LoginFromRegister" to={"/"}>
              Login
            </Link>
          </h4>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
