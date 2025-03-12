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

  const groupPublications = (publications) => {
    const grouped = [];
    for (let i = 0; i < publications?.length; i += 5) {
      grouped.push(publications.slice(i, i + 5));
    }
    return grouped;
  };

  const groupedPublications = groupPublications(randomPublicac);

  return (
    <div className="explore-page">
      {groupedPublications?.map((group, groupIndex) => {
        const isReversed = groupIndex % 2 !== 0;
        const adjustedGroup = isReversed ? [...group].reverse() : group;

        const videos = adjustedGroup.filter(
          (publi) =>
            publi.contentUrl.endsWith(".mp4") ||
            publi.contentUrl.endsWith(".webm")
        );

        let largeVideoId = null;
        if (videos.length > 0) {
          const largeVideoIndex = groupIndex % 2 === 0 ? 2 : 0;
          if (
            adjustedGroup[largeVideoIndex]?.contentUrl.endsWith(".mp4") ||
            adjustedGroup[largeVideoIndex]?.contentUrl.endsWith(".webm")
          ) {
            largeVideoId = adjustedGroup[largeVideoIndex].id;
          } else {
            largeVideoId = videos[0]?.id;
          }
        }

        return (
          <div key={groupIndex} className="publication-group">
            {adjustedGroup.map((publiRan) => (
              <PubliRandom
                key={publiRan?.id}
                publiRan={publiRan}
                isLarge={publiRan?.id === largeVideoId}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ExplorePage;
