import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const jobTitles = [
  "Software Engineer",
  "Senior Backend Developer",
  "Game Developer",
  "Technical Lead",
];

const TypingHero = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [ripple, setRipple] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentTitle = jobTitles[titleIndex];
    if (charIndex < currentTitle.length) {
      const timeout = setTimeout(() => {
        setJobTitle((prev) => prev + currentTitle[charIndex]);
        setRipple(true);
        setCharIndex(charIndex + 1);

        // Reset ripple quickly
        setTimeout(() => setRipple(false), 500);
      }, 100); // typing speed (ms per character)
      return () => clearTimeout(timeout);
    } else {
      // Pause before next title
      const timeout = setTimeout(() => {
        setJobTitle("");
        setCharIndex(0);
        setTitleIndex((titleIndex + 1) % jobTitles.length);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, titleIndex]);

  const ResumeCard = ({ index }: { index: number }) => (
    <motion.div
      style={{
        position: "relative",
        padding: "1rem",
        margin: "0.5rem",
        borderRadius: "8px",
        background: "#111",
        color: "#fff",
        minWidth: "200px",
        minHeight: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontFamily: "monospace",
      }}
      animate={{ opacity: [0.6, 1], y: [2, 0] }}
      transition={{ delay: ripple ? index * 0.08 : 0, duration: 0.3 }}
    >
      {ripple && (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "4px",
            boxShadow: "0 0 0 0 rgba(99,102,241,0.6)",
          }}
          animate={{
            boxShadow: ["0 0 0 0 rgba(99,102,241,0.6)", "0 0 0 12px rgba(99,102,241,0)"],
          }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
        />
      )}
      <div className="flex flex-col">
        <h4>Resume {index + 1}</h4>
        <p>{jobTitle}</p>
      </div>
    </motion.div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#0f0f0f",
        flexDirection: "row"
      }}
    >
      {/* Data Panel */}
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          background: "#222",
          minWidth: "250px",
          color: "#fff",
          fontFamily: "monospace",
        }}
      >
        <label>
          Job Title:
          <input
            value={jobTitle}
            readOnly
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
            }}
          />
        </label>
      </div>

      {/* Resume Cards */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <ResumeCard key={i} index={i} />
        ))}
      </div>
    </div>
  );
};

export default TypingHero;
