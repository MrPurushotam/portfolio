"use client";
import Badge from "./Badge";
import { motion } from "framer-motion";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { DotsThreeOutlineVerticalIcon, ShareIcon } from "@phosphor-icons/react";
import { useState } from "react";

const ProjectsSection = ({ project, state }) => {
  const [viewDesc, setViewDesc] = useState(project?.description.length < 200);
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -8 },
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="group w-full p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#1e1e1e] dark:to-[#2a2a2a] transition-all duration-300 relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
      </div>
      
      <div className="relative flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-60 h-60 flex-shrink-0 relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          {project?.resourceType === "video" ? (
            <video
              src={project?.static_file}
              muted
              autoPlay
              loop
              className="w-full h-full object-contain lg:object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <img
              src={project?.static_file}
              alt="Project Thumbnail"
              className="w-full h-full object-contain lg:object-contain transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        <div className="flex-1 space-y-5">
          <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 leading-tight">
            {project?.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {project.techstack.length > 0 && JSON.parse(project.techstack)?.map((stack, index) => {
              const randomSelect = () => {
                let random = Math.floor(Math.random() * 4) + 1
                switch (random) {
                  case 1:
                    return "one"
                  case 2:
                    return "two"
                  case 3:
                    return "three"
                  case 4:
                    return "four"
                }
              }
              return (
                <motion.div
                  key={stack}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge text={stack} type={randomSelect()} />
                </motion.div>
              )
            })}
          </div>

          <div className="relative">
            <p className="text-lg lg:text-xl font-light leading-relaxed text-gray-600 dark:text-gray-300">
              {viewDesc ? project?.description : project?.description.substring(0, 200)}
              {
                <span className="ml-1 mt-1 text-gray-500 dark:text-gray-300 underline hover:text-gray-400" onClick={() => setViewDesc(prev => !prev)} >
                  {viewDesc ? "View Less" : "View More"}
                  {/* <DotsThreeIcon size={18} /> */}
                </span>
              }
            </p>
          </div>
          <div className="flex items-center space-x-4 text-2xl text-blue-600 dark:text-[#2C8BCF] ">
            {project?.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 font-medium  hover:underline"
              >
                <GithubLogoIcon />
                <span>Github</span>
              </a>
            )}
            {project?.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 font-medium  hover:underline"
              >
                <ShareIcon />
                <span>Live</span>
              </a>
            )}

            {project?.brief && (
              <button
                onClick={() => state(project)}
                className="flex items-center space-x-1 font-mediumhover:underline"
              >
                <DotsThreeOutlineVerticalIcon />
                <span>Brief</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
