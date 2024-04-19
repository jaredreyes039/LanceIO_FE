import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function PageBodyLayout(props) {

    const scrollablePage = useRef();

    const animations = {
        initial: { opacity: 0, y: 1000 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: 1000 },
        transition: { duration: 0.5 }
    }

    return (
        <motion.div style={{ padding: props.settings ? '0px' : '3.25%' }} ref={scrollablePage} className="bg-black w-full h-dvh overflow-y-scroll overflow-x-hidden" variants={animations} initial="initial" animate="animate" exit="exit" transition='transition' >
            {props.children}
        </motion.div>
    )
}
