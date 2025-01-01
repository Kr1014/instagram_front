import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { BiSolidVideos } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { GoHeart } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";
import { MdMoreVert } from "react-icons/md";
import "./css/style.css";
import { UserContext } from "../components/LoginPage/UserProvider";
import CrearPublicacion from "../components/HomePage/CrearPublicacion";
import { FaInstagram } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import SearchResults from "./components/SearchResults";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [searchActive, setSearchActive] = useState(false);
  const [messages, setMessages] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [inputSearchUser, setInputSearchUser] = useState("");
  const [allUsersByInput, getAllUsersByInput] = useFetch();
  const searchContainerRef = useRef(null);
  const textInput = useRef(null);

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/users";
    getAllUsersByInput(url, getToken());
  }, []);

  const handleCreate = () => {
    setShowCreate(true);
  };

  const handleMessages = () => {
    setMessages(true);
  };

  const handleSearchToggle = () => {
    setSearchActive((prevState) => !prevState);
  };

  const handleChange = () => {
    setInputSearchUser(textInput.current.value.toLowerCase().trim());
  };

  const cbFilterUser = (users) => {
    const byName = users.firstName.toLowerCase().includes(inputSearchUser);
    return byName;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchActive(false);
      }
    };

    if (searchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchActive]);

  return (
    <>
      {searchActive && (
        <div ref={searchContainerRef} className="container_search_mode">
          {/* Navbar reducido */}

          <div className="container_buttons_search_mode">
            <div>
              <FaInstagram className="logo_insta" />
            </div>
            <Link to={"/home"} className="link_button">
              <button className="button_nav">
                <IoHomeSharp className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav button_busqueda"
              onClick={handleSearchToggle}
            >
              <FaSearch className="icon_nav" />
            </button>
            <Link to={"/explore"} className="link_button">
              <button className="button_nav">
                <MdExplore className="icon_nav" />
              </button>
            </Link>
            <Link to={"/reels"} className="link_button">
              <button className="button_nav">
                <BiSolidVideos className="icon_nav" />
              </button>
            </Link>
            <Link
              to={"/messages"}
              className="link_button"
              onClick={handleMessages}
            >
              <button className="button_nav">
                <TiMessages
                  className="icon_nav"
                  onClick={handleActiveMessage}
                />
              </button>
            </Link>
            <Link to={"/notifications"} className="link_button">
              <button className="button_nav">
                <GoHeart className="icon_nav" />
              </button>
            </Link>
            <button className="button_nav button_crear" onClick={handleCreate}>
              <CiSquarePlus className="icon_nav" />
            </button>
            <Link to={`/profile`} className="link_button">
              <div className="button_nav">
                <img
                  src={user?.photoProfile}
                  alt=""
                  className="photo_nav_profile"
                />
                <button className="button_perfil"></button>
              </div>
            </Link>
            <button className="button_nav">
              <MdMoreVert className="icon_nav" />
            </button>
          </div>
          {showCreate && (
            <CrearPublicacion
              setShowCreate={setShowCreate}
              showCreate={showCreate}
            />
          )}
          {/* Bloque de búsqueda */}
          <div className="search-block">
            <h1>Busqueda</h1>
            <form onChange={handleChange}>
              <input
                ref={textInput}
                type="text"
                className="search-input"
                placeholder="Buscar usuarios..."
              />
            </form>

            {/* <h3>Recientes</h3> */}
            <div className="search-results">
              {allUsersByInput?.filter(cbFilterUser).map((users) => (
                <SearchResults key={users?.id} users={users} />
              ))}
            </div>
          </div>
        </div>
      )}
      {messages && (
        <div className="container_messages_mode">
          <div className="container_buttons_search_mode">
            <div>
              <FaInstagram className="logo_insta" />
            </div>
            <Link to={"/home"} className="link_button">
              <button className="button_nav">
                <IoHomeSharp className="icon_nav" />
              </button>
            </Link>
            <button
              className="button_nav button_busqueda"
              onClick={handleSearchToggle}
            >
              <FaSearch className="icon_nav" />
            </button>
            <Link to={"/explore"} className="link_button">
              <button className="button_nav">
                <MdExplore className="icon_nav" />
              </button>
            </Link>
            <Link to={"/reels"} className="link_button">
              <button className="button_nav">
                <BiSolidVideos className="icon_nav" />
              </button>
            </Link>
            <Link to={"/messages"} className="link_button">
              <button className="button_nav">
                <TiMessages className="icon_nav" />
              </button>
            </Link>
            <Link to={"/notifications"} className="link_button">
              <button className="button_nav">
                <GoHeart className="icon_nav" />
              </button>
            </Link>
            <button className="button_nav button_crear" onClick={handleCreate}>
              <CiSquarePlus className="icon_nav" />
            </button>
            <Link to={`/profile`} className="link_button">
              <div className="button_nav">
                <img
                  src={user?.photoProfile}
                  alt=""
                  className="photo_nav_profile"
                />
                <button className="button_perfil"></button>
              </div>
            </Link>
            <button className="button_nav">
              <MdMoreVert className="icon_nav" />
            </button>
          </div>
        </div>
      )}
      <div className="container_all_navbar">
        {/* Navbar completo */}
        <div className="container_buttons_nav">
          <div className="name_insta">
            <h3>Instagram</h3>
          </div>
          <Link to={"/home"} className="link_button">
            <button className="button_nav">
              <IoHomeSharp className="icon_nav" />
              <h3>Inicio</h3>
            </button>
          </Link>
          <button
            className="button_nav button_busqueda"
            onClick={handleSearchToggle}
          >
            <FaSearch className="icon_nav" />
            <h3>Busqueda</h3>
          </button>
          <Link to={"/explore"} className="link_button">
            <button className="button_nav">
              <MdExplore className="icon_nav" />
              <h3>Explorar</h3>
            </button>
          </Link>
          <Link to={"/reels"} className="link_button">
            <button className="button_nav">
              <BiSolidVideos className="icon_nav" />
              <h3>Reels</h3>
            </button>
          </Link>
          <Link
            to={"/messages"}
            className="link_button"
            onClick={handleMessages}
          >
            <button className="button_nav">
              <TiMessages className="icon_nav" />
              <h3>Mensajes</h3>
            </button>
          </Link>
          <Link to={"/notifications"} className="link_button">
            <button className="button_nav">
              <GoHeart className="icon_nav" />
              <h3>Notificaciones</h3>
            </button>
          </Link>
          <button className="button_nav button_crear" onClick={handleCreate}>
            <CiSquarePlus className="icon_nav" />
            <h3>Crear</h3>
          </button>
          <Link to={`/profile`} className="link_button">
            <div className="button_nav">
              <img
                src={user?.photoProfile}
                alt=""
                className="photo_nav_profile"
              />
              <button className="button_perfil">
                <h3>Perfil</h3>
              </button>
            </div>
          </Link>
          <button className="button_nav">
            <MdMoreVert className="icon_nav" />
            <h3>Mas</h3>
          </button>
          {showCreate && (
            <CrearPublicacion
              setShowCreate={setShowCreate}
              showCreate={showCreate}
            />
          )}
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
