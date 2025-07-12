import React, { useState, useEffect, useMemo } from "react";
import { Upload, BookOpen, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Orb from "../components/Orb"; // adjust path if different

const HomePage = () => {
  const navigate = useNavigate();

  const [titleIndex, setTitleIndex] = useState(0);
  const dynamicTitles = useMemo(
    () => ["Faster", "Smarter", "Personalized", "Interactive", "Effective"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleIndex((prevIndex) =>
        prevIndex === dynamicTitles.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleIndex, dynamicTitles]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 pt-16 pb-10 lg:py-28 flex flex-col items-center justify-center gap-12">
        {/* Orb + Logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Optional blurred glow ring */}
          <div className="absolute inset-0 rounded-full bg-purple-300 opacity-40 blur-3xl -z-20" />

          {/* Orb shader */}
          <div className="absolute inset-0 -z-10 w-full h-full rounded-full overflow-hidden">
            <Orb />
          </div>

          {/* White circular logo */}
          <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center relative z-10">
            <Brain className="h-16 w-16 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center max-w-3xl">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BrainBoost
          </span>{" "}
          <span className="relative flex justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-12 md:h-16">
            &nbsp;
            {dynamicTitles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-semibold text-purple-700 text-3xl md:text-5xl"
                initial={{ opacity: 0, y: "-100%" }}
                animate={
                  titleIndex === index
                    ? { opacity: 1, y: 0 }
                    : {
                        opacity: 0,
                        y: titleIndex > index ? -150 : 150,
                      }
                }
                transition={{ type: "spring", stiffness: 50 }}
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 font-light text-center max-w-2xl">
          Upload your notes, generate quizzes, and track your progress with
          AI-powered insights.
        </p>

        {/* Call to Action */}
        <button
          onClick={() => navigate("/login")}
          className="relative w-40 cursor-pointer overflow-hidden rounded-full border-none bg-gradient-to-r from-purple-600 to-blue-600 p-3 text-white font-semibold group transition-all duration-500 ease-in-out"
        >
          <span className="inline-block transition-all duration-500 ease-in-out group-hover:translate-x-12 group-hover:opacity-0">
            Get Started
          </span>
          <div className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
            <span>Get Started</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 w-full px-4 max-w-6xl">
          {[
            // Wrap the data so it's easier to map
            {
              Icon: Upload,
              title: "Easy Upload",
              desc: "Simply drag and drop your notes or documents.",
              color: "text-purple-600",
            },
            {
              Icon: Brain,
              title: "AI-Powered",
              desc: "Advanced AI generates relevant quiz questions.",
              color: "text-blue-600",
            },
            {
              Icon: BookOpen,
              title: "Track Progress",
              desc: "Monitor your learning journey and improvements.",
              color: "text-indigo-600",
            },
          ].map(({ Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-md cursor-pointer"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 15px rgba(99, 102, 241, 0.3)",
                transition: {
                  type: "spring",
                  stiffness: 80, // lower stiffness = softer spring
                  damping: 15, // higher damping = less bounce
                },
              }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <Icon className={`h-12 w-12 ${color} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
