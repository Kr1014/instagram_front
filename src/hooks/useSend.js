import axios from "axios";

const useSend = async (url, data, key) => {
  try {
    const res = await axios.post(url, data, key);
    console.log("Respuesta del backend:", res.data);
    return res.data;
  } catch (e) {
    console.log("Error en la solicitud:", e);
    return null;
  }
};

export default useSend;
