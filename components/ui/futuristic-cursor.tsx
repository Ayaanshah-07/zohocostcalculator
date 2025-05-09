"use client";

import { useEffect, useState } from "react";

export const FuturisticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [rotating, setRotating] = useState(0);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.classList.contains("interactive") ||
        target.closest("button") !== null;
      
      setHovering(isInteractive);
    };

    // Rotation animation
    const rotationInterval = setInterval(() => {
      setRotating(prev => (prev + 1) % 360);
    }, 50);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleHover);

    // Set body cursor to none to hide the default cursor
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleHover);
      document.body.style.cursor = "auto";
      clearInterval(rotationInterval);
    };
  }, []);

  return (
    <>
      <div 
        className="custom-cursor"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
        }}
      >
        {/* Outer ring with rotating segment */}
        <div className={`cursor-outer-ring ${clicking ? "clicking" : ""} ${hovering ? "hovering" : ""}`}>
          <div 
            className="cursor-rotating-segment" 
            style={{ transform: `rotate(${rotating}deg)` }}
          ></div>
        </div>
        
        {/* Inner rings and crosshair */}
        <div className="cursor-middle-ring"></div>
        <div className="cursor-inner-ring"></div>
        <div className="cursor-crosshair-horizontal"></div>
        <div className="cursor-crosshair-vertical"></div>
        
        {/* Center dot */}
        <div className="cursor-dot"></div>
        
        {/* Corner markers */}
        <div className="cursor-corner cursor-corner-tl"></div>
        <div className="cursor-corner cursor-corner-tr"></div>
        <div className="cursor-corner cursor-corner-bl"></div>
        <div className="cursor-corner cursor-corner-br"></div>
      </div>
      
      {clicking && (
        <div 
          className="cursor-click-effect"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
          }}
        />
      )}
    </>
  );
};

export default FuturisticCursor;