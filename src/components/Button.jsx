import React, { useState } from 'react'
import { GoArrowRight } from "react-icons/go";
import {easeIn, motion} from 'framer-motion'
const Button = ({text}) => {
    const [isHover, setisHover] = useState(false);



  return (
  <div
   onMouseEnter={(e)=> setisHover(true)}
   onMouseLeave={(e)=> setisHover(false)}
   className=' w-[190px] flex-start inline-block'>
    
        <motion.div
       
         className='overflow-hidden cursor-pointer flex justify-center  border border-gray-400 py-[15px] px-[35px] rounded-[50px] relative items-center'>
            <motion.div
             animate={{
            scale:isHover ? 50 : 1,
        }}
        transition={{transition: easeIn,
            duration:0.3,
        }}
             className=' bg-[#FF5349] w-3  rounded-full absolute left-[15px] h-3 mr-[10px]'></motion.div>
                <motion.div>

                <motion.p
                 animate={{
                    x: isHover ? -9 : 0,
                    color: isHover ? "#FFFFfF" : "#000000"
                }}
                 className='pr-[15px] uppercase'>{text}</motion.p>
                </motion.div>

                <motion.div
                  animate={{
                    x: isHover ? -10 : 0,
                    color: isHover ? "#FFFFfF" : "#ffffff",
                }}
                 className='absolute right-[20px]'>
                <GoArrowRight className='text-[23px] ' />
                </motion.div>

            </motion.div>
  </div>
   
  )
}

export default Button