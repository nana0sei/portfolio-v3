import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const words = ["software engineer", "digital artist"];

const LoopingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="italic text-blue-400 min-w-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          initial={{ y: "-50%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "50%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {words[index]}.
        </motion.div>
      </AnimatePresence>
    </span>
  );
};

export default LoopingText;
