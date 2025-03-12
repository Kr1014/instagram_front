import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPubliThunk } from "../../store/publicacionSlice";
import "./css/crearPublicacion.css";
import { VscError } from "react-icons/vsc";
import { IoArrowBack } from "react-icons/io5";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

const CrearPublicacion = ({ setShowCreate, showCreate }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ contentUrl: "", description: "" });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);

      setFormData({ ...formData, contentUrl: file });
    }
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.contentUrl) {
      alert("Debes seleccionar un archivo.");
      return;
    }

    const data = new FormData();
    data.append("contentUrl", formData.contentUrl);
    data.append("description", formData.description.trim());

    dispatch(addPubliThunk(data));
    navigate("/home");
    setShowCreate(false);
    setFormData({ contentUrl: "", description: "" });
    setImagePreview(null);
  };

  return (
    <>
      {showCreate && (
        <div className="container_createPublic">
          <div className="content_createPublic">
            <div className="container_title_createPublicacion">
              <h2>Crear nueva publicación</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="step_1">
                  {!imagePreview ? (
                    <div className="container_form_createPublic">
                      <LiaPhotoVideoSolid className="icon_upImagesOrVideos_createPublicacion" />
                      <h3>Selecciona las fotos y los videos aquí</h3>
                      <label htmlFor="contentUrl" className="label_inputFile">
                        Seleccionar del navegador
                      </label>
                    </div>
                  ) : (
                    <div className="image_preview_container">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="image_preview"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    id="contentUrl"
                    className="input_createPublicacion"
                    name="image"
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <div className="containerButtons_backButton_nextButton">
                      <button
                        className="back_button"
                        onClick={() => setImagePreview(null)}
                      >
                        <IoArrowBack /> <h4>Volver atras</h4>
                      </button>
                      <button className="next_button" onClick={handleNextStep}>
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="step_2">
                  <textarea
                    name="description"
                    placeholder="Agrega una descripción..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="textarea_description"
                  />
                  <div className="containerButtons_buttonSubmit_and_buttonBackButton">
                    <button className="back_button" onClick={() => setStep(1)}>
                      <IoArrowBack /> <h4>Volver atrás</h4>
                    </button>
                    <button type="submit" className="submit_button">
                      Publicar
                    </button>
                  </div>
                </div>
              )}

              <button
                className="button_exitCreatePublicacion"
                onClick={() => setShowCreate(false)}
              >
                <VscError />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CrearPublicacion;
