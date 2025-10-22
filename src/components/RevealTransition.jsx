import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useTransition } from "../api/MiniLoaderContext.jsx";

const RevealerTransition = () => {
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = useRef(null);
  const firstLoad = useRef(true);
  const { setIsTransitioning } = useTransition();

  // Prevent user from seeing page before animation
  useEffect(() => {
    if (firstLoad.current) {
      document.body.style.visibility = "hidden";
    }
  }, []);

  // Handle navigation click (Page Cover Animation)
// ✅ On route change or first load
useEffect(() => {
  const overlay = overlayRef.current;

  if (firstLoad.current) {
    // Start fully visible (black screen)
    gsap.set(overlay, { scaleY: 1, transformOrigin: "bottom" });

    // ✅ Animate overlay covering (flash) and revealing smoothly
    gsap.fromTo(
      overlay,
      { scaleY: 1, transformOrigin: "bottom" },
      {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        ease: "power3.inOut",
        onStart: () => {
          document.body.style.visibility = "visible";
        },
        onComplete: () => {
          firstLoad.current = false;
          setIsTransitioning(false);
        },
      }
    );
    return;
  }

  // ✅ For subsequent route changes
  gsap.fromTo(
    overlay,
    { scaleY: 1, transformOrigin: "bottom" },
    {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => setIsTransitioning(false),
    }
  );
}, [location.pathname, setIsTransitioning]);


  // Reveal animation (for first load and route change)
  useEffect(() => {
    const overlay = overlayRef.current;

    // ✅ On first load
    if (firstLoad.current) {
      gsap.set(overlay, { scaleY: 1, transformOrigin: "top" });
      gsap.to(overlay, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "power3.inOut",
        onStart: () => {
          document.body.style.visibility = "visible";
        },
        onComplete: () => {
          firstLoad.current = false;
          setIsTransitioning(false);
        },
      });
      return;
    }

    // ✅ On route change (REVEAL)'
    gsap.fromTo(
      overlay,
      { scaleY: 1, transformOrigin: "top" },
      {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => setIsTransitioning(false),
      }
    );
  }, [location.pathname, setIsTransitioning]);

  return (
    <div
      ref={overlayRef}
      className="fixed top-0 left-0 w-full h-full bg-black origin-top z-[9999]"
      style={{
        transform: "scaleY(1)",
        willChange: "transform",
        pointerEvents: "none",
      }}
    />
  );
};

export default RevealerTransition;