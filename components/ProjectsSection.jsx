"use client";

import Link from "next/link";
import Badge from "./Badge";

const ProjectsSection = ({ project, state }) => {
  return (
    <div className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-52 h-52 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-md border border-gray-200 shadow-sm bg-gray-100">
          {project?.resourceType === "video" ? (
            <video
              src={
                project?.static_file ||
                "https://aceyourpaper.com/essays/public/images/loader.gif"
              }
              muted
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={
                project?.static_file ||
                "https://aceyourpaper.com/essays/public/images/loader.gif"
              }
              alt="Project Thumbnail"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-semibold text-gray-800 leading-tight tracking-wide">
            {project?.title || "Project Title"}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge text="ReactJs" type="outline" />
            <Badge text="JavaScript" type="one" />
            <Badge text="Node.js" type="two" />
            <Badge text="Node.js" type="three" />
            <Badge text="Node.js" type="four" />
          </div>

          {/* Description */}
          <p className="text-2xl text-gray-600 line-clamp-2">
            {project?.description ||
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis vel repellendus cumque corporis animi."}
          </p>

          {/* Links Section */}
          <div className="flex items-center space-x-4 text-2xl">
            {project?.githubLink && (
              <Link
                href={project.githubLink}
                className="flex items-center space-x-1 font-medium text-blue-600 hover:underline"
              >
                <i className="ph-duotone ph-github-logo"></i>
                <span>GitHub</span>
              </Link>
            )}
            {project?.liveLink && (
              <Link
                href={project.liveLink}
                className="flex items-center space-x-1 font-medium text-blue-600 hover:underline"
              >
                <i className="ph-duotone ph-share"></i>
                <span>Live</span>
              </Link>
            )}
            {project?.brief && (
              <button
                onClick={() => state(project?.id)}
                className="flex items-center space-x-1 font-medium text-blue-600 hover:underline"
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
