import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

type Block = { id: number; label: string };

const initialBlocks: Block[] = [
  { id: 1, label: "Experience" },
  { id: 2, label: "Skills" },
  { id: 3, label: "Projects" },
];

export default function AutoReorderDemo() {
  const [blocks, setBlocks] = useState(initialBlocks);

  // Automatic shuffle
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const newBlocks = [...prev];
        // Pick two random indices to swap
        const i = Math.floor(Math.random() * newBlocks.length);
        let j = Math.floor(Math.random() * newBlocks.length);
        while (j === i) j = Math.floor(Math.random() * newBlocks.length);
        [newBlocks[i], newBlocks[j]] = [newBlocks[j], newBlocks[i]];
        return newBlocks;
      });
    }, 2000); // every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" bg-darker p-8 flex gap-8 text-white rounded">
      {/* Left Panel: Mini blocks */}
      <div className="w-40 flex flex-col gap-4">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            layout
            className="bg-dark p-4 rounded text-center font-semibold transition-colors duration-300"
          >
            {block.label}
          </motion.div>
        ))}
      </div>

      {/* Right Panel: Output */}
      <motion.div className="flex-1 bg-white/80 p-6 rounded-lg flex flex-col gap-3">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            layout
            className="bg-dark p-3 rounded text-sm font-medium"
            transition={{ duration: 0.5, type: "spring", stiffness: 500, damping: 30 }}
          >
            {block.label} content goes here
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
