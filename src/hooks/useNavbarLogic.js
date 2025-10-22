// ./hooks/useNavbarLogic.js
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import ShopContext from "../api/ShopContext";
import { useAuth } from "../api/AuthContext";
import { useTransition } from "../api/MiniLoaderContext";

export const useNavbarLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, setSearchTerm, searchTerm } = useContext(ShopContext); // ✅ include searchTerm
  const { logout } = useAuth();
  const { setIsTransitioning } = useTransition();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRefs = useRef([]);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const cartRef = useRef(null);
  const animationDone = useRef(false);

  // ✅ Handle link click with transition animation
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === path) return;

    const overlay = document.querySelector(".global-overlay");
    if (!overlay) {
      navigate(path);
      return;
    }

    setIsTransitioning(true);

    // Overlay animation before navigating
    gsap.fromTo(
      overlay,
      { scaleY: 0, transformOrigin: "bottom" },
      {
        scaleY: 1,
        transformOrigin: "bottom",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          navigate(path);
        },
      }
    );
  };

  // ✅ Logout
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
        setIsTransitioning(true);
        navigate("/login", { replace: true });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ✅ Handle Search Input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value && location.pathname !== "/allproducts") {
      navigate("/allproducts");
    }
  };

  // ✅ Calculate total cart items
  const totalCartCount = Object.values(cartItems).reduce(
    (total, sizes) =>
      total + Object.values(sizes).reduce((sub, qty) => sub + qty, 0),
    0
  );

  // ✅ Navbar intro animation (only once)
  useEffect(() => {
    if (animationDone.current) return;

    const tl = gsap.timeline({ delay: 0 });
    const desktopLogo = document.getElementById("desktop-logo");

    if (desktopLogo) {
      tl.from(desktopLogo, { opacity: 0, duration: 0.8, ease: "power3.out" });
    }

    navRefs.current.forEach((el) => {
      if (!el) return;
      const text = el.querySelector("p");
      if (text)
        tl.from(text, { opacity: 0, duration: 0.6, ease: "power3.out" }, "<0.1");
    });

    [searchRef.current, userRef.current, cartRef.current].forEach((el) => {
      if (!el) return;
      tl.from(el, { opacity: 0, duration: 0.6, ease: "power3.out" }, "<0.1");
    });

    animationDone.current = true;
  }, []);

  // ✅ Return all variables used by Navbar
  return {
    location,
    searchTerm,         // ✅ this fixes your error
    handleLinkClick,
    handleLogout,
    handleSearchChange,
    totalCartCount,
    isSearchOpen,
    setIsSearchOpen,
    menuOpen,
    setMenuOpen,
    navRefs,
    searchRef,
    userRef,
    cartRef,
  };
};
