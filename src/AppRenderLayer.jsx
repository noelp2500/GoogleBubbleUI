import React, { useEffect, useState } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import ChildComponent from "./childComponent";
// import { Audio } from "react-loader-spinner";
import "./styles.css";
import GoogleUIRenderLayer from "./googleUIRenderLayer";
import Draggable from "react-draggable";

// function containsWord(array, word) {
//   //console.log("4",array,word)
//   const lowercaseWord = word.toLowerCase();
//   for (const element of array) {
//     const words = element.toLowerCase().split(/\s+/);
//     if (words.includes(lowercaseWord)) {
//       return true;
//     }
//   }
//   return false;
// }

function containsWord(array, pattern) {
  const regex = new RegExp(pattern, "i");
  for (const element of array) {
    if (regex.test(element)) {
      return true;
    }
  }
  return false;
}

const AppRenderLayer = ({ data }) => {
  const [load, setLoad] = useState("level1");
  const [keywordData, setKeywordData] = useState(data);
  const [keywordBasedData, setKeywordBasedData] = useState();
  const [back, setBack] = useState(false);
  const [keyInput, setKeyInput] = useState();
  const [keywordSelected, setKeywordSelected] = useState();
  const [googleOrBubble, setGoogleOrBubble] = useState(true);
  const [websiteSelected, setWebsiteSelected] = useState();

  const websiteCleaningRegex = /https:\/\/([^/]+)/g;

  const handleLevelOne = (bub) => {
    if (bub) {
      setKeywordSelected(bub);
      data[bub].map((websites) => {
        const matches = websites["link"].toString().match(websiteCleaningRegex);
        if (matches) {
          const words = matches.map((match) => {
            const [, word] = match.match(/https:\/\/([^/]+)/);
            return word;
          });
          websites["link"] = words;
        }
        return websites;
      });
      setKeywordBasedData(data[bub]);
      setLoad("level2");
      setBack(true);
    }
  };

  const handleLevelTwo = (bub) => {
    //console.log("bub,", bub);
    if (bub) {
      const summaryInfoOfWebsite = keywordBasedData.filter(
        (item) => item["title"].includes(bub) || item["domain"].includes(bub)
      );
      setWebsiteSelected(summaryInfoOfWebsite);
      setLoad("level3");
      setBack(true);
    }
  };

  const handleBackButtonOperation = (event) => {
    event.preventDefault();
    if (load === "level2") {
      setBack(true);
      //console.log("level1Transfer");
      setLoad("level1");
    }
    if (load === "level3") {
      //console.log("level2Transfer");
      setLoad("level2");
    }
    if (load === "level1") {
      //console.log("Nrom");
      setBack(false);
    }
  };

  const options = {
    size: load === "level1" ? 100 : load === "level2" ? 250 : 600,
    minSize: 50,
    gutter: 18,
    provideProps: true,
    numCols: 14,
    fringeWidth: 45,
    cornerRadius: 50,
    showGuides: false,
    compact: false,
    gravitation: 5,
  };

  const handleSearch = (val) => {
    const filteredResults = {};
    setTimeout(() => {
      setKeyInput(val);
    }, 100);

    if (load === "level1") {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key.toString() !== "None") {
            const filteredItems = data[key].filter(
              (item) =>
                item["snippet"].includes(val) ||
                item["title"].includes(val) ||
                item["link"].includes(val) ||
                item["WebsiteContentSummary"].includes(val)
            );
            if (filteredItems.length > 0) {
              filteredResults[key] = filteredItems;
            }
          }
        }
      }
      setKeywordData(filteredResults);
    } else {
      // //console.log("val", val);
      // let summaryResultArray=[]
      //console.log("_________________________");
      const summaryResultArray = data[keywordSelected].filter((summaryData) => {
        return containsWord(summaryData["WebsiteContentSummary"], val);
      });
      // const filteredItems = data[keywordSelected].filter(
      //   (item) =>
      //     item["snippet"].includes(val) ||
      //     item["title"].includes(val) ||
      //     item["link"].includes(val) ||
      //     item["WebsiteContentSummary"].includes(val)
      // );
      // if (filteredItems.length > 0) {
      //   filteredResults[keywordSelected] = filteredItems;
      // }
      // //console.log("filt",summaryResultArray)
      setKeywordBasedData(summaryResultArray);
    }
  };

  useEffect(() => {
    setLoad("level1");
  }, []);

  const handleUISwitch = () => {
    setGoogleOrBubble(!googleOrBubble);
  };

  // const handleDrag = (e, ui) => {
  //   // Handle dragging logic here if needed
  // };

  return (
    <>
      <button onClick={handleUISwitch}>
        TOGGLE TO {googleOrBubble ? "GOOGLE NORMAL UI" : "PROPOSED BUBBLE UI"}
      </button>
      {!googleOrBubble && (
        <>
          <GoogleUIRenderLayer data={data}></GoogleUIRenderLayer>
        </>
      )}
      {googleOrBubble && (
        <>
          {load === "level2" || load === "level1" ? (
            <input
              type="text"
              placeholder="Search..."
              value={keyInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          ) : (
            <></>
          )}
          {load === "level2" || load === "level3" ? (
            <button onClick={handleBackButtonOperation}>BACK</button>
          ) : (
            <></>
          )}

          <Draggable
            defaultPosition={{ x: 0, y: 0 }}
            grid={[1, 1]}
            //onStop={handleDrag}
          >
            <BubbleUI options={options} className="myBubbleUI">
              {load === "level2"
                ? Object.values(keywordBasedData)?.map((keywordResult, i) => (
                    <ChildComponent
                      data={keywordResult["link"]}
                      className="child"
                      key={i}
                      setClick={handleLevelTwo}
                    />
                  ))
                : load === "level3"
                ? Object.values(websiteSelected)?.map((keywordResult, i) => (
                    <ChildComponent
                      data={keywordResult["WebsiteContentSummary"]}
                      className="child"
                      key={i}
                      setClick={() => {}}
                    />
                  ))
                : load === "level1" &&
                  Object.keys(keywordData)?.map(
                    (keyword, i) =>
                      keywordData[keyword].length > 0 && (
                        <ChildComponent
                          data={keyword}
                          fullData={keywordData[keyword]}
                          className="child"
                          key={i}
                          setClick={handleLevelOne}
                        />
                      )
                  )}
            </BubbleUI>
          </Draggable>
          {/* {load && (
        <>
          <div>Clicked bubble: {bubble}</div>
          <Audio
            height={80}
            width={80}
            radius={9}
            color="green"
            ariaLabel="loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </>
      )} */}
        </>
      )}
    </>
  );
};

export default AppRenderLayer;
