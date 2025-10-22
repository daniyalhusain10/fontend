import React, { useEffect, useState } from "react";
import gsap from "gsap";

const Preloader = () => {
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false); // 👈 new state to hide div after animation

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      if (current < 100) {
        current += 1;
        setCount(current);
      } else {
        clearInterval(interval);

        // 🔥 Shutter-up effect
        gsap.to(".preloader", {
          y: "-100%",
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            setHidden(true); // 👈 hide component completely after animation
            document.body.style.overflow = "auto";
          },
        });
      }
    }, 20);

    // Prevent scrolling during preloader
    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (hidden) return null; // 👈 once animation ends, remove from DOM completely

  return (
    <div
      className="preloader fixed top-0 inset-0 z-[9999] bg-black text-white flex items-end justify-start pb-4 pl-8"
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Big Counter */}
      <div className="text-[6vw] md:text-[4vw] font-bold leading-none select-none">
        {count}%
      </div>
    </div>
  );
};

export default Preloader;
