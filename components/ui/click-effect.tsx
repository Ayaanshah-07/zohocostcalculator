"use client";

import { useEffect } from "react";

type RippleEffect = {
  x: number;
  y: number;
  size: number;
  id: number;
};

export const ClickEffect = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('button, .interactive');
    let rippleCounter = 0;

    const createRipple = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Position relative to the button
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Create ripple element
      const ripple = document.createElement('span');
      rippleCounter += 1;
      
      ripple.classList.add('ripple-effect');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.dataset.id = `${rippleCounter}`;
      
      // Add to target
      target.appendChild(ripple);
      
      // Create scan line effect
      const scanLine = document.createElement('div');
      scanLine.classList.add('scan-line');
      target.appendChild(scanLine);
      
      // Also add a "click" class to the target for additional effects
      target.classList.add('clicked');
      
      // Remove effects after animation completes
      setTimeout(() => {
        if (ripple && ripple.parentElement) {
          ripple.remove();
        }
        if (scanLine && scanLine.parentElement) {
          scanLine.remove();
        }
        target.classList.remove('clicked');
      }, 1000);
    };

    buttons.forEach(button => {
      button.addEventListener('click', createRipple as EventListener);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', createRipple as EventListener);
      });
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ClickEffect;