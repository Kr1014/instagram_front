import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import OneReel from "../components/ReelsPage/oneReel";
import "./css/reelPage.css";

const ReelsPage = () => {
  const [reel, getReel] = useFetch();

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/reels";
    getReel(url, getToken());
  }, []);

  return (
    <>
      <div className="container_reels">
        {reel?.map((reelOne) => (
          <OneReel key={reelOne?.id} reels={reelOne} />
        ))}
      </div>
    </>
  );
};

export default ReelsPage;
