"use client";
import { useState } from "react";
import data from "../data/staticData.json";
import ResumeSkeleton from "./ResumeSkelenton";

const ResumeIntegration = () => {
  const { resumeDocId } = data;
  const [isLoading, setIsLoading] = useState(true);

  const resumeLink = `https://drive.google.com/file/d/${resumeDocId}/preview`;

  return (
    <div className="w-full p-3 h-dvh flex items-center justify-center bg-gray-100">
      {isLoading && <ResumeSkeleton className="mx-auto w-full md:w-3/4 lg:w-1/2" />}
      <iframe
        src={resumeLink}
        onLoad={() => setIsLoading(false)}
        className={`transition-all duration-300 ease-in-out ${isLoading ? "hidden" : "block"} w-full md:w-4/5 lg:2/3 h-dvh rounded-sm shadow-md`}
        allowFullScreen
        title="Resume Preview"
      ></iframe>
    </div>
  );
};

export default ResumeIntegration;
