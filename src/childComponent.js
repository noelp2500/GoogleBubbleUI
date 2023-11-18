import React, { useState, useEffect } from "react";

export default function ChildComponent({ data, setClick, key, fullData }) {
  const [clickCount, setClickCount] = useState(0);

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
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 300);
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
