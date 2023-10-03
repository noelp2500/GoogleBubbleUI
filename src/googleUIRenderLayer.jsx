import React, { useState } from "react";
import { googleUIdata } from "./data1";

const GoogleUIRenderLayer = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const ITEMS_PER_PAGE = 10;
  const handleLoadMore = () => {
    setStartIndex(startIndex + ITEMS_PER_PAGE);
    setEndIndex(endIndex + ITEMS_PER_PAGE);
  };
  const handleGoBack = () => {
    setStartIndex(startIndex - ITEMS_PER_PAGE);
    setEndIndex(endIndex - ITEMS_PER_PAGE);
  };

  return (
    <div>
      {googleUIdata["organic_results"]
        .slice(startIndex, endIndex)
        .map((result, index) => (
          <div key={index}>
            <a href={result.link}>
              {index + startIndex + 1}. {result.title}
            </a>
            <p>{result.snippet}</p>
          </div>
        ))}
      {googleUIdata["organic_results"].length > endIndex && (
        <div>
          {googleUIdata["organic_results"].length > endIndex && (
            <button onClick={handleLoadMore}>Load More</button>
          )}
          {startIndex > 0 && <button onClick={handleGoBack}>Go Back</button>}
        </div>
      )}
    </div>
  );
};

export default GoogleUIRenderLayer;
