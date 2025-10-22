import React from 'react'
import Button from './Button';
import {  useNavigate } from 'react-router-dom';
const Collection = () => {
  const  navigate = useNavigate()
  // Image paths
  const summerImageUrl = "/left-side.png";
  const winterImageUrl = "/right-side.png";

  return (
    <div className="flex flex-col md:flex-row max-w-8xl font-sans">
      
      {/* Left Section: SUMMER COLLECTION */}
      <div className="md:w-1/2 w-full h-[60vh] md:h-[100vh] relative overflow-hidden">
        <img
          src={summerImageUrl}
          alt="Summer Collection"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out hover:scale-[1.03]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30 hover:opacity-10 transition-opacity duration-500"></div>

        {/* Text content */}
        <div className="absolute bottom-12 left-10 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-widest drop-shadow-lg">
            SUMMER
          </h1>
          <p className="text-white/90 font-light mb-4 mt-2 text-sm sm:text-base tracking-wide">
            Discover our vibrant summer essentials
          </p>

          {/* View More button */}
         <div onClick={()=>navigate("/allproducts")}>
      <Button  text={"view more"}/>
        </div>
        </div>
      </div>

      {/* Right Section: WINTER COLLECTION */}
      <div className="md:w-1/2 w-full h-[60vh] md:h-[100vh] relative overflow-hidden">
        <img
          src={winterImageUrl}
          alt="Winter Collection"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out hover:scale-[1.03]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30 hover:opacity-10 transition-opacity duration-500"></div>

        {/* Text content */}
        <div className="absolute bottom-12 left-10 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-widest drop-shadow-lg">
            WINTER
          </h1>
          <p className="text-white/90 font-light mb-4 mt-2 text-sm sm:text-base tracking-wide">
            Embrace the cozy winter elegance
          </p>

          {/* View More button */}
        <div onClick={()=>navigate("/allproducts")}>
      <Button  text={"view more"}/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
