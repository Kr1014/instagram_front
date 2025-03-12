import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerData = async (url, data) => {
    try {
      await axios.post(url, data);
      setError(false);
      navigate("/");
      console.log("Datos ingresados con exito");
    } catch (e) {
      console.log(e);
    }
  };

  return [error, registerData];
};

export default useRegister;
