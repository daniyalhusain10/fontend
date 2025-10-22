import React, { useEffect, useState } from "react";
import RenderProduct from "./RenderProduct.jsx";
import Banner from '../components/Banner.jsx'
import Navbar from "../components/Navbar.jsx";
import Collection from "../components/Collection.jsx";
import Footer from "../components/Footer.jsx";
 const Home = () => {
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
  const [loggedIn, setLoggedIn] = useState(false); // default: false

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/validate`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setLoggedIn(data.loggedIn === true);
      } catch (error) {
        console.error("Validation failed", error);
        setLoggedIn(false);
      }
    };
    checkLoggedIn();
  }, []);


  return (
    <div className=" ">
     <Navbar />
     <Banner />
     <Collection />
     <RenderProduct />
     <Footer />
    </div>
  );
};
export default Home
