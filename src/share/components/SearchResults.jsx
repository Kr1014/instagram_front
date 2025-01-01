import React from "react";
import "./css/searResults.css";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ users }) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(`/profile/${users?.id}`);
  };

  return (
    <>
      <div className="container_one_result" onClick={handleProfile}>
        <img src={users?.photoProfile} alt="" className="image_user_search" />
        <div className="names_user_search">
          <h4>{users?.userName.toLowerCase()}</h4>
          <h5>
            {users?.firstName} {users?.lastName}
          </h5>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
