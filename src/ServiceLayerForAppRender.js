import React, { useEffect, useState } from "react";
import { imptData } from "./dataWithSummary";
import AppRenderLayer from "./AppRenderLayer";
import { Audio } from "react-loader-spinner";

export default function ServiceLayerForAppRender() {
  const [fulldata, setFulldata] = useState();

  // A function to process the data and return the final result
  const serviceLayerFunction = ({ imptData }) => {
    const result = { None: [] };
    imptData["organic_results"].forEach((data) => {
      if (Array.isArray(data.AIGeneratedKeywords)) {
        data.AIGeneratedKeywords = [data.AIGeneratedKeywords[0]];
        data.AIGeneratedKeywords.forEach((keyword) => {
          if (keyword.replace(/'/g, "") in result) {
            result[keyword.replace(/'/g, "")].push(data);
          } else {
            result[keyword.replace(/'/g, "")] = [data];
          }
        });
      } else {
        result["None"].push(data);
      }
    });
    return result;
  };

  useEffect(() => {
    setTimeout(setFulldata(serviceLayerFunction({ imptData })), 600000);
  }, []);

  return (
    <>
      {fulldata ? (
        <AppRenderLayer data={fulldata}></AppRenderLayer>
      ) : (
        <Audio
          height={80}
          width={80}
          radius={9}
          color="green"
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </>
  );
}
