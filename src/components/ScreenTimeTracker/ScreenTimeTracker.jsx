import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

import "./ScreenTimeTracker.css";

const ScreenTimeTracker = () => {
  const [screenTime, setScreenTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const idleTimeoutRef = useRef(null);

  const updateScreenTime = () => {
    if (isActive) {
      setScreenTime((prevTime) => prevTime + 1);
    }
  };

  const handleIdleState = () => {
    setIsIdle(true);
    setIsActive(false);
  };

  const handleActiveState = () => {
    setIsIdle(false);
    setIsActive(true);
    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(handleIdleState, 60000); // Reset the idle timeout
  };

  useEffect(() => {
    idleTimeoutRef.current = setTimeout(handleIdleState, 60000); // 5 seconds of idle time

    const activityEvents = [
      "keydown",
      "keyup",
      "keypress",
      "mousemove",
      "mousedown",
      "wheel",
    ];

    const addEventListeners = () => {
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActiveState);
      });
    };

    const removeEventListeners = () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActiveState);
      });
    };

    addEventListeners();

    return () => {
      clearTimeout(idleTimeoutRef.current);
      removeEventListeners();
    };
  }, []); // Empty dependency array to run this effect only once during component mount

  useEffect(() => {
    const screenTimeInterval = setInterval(updateScreenTime, 1000); // Update every second

    return () => {
      clearInterval(screenTimeInterval);
    };
  }, [isActive]);

  return (
    <Draggable bounds="parent">
      <main className="time-tracker-container">
        {isIdle ? (
          <span className="idle-user">User is Idle</span>
        ) : (
          <span className="time-tracker">
            Screen Time:{" "}
            {screenTime >= 3600
              ? `${Math.floor(screenTime / 3600)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((screenTime % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}:${(screenTime % 60)
                  .toString()
                  .padStart(2, "0")}h`
              : screenTime >= 60
              ? `${Math.floor(screenTime / 60)
                  .toString()
                  .padStart(2, "0")}:${(screenTime % 60)
                  .toString()
                  .padStart(2, "0")}m`
              : `${screenTime.toString().padStart(2, "0")}s`}
          </span>
        )}
      </main>
    </Draggable>
  );
};

export default ScreenTimeTracker;
