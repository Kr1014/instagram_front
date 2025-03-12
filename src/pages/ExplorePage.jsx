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

  // Función para dividir las publicaciones en grupos de 5
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

        // Encontrar los videos en el grupo
        const videos = adjustedGroup.filter(
          (publi) =>
            publi.contentUrl.endsWith(".mp4") ||
            publi.contentUrl.endsWith(".webm")
        );

        // Seleccionar un único video para ser grande (si hay videos)
        let largeVideoId = null;
        if (videos.length > 0) {
          // Posición del video grande en cada bloque
          const largeVideoIndex = groupIndex % 2 === 0 ? 2 : 0;
          if (
            adjustedGroup[largeVideoIndex]?.contentUrl.endsWith(".mp4") ||
            adjustedGroup[largeVideoIndex]?.contentUrl.endsWith(".webm")
          ) {
            largeVideoId = adjustedGroup[largeVideoIndex].id;
          } else {
            largeVideoId = videos[0]?.id; // Si no está en la posición esperada, usa el primer video disponible
          }
        }

        return (
          <div key={groupIndex} className="publication-group">
            {adjustedGroup.map((publiRan) => (
              <PubliRandom
                key={publiRan?.id}
                publiRan={publiRan}
                isLarge={publiRan?.id === largeVideoId} // Solo este video será grande
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ExplorePage;
