"use client";

import Link from "next/link";
import Badge from "./Badge";

const ProjectsSection = ({ project, state }) => {
  return (
    <div className="w-full px-3 py-3 border border-gray-300 dark:border-none dark:shadow-md dark:shadow-[#383838] rounded-md shadow-sm bg-white dark:bg-[#262526] hover:shadow-lg transition-shadow duration-200 ">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-52 h-52 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 shadow-sm bg-gray-100 dark:border-none">
          {project?.resourceType === "video" ? (
            <video
              src={
                project?.static_file ||
                "https://aceyourpaper.com/essays/public/images/loader.gif"
              }
              muted
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={
                project?.static_file ||
                "https://aceyourpaper.com/essays/public/images/loader.gif"
              }
              alt="Project Thumbnail"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-[#ffe0e8] leading-tight tracking-wide">
            {project?.title || "Project Title"}
          </h1>

          {/* Badges */}
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

          {/* Description */}
          <p className="text-2xl text-gray-600 dark:text-[#ffe0e8] line-clamp-2">
            {project?.description ||
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis vel repellendus cumque corporis animi."}
          </p>

          {/* Links Section */}
          <div className="flex items-center space-x-4 text-2xl text-blue-600 dark:text-[#2C8BCF] ">
            {project?.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 font-medium  hover:underline"
              >
                <i className="ph-duotone ph-github-logo"></i>
                <span>GitHub</span>
              </Link>
            )}
            {project?.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 font-medium  hover:underline"
              >
                <i className="ph-duotone ph-share"></i>
                <span>Live</span>
              </Link>
            )}
            {project?.brief && (
              <button
                onClick={() => state(project)}
                className="flex items-center space-x-1 font-mediumhover:underline"
              >
                <i className="ph-duotone ph-dots-three-outline-vertical"></i>
                <span>Brief</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
