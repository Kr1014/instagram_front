import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import getToken from "../utils/getToken";
import PubliRandom from "../components/ExplorePage/PubliRandom";
import "./css/explorePage.css";

const ExplorePage = () => {
  const [randomPublicac, getRandomPublicac] = useFetch();

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/publicaciones/explorar";
    getRandomPublicac(url, getToken());
  }, []);

  return (
    <>
      <div className="content_publi_random">
        {randomPublicac?.map((publiRan) => (
          <PubliRandom key={publiRan?.id} publiRan={publiRan} />
        ))}
      </div>
    </>
  );
};

export default ExplorePage;
