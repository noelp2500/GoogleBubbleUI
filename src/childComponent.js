import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

export default function ChildComponent({
  data,
  setClick,
  key,
  fullData,
  setFullData,
}) {
  const [clickCount, setClickCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const [dragCompleted, setDragCompleted] = useState(false);
  const [mergedKeyword, setMergedKeyword] = useState();
  const [onDragFlag, setOnDragFlag] = useState(false);

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
      setClick(mergedKeyword || data);
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 300);
    }
  }, [clickCount, mergedKeyword]);

  const onDragStop = () => {
    setDragCompleted(true);
  };

  const checkCombine = (x, y) => {
    const elements = document.querySelectorAll(".childComponent");
    elements.forEach((element) => {
      if (element !== elementRef.current) {
        const rect1 = elementRef.current.getBoundingClientRect();
        const rect2 = element.getBoundingClientRect();
        if (
          rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y
        ) {
          let removedBubbleParams = {
            key: element.getAttribute("key"),
            left: rect2.x,
            top: rect2.y,
            value: element.textContent,
          };

          let replacedBubbleParams = {
            key: elementRef.current.getAttribute("key"),
            left: rect1.x,
            top: rect1.y,
            value: elementRef.current.outerText,
          };

          let newMergedKeyword =
            removedBubbleParams["value"] +
            " + " +
            replacedBubbleParams["value"];

          element.textContent = newMergedKeyword;

          setMergedKeyword(newMergedKeyword);

          elementRef.current.remove();

          fullData[newMergedKeyword] = [
            ...fullData[removedBubbleParams["value"]],
            ...fullData[replacedBubbleParams["value"]],
          ];

          delete fullData[removedBubbleParams["value"]];
          delete fullData[replacedBubbleParams["value"]];

          setFullData(fullData);
          setOnDragFlag(false);
        }
      }
    });
  };

  const onDrag = (e, ui) => {
    setTimeout(() => {
      setPosition({ x: ui.x, y: ui.y });
      checkCombine(ui.x, ui.y);
    }, 5000);
  };

  useEffect(() => {
    if (dragCompleted) {
      setDragCompleted(false);
    }
  }, [dragCompleted]);

  return (
    <Draggable onDrag={onDrag} onStop={onDragStop}>
      {mergedKeyword ? (
        <div
          ref={elementRef}
          style={{ left: position.x, top: position.y }}
          key={key}
          className="childComponent"
          onClick={() => {
            setClickCount(clickCount + 1);
          }}
        >
          {mergedKeyword}
        </div>
      ) : (
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
      )}
    </Draggable>
  );
}
