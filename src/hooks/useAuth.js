import axios from "axios";

const useAuth = async (url, data, key = {}) => {
  try {
    const res = await axios.post(url, data, key);
    console.log('Inicio de sesión con éxito');
    if ('token' in res.data) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data; 
  } catch (err) {
    console.error('Error al iniciar sesión:', err.response ? err.response.data : err.message);
    throw err;
  }
};

export default useAuth