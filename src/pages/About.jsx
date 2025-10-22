import React, { useRef } from 'react';
// Import motion and useInView from Framer Motion
import { motion, useInView } from 'framer-motion'; 
// Import necessary dependencies
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const About = () => {
  const navigate = useNavigate(); // Hook to enable navigation for the button

  // Refs for sections to trigger animations when they come into view
  const storyRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);

  // useInView hook to detect when a ref'd element is in the viewport
  const isStoryInView = useInView(storyRef, { once: false, amount: 0.3 }); // Trigger repeatedly for replay on scroll
  const isMissionInView = useInView(missionRef, { once: false, amount: 0.3 });
  const isTeamInView = useInView(teamRef, { once: false, amount: 0.3 });

  // --- Enhanced Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Faster stagger for more dynamic feel
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotate: -5 },
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: 5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: "easeOut", type: "spring", bounce: 0.4 } },
  };

  const teamMemberVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30, rotate: -10 },
    visible: { opacity: 1, scale: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 120 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, x: -100, skewX: 10 },
    visible: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.9, ease: "easeOut", type: "spring" } },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } },
  };

  const hoverVariants = {
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3, yoyo: Infinity } },
  };
  // -------------------------

  // Dummy data for the team members
  const teamMembers = [
    { name: "Alice Johnson", role: "CEO & Founder", image: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Alice", bio: "Passionate innovator with 15+ years in tech." },
    { name: "Bob Williams", role: "Lead Developer", image: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Bob", bio: "Code wizard specializing in scalable apps." },
    { name: "Charlie Davis", role: "Product Manager", image: "https://via.placeholder.com/150/32CD32/FFFFFF?text=Charlie", bio: "User-centric thinker driving product success." },
    { name: "Diana Miller", role: "Marketing Head", image: "https://via.placeholder.com/150/FFD700/000000?text=Diana", bio: "Creative strategist boosting brand visibility." },
  ];

  // Function to split text into words for word-by-word animation
  const animateText = (text) => text.split(' ').map((word, index) => (
    <motion.span key={index} variants={wordVariants} className="inline-block mr-1">
      {word}
    </motion.span>
  ));

  return (
    <div className="">
      <Navbar />
      
    </div>
  );
};

export default About; 