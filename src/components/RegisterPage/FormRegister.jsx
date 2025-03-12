import React from "react";
import { useForm } from "react-hook-form";
import useRegister from "../../hooks/useRegister";
import "./css/formRegister.css";
import { useNavigate } from "react-router-dom";

const FormRegister = () => {
  const { handleSubmit, register, reset } = useForm();
  const [error, registerUser] = useRegister();

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const submit = (data) => {
    const url = "http://localhost:8080/api/v1/users";
    registerUser(url, data),
      reset({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        photoProfile: "",
      });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="container_form_register">
      {/* <label htmlFor="firstName">First name</label> */}
      <input
        type="text"
        {...register("firstName")}
        className="input_register"
        placeholder="First Name"
      />

      <input
        type="text"
        {...register("lastName")}
        className="input_register"
        placeholder="Last Name"
      />

      <input
        type="text"
        {...register("userName")}
        className="input_register"
        placeholder="User Name"
      />
      <label htmlFor="photoProfile" className="label_photoProfile_register">
        Photo profile
      </label>
      <input
        type="file"
        {...register("photoProfile")}
        className="input_photoProfile_register"
      />

      <input
        type="email"
        {...register("email")}
        className="input_register"
        placeholder="Email"
      />

      <input
        type="password"
        {...register("password")}
        className="input_register"
        placeholder="Password"
      />
      <div className="container_laws_ofApplication_fromRegister">
        <p>
          Es posible que los usuarios de nuestro servicio hayan subido tu
          información de contacto en Instagram.{" "}
          <a
            href="https://www.facebook.com/help/instagram/261704639352628"
            target="_blank"
          >
            <span>Más información</span>
          </a>
        </p>
        <p>
          Al registrarte, aceptas nuestras{" "}
          <a
            href="https://help.instagram.com/581066165581870/?locale=es_ES"
            target="_blank"
          >
            <span>Condiciones</span>
          </a>
          , nuestra{" "}
          <a href="https://www.facebook.com/privacy/policy" target="_blank">
            <span>Política de privacidad</span>{" "}
          </a>
          y nuestra{" "}
          <a
            href="https://privacycenter.instagram.com/policies/cookies/"
            target="_blank"
          >
            <span>Política de cookies</span>
          </a>
          .
        </p>
      </div>
      <button className="button_register" onClick={handleNavigate}>
        Register
      </button>
    </form>
  );
};

export default FormRegister;
