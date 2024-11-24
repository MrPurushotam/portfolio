"use client"
import { useState } from "react";
import data from "../data/staticData.json"
import ResumeSkeleton from "./ResumeSkelenton";
const ResumeIntegration = () => {
  const { resumeDocId } = data;
  const [isLoading, setIsLoading] = useState(true);

  let resumeLink = `https://drive.google.com/file/d/${resumeDocId}/preview`;

  return (
    <div className='w-full h-svh '>
      {isLoading && <ResumeSkeleton className = "mx-auto" />}
      <iframe src={resumeLink} onLoad={()=>setIsLoading(false)} className={`w-1/2 h-svh mx-auto rounded-sm aspect-[3/2] ${isLoading ? "hidden":""}`} allowFullScreen title="Portfolio Preview"></iframe>
    </div>
  )
}

export default ResumeIntegration
