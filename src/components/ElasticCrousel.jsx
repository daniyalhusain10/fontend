import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ShopContext from "../api/ShopContext.jsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from './Button.jsx'
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- CONSTANTS ---
const CARD_WIDTH = 320;
const CARD_MARGIN = 20;
const CONTAINER_PADDING = 24;
const LARGE_SCREEN_BREAKPOINT = 1024; // Tailwind's 'lg'

const ElasticCarousel = () => {
 
  const { products } = useContext(ShopContext);

  const carouselRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const cardContainerRef = useRef(null);
  
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // --- Derived state / calculations ---
  const womensProducts = products.filter((p) =>
    typeof p.category === "string"
      ? ["women", "womens"].includes(p.category.toLowerCase().trim())
      : false
  );
  const cardCount = womensProducts.length;
  const contentWidth = cardCount * CARD_WIDTH + Math.max(0, cardCount - 1) * CARD_MARGIN;
  const visibleWidth = containerWidth - 2 * CONTAINER_PADDING;
  const isScrollable = contentWidth > visibleWidth;
  const isFramerDragActive = !isLargeScreen && isScrollable;
  const scrollDistance = contentWidth - visibleWidth;
  
  // --- 1. Handle resize and screen size ---
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(carouselRef.current?.offsetWidth || 0);
      setIsLargeScreen(window.innerWidth >= LARGE_SCREEN_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 2. GSAP horizontal scroll (Always called, logic runs conditionally) ---
useGSAP(() => {
  const container = cardContainerRef.current;
  const cards = container ? container.children : [];

  if (!isLargeScreen || !isScrollable) {
    if (container) gsap.set(container, { x: 0 });
    if (cards.length > 0) gsap.set(cards, { opacity: 1, y: 0 });
    ScrollTrigger.getAll().forEach(st => st.kill());
    return;
  }

  // Fade-in cards
  if (cards.length > 0) {
    gsap.from(cards, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.5,
    });
  }

  // Horizontal Scroll
  gsap.to(container, {
    x: -scrollDistance,
    ease: "none",
    scrollTrigger: {
      trigger: scrollTriggerRef.current,
      pin: true,
      start: "top top",
      end: `+=${scrollDistance}`,
      scrub: 1.2,
      invalidateOnRefresh: true,
      onRefresh: self => {
        // force remeasurement of height
        const section = scrollTriggerRef.current;
        if (section) {
          section.style.height = `calc(30vh + ${scrollDistance}px)`;
        }
      },
    },
  });

  // 💡 Force ScrollTrigger refresh after a tick
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);

}, { scope: scrollTriggerRef, dependencies: [containerWidth, cardCount, isLargeScreen] });

  // --- Conditional Render (FINE) ---
  if (cardCount === 0)
    return (
      <section className="text-black py-12 px-6 min-h-screen">
        <p className="text-center text-gray-500">Loading products...</p>
      </section>
    );

  // Framer Motion Drag Constraints
  const dragConstraints = {
    left: -Math.max(scrollDistance, 0),
    right: 0,
  };

  return (
    <section className="text-black px-6 ">
      <div
        ref={scrollTriggerRef}
        className="w-full overflow-hidden"
        style={{
          // Height calculated for GSAP pinning
          height: isLargeScreen && isScrollable
              ? `calc(30vh + ${scrollDistance}px)`
              : "auto",
        }}
      >
        <div ref={carouselRef} className="w-full overflow-hidden select-none">
          <motion.div
            ref={cardContainerRef}
            className="flex py-4 gap-[20px]"
            
            // Drag is active ONLY when Framer Motion is the controller
            drag={isFramerDragActive ? "x" : false}
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            dragTransition={{ power: 0.15, bounceStiffness: 100, bounceDamping: 10 }}
            
            // Cursor logic based on Framer Drag Active
            whileDrag={{ cursor: isFramerDragActive ? "grabbing" : "default" }}
            style={{ 
              cursor: isFramerDragActive ? "grab" : "default"
            }}
          >
            {womensProducts.map((product) => (
              <DraggableCard key={product._id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 🔹 Card component
const DraggableCard = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const pointerDownRef = useRef({ x: 0, y: 0 });

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => img.url || img)
      : [product.imageUrl || "https://placehold.co/600x600/cccccc/333333?text=No+Image"];

  useEffect(() => {
    if (hovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 700);
    } else {
      clearInterval(intervalRef.current);
      setCurrentIndex(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [hovered, images.length]);

  const handlePointerDown = (e) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const dx = Math.abs(e.clientX - pointerDownRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownRef.current.y);
    if (dx < 5 && dy < 5) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-[320px]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <motion.div
        className="flex flex-col shadow-lg overflow-hidden "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* 🔥 FIX 1: Image Drag now works */}
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            // Prevents browser's default image drag behavior
            draggable="false" 
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${
              hovered ? "scale-110" : "scale-100"
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x600/cccccc/333333?text=No+Image";
            }}
          />
        </div>

        <div className="mt-4 text-left p-4">
          <h3 className="text-md tracking-tighter text-black uppercase">{product.name}</h3>
          <p className="text-xl tracking-tighter font-bold text-black mt-1">
            PKR {product.price}.00
          </p>

          {product.sizes?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.sizes.map((size) => (
                <div
                  key={size}
                  className="px-3 py-1 uppercase text-sm font-medium bg-gray-200 text-gray-800 rounded cursor-default"
                >
                  {size}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">No size options</p>
          )}

          <div className="mt-4">
           <Button text={"product.."} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ElasticCarousel;
