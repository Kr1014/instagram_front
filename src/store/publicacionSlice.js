import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // No olvides importar axios
import getToken from "../utils/getToken";

const urlBase = 'http://localhost:8080/api/v1/publicaciones';

const publicacionesSlice = createSlice({
  name: "publicaciones",
  initialState: [],
  reducers: {
    addPublicacion: (state, action) => {
      state.push(action.payload);
    },
    getPublicaciones: (state, action) => action.payload
  },
});

export const { addPublicacion, getPublicaciones } = publicacionesSlice.actions;

export const addPubliThunk = (data) => async (dispatch) => {
  try {
    const response = await axios.post(urlBase, data, getToken());
    dispatch(addPublicacion(response.data));
    console.log("Publicacion creada con exito")
  } catch (err) {
    console.error("Error al crear publicación:", err.response?.data || err.message);
  }
};
export const getPubliThunk = () => (dispatch) =>{
  axios.get(urlBase, getToken())
  .then(res=> dispatch(getPublicaciones(res.data)))
  .catch(err=> console.log(err))
}

export default publicacionesSlice.reducer;
