import axios from "axios";
import getToken from "../utils/getToken";

export const fetchLoggedUser = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/users/me",
      getToken()
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
};

export default fetchLoggedUser;
