"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const words = ["software engineer", "digital artist"];

const LoopingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="italic text-blue-400">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "0%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {words[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default LoopingText;
