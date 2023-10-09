import React, { useState, useEffect } from "react";

export default function ChildComponent({ data, setClick, key, fullData }) {
  const [clickCount, setClickCount] = useState(0);
  console.log("fullData", fullData);

  const bubbleStyle = {
    width: `${fullData.length * 25}px`,
    height: `${fullData.length * 25}px`,
    borderRadius: "50%",
    backgroundColor: "blue", // You can change the background color as needed
    cursor: "pointer",
  };

  useEffect(() => {
    if (clickCount === 1) {
      const timer = setTimeout(() => {
        if (clickCount === 1) {
          setClick(null);
        }
        setClickCount(0);
      }, 300);
      return () => clearTimeout(timer);
    } else if (clickCount === 2) {
      setClick(data);
    }
  }, [clickCount]);

  return (
    <div
      key={key}
      className="childComponent"
      onClick={() => {
        setClickCount(clickCount + 1);
      }}
    >
      {data}
    </div>
  );
}
