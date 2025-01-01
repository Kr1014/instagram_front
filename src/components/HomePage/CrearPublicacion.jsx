import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPubliThunk } from "../../store/publicacionSlice";

const CrearPublicacion = ({ setShowCreate, showCreate }) => {
  // const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ image: "", description: "" });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      image: formData.image.trim(),
      description: formData.description.trim(),
    };

    if (!data.image || !data.description) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    dispatch(addPubliThunk(data));
    setModalVisible(false);
    setFormData({ image: "", description: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {showCreate && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Crear Publicación</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="image">Enlace de la publicación:</label>
                <input
                  type="text"
                  id="image"
                  name="image" // Debe coincidir con la clave en formData
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Comentario:</label>
                <textarea
                  id="description"
                  name="description" // Debe coincidir con la clave en formData
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Escribe un comentario"
                  required
                />
              </div>
              <button type="submit">Subir</button>
              <button type="button" onClick={() => setShowCreate(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Estilos del modal
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
    width: "300px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    position: "fixed",
  },
};

export default CrearPublicacion;
