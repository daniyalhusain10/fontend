import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import ElasticCarousel from "../components/ElasticCrousel";

const Banner = () => {
  const navigate = useNavigate();
  // 1. Move the ref to the parent div containing the text elements
  const containerRef = useRef(null); 

  useEffect(() => {
    if (!containerRef.current) return;

    const allChars = [];
    
    // Select the H1 and P elements *within* the containerRef
    containerRef.current.querySelectorAll("h1, p").forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;

      el.textContent = "";
      const chars = text.split("").map((char) => {
        const span = document.createElement("span");
        // Use a non-breaking space for actual spaces
        span.textContent = char === " " ? "\u00A0" : char; 
        span.style.display = "inline-block";
        el.appendChild(span);
        return span;
      });

      allChars.push(...chars);
    });

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // Set the initial state of the container to opacity 0 if you want a fade-in effect.
    // However, the text-splitting will happen before this, so it's safer to 
    // set the initial opacity on the container directly in the return statement
    // or use a `set` call.

    // 2. Initial state: hide the characters *before* the animation
    gsap.set(allChars, { y: 400, opacity: 0 }); 

    // Animate text characters
    tl.to(allChars, {
      y: 0, // Animate y back to 0 (its original position)
      opacity: 1, // Animate opacity from 0 to 1
      duration: 0.8,
      delay:0.7,
      ease: "power3.out",
      stagger: 0.04,
    });
 
  }, []);

  return (
  <div className="h-full">
    <div className="flex justify-center lg:min-h-[20vw] w-full items-center">
      {/* 3. Apply containerRef to the parent div of the text */}
      <div ref={containerRef} className="lg:h-[300px] overflow-hidden"> 
      <h1 className=" uppercase lg:py-0 py-10 leading-none whitespace-nowrap text-[20vw] lg:text-[20vw] font-bold lg:-tracking-[10px]"> WINTER </h1>
      </div>
    </div>
    <ElasticCarousel />
  </div>
  );
};

export default Banner;