import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const themes = {
  modern: {
    container: "bg-gray-900",
    card: "bg-white",
    font: "font-sans tracking-tight",
    headerLayout: "items-center text-center",
    name: "text-2xl font-bold text-black",
    title: "text-indigo-400 uppercase tracking-wide",
    company: "text-sm text-gray-400",
    divider: "border-indigo-400",
    skillsLayout: "flex flex-wrap justify-center gap-2",
    skill: "px-2 py-1 rounded bg-indigo-400 text-white text-sm",
    experienceLayout: "space-y-1",
  },

  editorial: {
    container: "bg-neutral-100",
    card: "bg-white",
    font: "font-serif",
    headerLayout: "items-start text-left",
    name: "text-3xl font-bold text-black",
    title: "italic text-gray-800",
    company: "text-sm text-gray-600",
    divider: "border-black",
    skillsLayout: "flex flex-row gap-x-4 text-sm",
    skill: "underline decoration-gray-400",
    experienceLayout: "border-l pl-4 space-y-2 text-sm",
  },

  brutalist: {
    container: "bg-black",
    card: "bg-white border border-white",
    font: "font-mono uppercase tracking-widest",
    headerLayout: "items-start text-left",
    name: "text-xl font-extrabold text-black",
    title: "text-gray-700 text-xs",
    company: "text-xs text-gray-400",
    divider: "border-gray-300",
    skillsLayout: "flex flex-row gap-1 text-xs",
    skill: "text-gray-400",
    experienceLayout: "text-xs space-y-1",
  },
};

const resumeData = {
  name: "John Doe",
  title: "Software Engineer",
  company: "Typely Inc.",
  skills: ["React", "TypeScript", "C++", "Vulkan"],
  experience: [
    { role: "Backend Developer", company: "AI Startup", years: "2025–2026" },
    { role: "Unity Developer", company: "Gaming Company", years: "2024–2025" },
  ],
};

export default function AutoThemeResumeDemo() {
  const themeKeys = Object.keys(themes) as (keyof typeof themes)[];
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = themes[themeKeys[themeIndex]];

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % themeKeys.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`min-h-[400px] flex items-center justify-center p-8 transition-colors`}
      layout
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className={`w-[460px] p-6 rounded-lg shadow-lg flex flex-col gap-4 ${theme.card} ${theme.font}`}
      >
        {/* Header */}
        <motion.div
          layout
          className={`flex flex-col ${theme.headerLayout}`}
        >
          <h2 className={theme.name}>{resumeData.name}</h2>
          <p className={theme.title}>{resumeData.title}</p>
          <p className={theme.company}>{resumeData.company}</p>
        </motion.div>

        {/* Divider */}
        <motion.hr
          layout
          className={`border-t-2 ${theme.divider}`}
        />

        {/* Skills */}
        <motion.div layout className={theme.skillsLayout}>
          {resumeData.skills.map((skill) => (
            <span key={skill} className={theme.skill}>
              {theme.font.includes("mono") ? skill.toUpperCase() : skill}
            </span>
          ))}
        </motion.div>

        {/* Experience */}
        <motion.div layout className={theme.experienceLayout}>
          {resumeData.experience.map((exp) => (
            <div key={exp.role} className="flex justify-between gap-2">
              <span>
                <strong>{exp.role}</strong>{" "}
                {!theme.font.includes("mono") && `@ ${exp.company}`}
              </span>
              <span className="opacity-60">{exp.years}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
