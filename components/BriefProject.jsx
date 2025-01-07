"use client"
import React, { useEffect, useRef, useState } from "react";
import Badge from "./Badge";
import { NotionRenderer } from "react-notion-x";
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import ResumeSkeleton from "./ResumeSkelenton";

const BriefProject = ({ project, close }) => {
    const ref = useRef();
    const [notionData, setNotionData] = useState(null);
    const [Error, setError] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                close({});
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);

    useEffect(() => {
        if (project && project.brief) {
            const cachedData = sessionStorage.getItem(`notionData-${project.describe}`);
            if (cachedData) {
                setNotionData(JSON.parse(cachedData));
            } else {
                fetch(`/api/notion?pageId=${project.describe}`, { next: { revalidate: 3600 * 8, tags: ['notion', 'projects'] } })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.recordMap) {
                            setNotionData(data.recordMap);
                            sessionStorage.setItem(`notionData-${project.describe}`, JSON.stringify(data.recordMap));
                        } else {
                            console.error('Failed to load Notion data:', data.error);
                            setError(true);
                            sessionStorage.setItem(`notionData-${project.describe}`, JSON.stringify(null)); // Cache null for failed fetch
                        }
                    })
                    .catch((err) => {
                        console.error('Error fetching Notion data:', err);
                        setError(true);
                        sessionStorage.setItem(`notionData-${project.describe}`, JSON.stringify(null)); // Cache null for failed fetch
                    });
            }
        }
    }, [project]);

    if (!project) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500 font-semibold text-lg">Project not found.</p>
            </div>
        );
    }

    const randomSelect = () => {
        let random = Math.floor(Math.random() * 5) + 1;
        switch (random) {
            case 1:
                return "one";
            case 2:
                return "two";
            case 3:
                return "three";
            case 4:
                return "four";
            default:
                return "one";
        }
    };

    return (
        <div className="fixed w-full h-full inset-0 flex justify-center items-center bg-white/40 z-30">
            <div className="relative w-11/12 max-w-4xl rounded-lg shadow-lg backdrop-blur-sm bg-white/80" ref={ref}>
                <button
                    className="absolute top-4 right-4 text-2xl sm:text-3xl text-black bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:text-red-500 hover:font-bold transition-all z-40"
                    onClick={() => close({})}
                >
                    ✕
                </button>
                <div className="relative h-60 w-full rounded-t-lg overflow-hidden flex items-center">
                    {project.resourceType === "video" ? (
                        <video
                            src={project.static_file}
                            autoPlay
                            muted
                            loop
                            className="h-full w-full object-contain bg-neutral-400"
                        />
                    ) : (
                        <img
                            src={project.static_file}
                            alt={project.title}
                            className="h-full w-full object-contain bg-neutral-400"
                        />
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h2 className="text-white text-lg sm:text-xl font-semibold tracking-wide">
                            {project.title}
                        </h2>
                        <div className="flex gap-2 px-2 py-3">
                            {JSON.parse(project.techstack).map((skill, idx) => (
                                <Badge key={idx} text={skill} type={randomSelect()} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
                    <p className="text-gray-700 text-xl sm:text-2xl leading-relaxed">
                        {project.description}
                    </p>

                    {project.brief && !notionData && !Error && (
                        <div className="flex flex-col items-center justify-center h-72 ">
                            <div className="text-lg font-semibold text-gray-700 animate-pulse mb-4">
                                Loading Doc...
                            </div>
                            <ResumeSkeleton height={600} width={600} className="w-full md:w-3/4 lg:w-1/2 mx-auto shadow-lg rounded-lg overflow-hidden bg-white p-6" />
                        </div>
                    )}

                    {project.brief && notionData && (
                        <NotionRenderer recordMap={notionData} />
                    )}

                    {Error && (
                        <h3 className="text-red-500 font-semibold text-lg text-center">
                            Couldn't fetch notion document.
                        </h3>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefProject;
