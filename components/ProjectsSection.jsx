"use client";

import Link from "next/link";
import Badge from "./Badge";
import { motion } from "framer-motion";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { DotsThreeOutlineVerticalIcon, ShareIcon } from "@phosphor-icons/react";

const ProjectsSection = ({ project, state }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.03, y: -4 },
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full px-3 py-3 border border-gray-300 dark:border-none dark:shadow-md dark:shadow-[#383838] rounded-md shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#262526] dark:to-[#1f1f1f] transition-all duration-200 ">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-52 h-52 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100 shadow-md dark:border-[#444]">
          {project?.resourceType === "video" ? (
            <video
              src={project?.static_file}
              muted
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={project?.static_file}
              alt="Project Thumbnail"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white leading-tight tracking-wide">
            {project?.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {project.techstack.length > 0 && JSON.parse(project.techstack)?.map((stack) => {
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
                <Badge key={stack} text={stack} type={randomSelect()} />
              )
            })}
          </div>
          <p className="text-2xl text-gray-600 dark:text-white line-clamp-2 ">
            {project?.description}
          </p>
          <div className="flex items-center space-x-4 text-2xl text-blue-600 dark:text-[#2C8BCF] ">
            {project?.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 font-medium  hover:underline"
              >
                <GithubLogoIcon/>
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
                <ShareIcon/>
                <span>Live</span>
              </a>
            )}

            {project?.brief && (
              <button
                onClick={() => state(project)}
                className="flex items-center space-x-1 font-mediumhover:underline"
              >
                <DotsThreeOutlineVerticalIcon/>
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
