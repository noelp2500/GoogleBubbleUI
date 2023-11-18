import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

export default function ChildComponent({ data, setClick, key, fullData }) {
  const [clickCount, setClickCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

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

  const onDrag = (e, ui) => {
    setTimeout(() => {
      setPosition({ x: ui.x, y: ui.y });
      // checkCombine(ui.x, ui.y);
    }, 5000);
  };

  return (
    <Draggable onDrag={onDrag}>
      <div
        ref={elementRef}
        style={{ left: position.x, top: position.y }}
        key={key}
        className="childComponent"
        onClick={() => {
          setClickCount(clickCount + 1);
        }}
      >
        {data}
      </div>
    </Draggable>
  );
}
